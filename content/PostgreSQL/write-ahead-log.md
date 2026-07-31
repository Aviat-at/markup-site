---
title: "PostgreSQL Write-Ahead Logging (WAL): The Diary That Saves Your Data"
date: "2026-07-30"
tags: ["postgresql", "database", "durability", "internals", "replication"]
---

# PostgreSQL Write-Ahead Logging (WAL)

Every durable database has to answer one uncomfortable question: **what happens if the power goes out in the middle of a write?**

PostgreSQL's answer is the **Write-Ahead Log** — WAL. It is a single, append-only record of every change the database is about to make, written to durable storage *before* the change itself is applied to the data files. If the server dies mid-flight, PostgreSQL reads that log back on startup and replays it until the cluster is exactly where it left off.

This article walks through what WAL is, how the write path actually works, how crash recovery uses it, what else the log powers (replication, point-in-time recovery, CDC), and the configuration and operational details that matter in production.

---

## The Problem WAL Solves

PostgreSQL does not read and write your tables directly on disk. It keeps 8 KB **pages** in a shared memory cache (`shared_buffers`). When you run an `UPDATE`, the page is modified *in memory* and marked dirty. Flushing it to disk happens later, in the background.

That design is fast, but it creates two dangerous windows:

1. **Modified data lives only in RAM.** A crash before the flush loses the change — even though the client was told the transaction committed.
2. **A single flush is not atomic.** An 8 KB page write can be torn in half by a power loss, leaving a page that is half old and half new — corruption, not just data loss.

Flushing every changed page at every commit would close both windows, but it would also destroy throughput: pages are scattered all over the disk, so each commit becomes a burst of random I/O.

WAL is the compromise. Instead of forcing the *data* to disk at commit time, PostgreSQL forces a compact *description of the change* to disk — sequentially, to one file, in one `fsync`.

> Random writes are expensive. Sequential writes are cheap. WAL converts the durability cost of a commit from the former into the latter.

---

## The Rule

The whole system rests on one invariant, the **write-ahead rule**:

> A change must be described in the log, and that log record must be safely on durable storage, **before** the change itself is allowed to reach the data files — and before the commit is acknowledged to the client.

"Write-ahead" is literal: the log is written *ahead of* the change. Two consequences follow:

- **At commit time** — all WAL records for the transaction are flushed and `fsync`ed. Only then does the client see `COMMIT`.
- **Before any dirty page is written out** — the WAL describing that page's modification must already be durable. This guarantees that a data file on disk is never "ahead of" the log that explains it.

---

## The Write Path

Here is what actually happens when you run a statement that modifies data:

```text
   Client
     │  UPDATE accounts SET balance = balance - 100 WHERE id = 42;
     ▼
┌─────────────────────── Shared memory ────────────────────────┐
│                                                              │
│  ┌────────────────┐   (1) describe the change first          │
│  │  WAL buffers   │◀──────────────────────────────┐          │
│  └───────┬────────┘                               │          │
│          │                             ┌──────────┴───────┐  │
│          │                             │  Shared buffers  │  │
│          │                             │  (8 KB pages)    │  │
│          │                             └──────────┬───────┘  │
│          │                     (2) then modify the page      │
└──────────┼────────────────────────────────────────┼──────────┘
           │ (3) flush + fsync at COMMIT   (4) later, at a checkpoint
           ▼                                        ▼
   ┌───────────────┐                       ┌─────────────────┐
   │  pg_wal/      │                       │  base/  heap    │
   │  WAL segments │                       │  & index files  │
   └───────────────┘                       └─────────────────┘
      durable NOW                            durable LATER
```

Step by step:

| Step | What happens | Where |
|---|---|---|
| 1 | A WAL record describing the change is built and appended to the WAL buffers | RAM |
| 2 | The data page in `shared_buffers` is modified and marked dirty | RAM |
| 3 | On `COMMIT`, WAL up to the commit record is written and `fsync`ed | Disk (`pg_wal/`) |
| 4 | Dirty pages are written to the data files by the checkpointer / background writer | Disk (`base/`) |

The client waits for step 3. Step 4 is asynchronous, batched, and invisible to the application — which is exactly why PostgreSQL can commit thousands of transactions per second on modest hardware.

---

## Anatomy of the Log

### LSN — the address of every byte

WAL is one continuous byte stream for the entire cluster (not per database). Every position in it has a **Log Sequence Number**: a 64-bit offset printed as two hex halves.

```sql
SELECT pg_current_wal_lsn();
--  0/16B3B48
```

LSNs are monotonically increasing, which makes them the database's global ordering primitive. Replication lag, recovery targets, and page freshness are all expressed as LSN comparisons.

### Segments — the files on disk

The stream is stored in `pg_wal/` as fixed-size **segment files**, 16 MB by default (set at `initdb` time with `--wal-segsize`). Each filename is 24 hex characters:

```text
 0000 0001 00000000 00000009
 └───┬───┘ └──┬───┘ └──┬───┘
     │        │        └── segment number within that logical file
     │        └─────────── high 32 bits of the LSN
     └──────────────────── timeline ID
```

The **timeline ID** increments each time a cluster is promoted or recovered to a point in time, so history that diverged never overwrites history that came before it.

### Records — the entries in the diary

Each record carries the transaction ID, a resource manager (heap, btree, transaction, …), the relation and block it touches, the change payload, a pointer to the previous record, and a CRC. A partially written record fails its checksum and cleanly ends replay — that is how PostgreSQL knows where a crashed log stops.

```text
 LSN grows monotonically  ──────────────────────────────────▶

 ┌─────────────────────────────┬─────────────────────────────┐
 │  000000010000000000000009   │  00000001000000000000000A   │
 │      16 MB segment          │      16 MB segment          │
 └─────────────────────────────┴─────────────────────────────┘
    ▲              ▲                    ▲
    │              │                    │
  record         record               record
  xid 5012       xid 5013             xid 5013
  HEAP/UPDATE    BTREE/INSERT         XACT/COMMIT   ◀── fsync to here
                                                        before ack
```

You can read real records with `pg_waldump`:

```bash
pg_waldump -p /var/lib/postgresql/18/main/pg_wal 000000010000000000000009 | head
```

---

## Checkpoints: Where Recovery Starts

If PostgreSQL had to replay the log from the beginning of time, recovery would take hours. **Checkpoints** bound that work.

A checkpoint is a point at which PostgreSQL guarantees that every change made before it is already in the data files. The checkpointer flushes all dirty shared buffers, `fsync`s the data files, writes a checkpoint record into WAL, and records its location in the `pg_control` file.

```text
 time ────────────────────────────────────────────────────────▶

     checkpoint N                                       ✗ CRASH
     (REDO point)                                          │
  ───────┬───────────────────────────────────────────────┬──
         │                                               │
         │◀───────── WAL that must be replayed ─────────▶│
         │
   everything before this point is already
   guaranteed to be in the data files
```

Checkpoints are triggered by time (`checkpoint_timeout`, default 5 min) or by volume (`max_wal_size`, default 1 GB), whichever comes first. `checkpoint_completion_target` (default 0.9) spreads the flushing across the interval so a checkpoint is a gentle ramp rather than an I/O spike.

**The tuning trade-off:** frequent checkpoints mean fast recovery but more I/O and more WAL volume; infrequent checkpoints mean less I/O but a longer window to replay after a crash.

---

## Torn Pages and Full-Page Writes

A crash during an 8 KB page write can leave the page half-updated. Replaying an incremental WAL record onto a *corrupt* page produces garbage, so redo alone is not enough.

PostgreSQL's defence is **full-page writes**. The first time a page is modified after a checkpoint, the entire page image (an FPI) is copied into WAL. During recovery, that image overwrites whatever mess is on disk, and subsequent incremental records apply cleanly on top of a known-good page.

This is why WAL volume spikes right after every checkpoint, and why workloads with random write patterns — for example, random UUID primary keys scattering inserts across an index — generate dramatically more WAL than sequential ones. Widening `max_wal_size` reduces checkpoint frequency, which directly reduces the number of full-page images written.

Count them for any statement with `EXPLAIN`:

```sql
EXPLAIN (ANALYZE, BUFFERS, WAL)
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
--  WAL: records=3  fpi=1  bytes=8524
```

Or cluster-wide:

```sql
SELECT wal_records,
       wal_fpi,
       pg_size_pretty(wal_bytes) AS wal_bytes,
       wal_buffers_full
FROM pg_stat_wal;
```

A steadily climbing `wal_buffers_full` means backends are stalling to flush WAL buffers — raise `wal_buffers`.

---

## Crash Recovery

On startup, PostgreSQL checks `pg_control`. If the cluster was not shut down cleanly, it enters recovery:

1. Read the last valid checkpoint record and its **REDO point**.
2. Replay WAL forward from that point, record by record.
3. Stop at the first record that fails its CRC — that is where the crash cut the log.
4. Roll back transactions that never got a commit record.
5. Open for connections.

For each record, PostgreSQL compares the record's LSN with the LSN stamped in the page header (`pd_lsn`) to avoid redoing work already on disk:

```text
 for each WAL record after the REDO point:

        record.lsn  >  page.pd_lsn ?
                │               │
              yes               no
                │               │
                ▼               ▼
        apply the change    skip — already durable
```

The guarantee this delivers is precise: **every transaction that returned a successful `COMMIT` is present after recovery, and every transaction that did not is completely absent.** No half-applied transactions, ever.

---

## WAL Is More Than a Safety Net

Once you have an ordered, complete record of every change in the cluster, other features fall out of it almost for free. This is the single most important thing to understand about WAL: it is not just crash insurance, it is PostgreSQL's change data backbone.

```text
                          ┌──────────────┐
                          │  WAL records │
                          └──────┬───────┘
        ┌──────────────┬─────────┴────────┬──────────────────┐
        ▼              ▼                  ▼                  ▼
  Crash recovery   Streaming         WAL archiving     Logical decoding
  redo on start    replication       → PITR: restore   → CDC, logical
                   (hot standby)       to any second     replication
```

| Consumer | How it uses WAL | Requires |
|---|---|---|
| Crash recovery | Replays from the last checkpoint | Always on |
| Physical replication | Standby streams and replays the primary's WAL continuously | `wal_level = replica` |
| Point-in-time recovery | Base backup + archived WAL replayed to a chosen timestamp or LSN | `archive_mode`, `archive_command` |
| Logical replication / CDC | WAL is decoded into row-level changes for subscribers or tools like Debezium | `wal_level = logical` |

A standby is really just a server permanently stuck in recovery, replaying the primary's log as it arrives. Point-in-time recovery is the same replay, stopped early at a target you choose.

---

## Configuration That Matters

| Parameter | Default | What it does |
|---|---|---|
| `wal_level` | `replica` | How much detail is logged: `minimal`, `replica`, `logical` |
| `fsync` | `on` | Whether writes are forced to durable storage. **Never turn this off in production** |
| `synchronous_commit` | `on` | Whether commits wait for the WAL flush |
| `max_wal_size` | `1GB` | Soft ceiling on WAL between checkpoints |
| `min_wal_size` | `80MB` | WAL kept preallocated for recycling |
| `checkpoint_timeout` | `5min` | Maximum time between checkpoints |
| `checkpoint_completion_target` | `0.9` | Fraction of the interval used to spread checkpoint I/O |
| `wal_buffers` | `-1` (auto) | Shared memory staging area for WAL |
| `wal_compression` | `off` | Compresses full-page images (`pglz`, `lz4`, `zstd`) |
| `archive_mode` / `archive_command` | `off` | Ships completed segments off-box for PITR |
| `max_slot_wal_keep_size` | `-1` | Caps WAL retained for replication slots |

### The durability dial

`synchronous_commit` is the one knob that genuinely trades safety for speed. It is per-transaction, so you can be strict on payments and relaxed on analytics inserts in the same database.

| Value | Commit waits for | Risk on crash |
|---|---|---|
| `off` | Nothing — WAL flushed by a background writer | Up to ~3 × `wal_writer_delay` of recent commits lost |
| `local` | Local WAL flush | Safe locally; standby may be behind |
| `remote_write` | Standby received it into the OS | Loss only if both machines fail |
| `on` (default) | Local flush (+ standby flush if synchronous replication is configured) | None |
| `remote_apply` | Standby has applied it and can serve the read | None; highest latency |

The critical distinction: `synchronous_commit = off` can lose the *most recent* commits, but it **never corrupts the database** — WAL ordering is still enforced. Turning off `fsync` is a completely different thing and can leave the cluster unrecoverable. Do not confuse the two.

---

## Operational Reality

### `pg_wal` filling the disk

This is the classic PostgreSQL 3 a.m. incident. If `pg_wal` fills the filesystem, the cluster shuts down. There are three usual causes, and each has a specific fix:

```sql
-- 1. An inactive replication slot pinning WAL forever
SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained
FROM pg_replication_slots
ORDER BY retained DESC;
```

A slot left behind by a decommissioned standby holds WAL indefinitely. Drop it with `pg_drop_replication_slot()`, and set `max_slot_wal_keep_size` so a broken consumer can never take the primary down again.

```bash
# 2. A failing archive_command — .ready files pile up
ls /var/lib/postgresql/18/main/pg_wal/archive_status/*.ready | wc -l
```

If archiving fails, PostgreSQL refuses to recycle segments. Check the server log for the command's exit status and fix the destination.

```sql
-- 3. Long-running transactions and checkpoint pressure
SELECT num_timed, num_requested, write_time, sync_time
FROM pg_stat_checkpointer;   -- PostgreSQL 17+; pg_stat_bgwriter before that
```

If `num_requested` is large relative to `num_timed`, checkpoints are being forced by WAL volume rather than by time — `max_wal_size` is too small for the workload.

> **Never delete files from `pg_wal` by hand.** Those files are the only copy of committed transactions that have not yet reached the data files. Removing them can make the cluster unrecoverable. Fix the cause, or use `pg_archivecleanup` against the *archive*, not the live directory.

### Useful inspection queries

```sql
-- Where are we in the log right now?
SELECT pg_current_wal_lsn()              AS flushed,
       pg_current_wal_insert_lsn()       AS inserted,
       pg_walfile_name(pg_current_wal_lsn()) AS current_segment;

-- How much WAL did a workload generate? (psql: \gset captures the start LSN)
SELECT pg_current_wal_lsn() AS start_lsn \gset
-- ...run the workload here...
SELECT pg_size_pretty(
         pg_wal_lsn_diff(pg_current_wal_lsn(), :'start_lsn'::pg_lsn)
       ) AS wal_generated;

-- Replica lag, in bytes, per standby
SELECT application_name,
       pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS replay_lag
FROM pg_stat_replication;
```

---

## The Mental Model

Strip away the implementation and WAL is three ideas:

1. **Describe before you do.** Intent hits durable storage before the change does.
2. **Checkpoints bound the past.** Everything before the last checkpoint is already safe on disk, so recovery only ever replays a bounded, recent tail of the log.
3. **An ordered log is a superpower.** The same stream that rebuilds a crashed server also feeds replicas, backups, and change-data pipelines.

The diary metaphor holds all the way down. PostgreSQL writes down what it is about to do, then does it. When something goes wrong, it opens the diary at the last page it knows was safe and works forward until it catches up with itself.

---

## Further Reading

- [PostgreSQL docs — Write-Ahead Logging (WAL)](https://www.postgresql.org/docs/current/wal.html)
- [PostgreSQL docs — WAL Configuration](https://www.postgresql.org/docs/current/wal-configuration.html)
- [PostgreSQL docs — Continuous Archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)
- [PostgreSQL docs — Logical Decoding](https://www.postgresql.org/docs/current/logicaldecoding.html)
