---
title: "Filesystem & Navigation"
date: "2026-04-04"
tags: ["linux", "filesystem", "navigation", "beginner"]
---

## The Linux Filesystem Tree

Linux uses a single unified tree rooted at `/`. Everything — disks, devices, network shares — is mounted somewhere inside it.

```
/
├── bin/        # Essential user binaries (ls, cp, mv …)
├── boot/       # Kernel and bootloader files
├── dev/        # Device files (disks, TTYs …)
├── etc/        # System-wide config files
├── home/       # User home directories
├── lib/        # Shared libraries
├── media/      # Auto-mounted removable drives
├── mnt/        # Temporary manual mounts
├── opt/        # Optional / third-party software
├── proc/       # Virtual FS — live kernel & process info
├── root/       # Home directory for the root user
├── run/        # Runtime data (PIDs, sockets)
├── srv/        # Data served by this machine
├── sys/        # Virtual FS — hardware/kernel objects
├── tmp/        # Temporary files (cleared on reboot)
├── usr/        # User programs, libraries, docs
└── var/        # Variable data — logs, caches, spool
```

---

## pwd — Where am I?

`pwd` (print working directory) prints your current location.

```bash
pwd
# /home/akash
```

---

## cd — Change Directory

```bash
cd /etc               # absolute path — always from /
cd Documents          # relative path — from current location
cd ..                 # go up one level
cd ../..              # go up two levels
cd ~                  # go to your home directory
cd -                  # go back to the previous directory
```

> **Tip:** `cd` with no arguments is the same as `cd ~`.

---

## ls — List Directory Contents

```bash
ls                    # list current directory
ls /var/log           # list a specific path
ls -l                 # long format (permissions, owner, size, date)
ls -a                 # include hidden files (dotfiles)
ls -la                # long format + hidden files
ls -lh                # human-readable file sizes (KB, MB …)
ls -lt                # sort by modification time, newest first
ls -lS                # sort by file size, largest first
ls -R                 # recursive — list all subdirectories too
```

### Reading `ls -l` output

```
-rw-r--r-- 1 akash akash 4096 Apr 04 10:00 notes.txt
│          │ │     │     │    │             └─ filename
│          │ │     │     │    └─ modification date
│          │ │     │     └─ size in bytes
│          │ │     └─ group
│          │ └─ owner
│          └─ hard link count
└─ type + permissions
```

**File type character:**

| Symbol | Meaning |
|--------|---------|
| `-` | regular file |
| `d` | directory |
| `l` | symbolic link |
| `c` | character device |
| `b` | block device |

**Permission blocks** (repeated 3×: owner / group / others):

| Character | Meaning |
|-----------|---------|
| `r` | read |
| `w` | write |
| `x` | execute |
| `-` | permission not set |

---

## tree — Visual Directory Tree

`tree` is not always installed by default.

```bash
sudo apt install tree   # Debian/Ubuntu
```

```bash
tree                    # tree from current directory
tree /etc               # tree from a specific path
tree -L 2               # limit depth to 2 levels
tree -a                 # include hidden files
tree -d                 # directories only
tree -h                 # human-readable sizes
tree --dirsfirst        # list directories before files
```

---

## find — Search the Filesystem

`find` is one of the most powerful Linux commands.

```bash
# Basic syntax
find <where> <what>

# Find by name
find . -name "notes.txt"          # exact name, case-sensitive
find . -iname "*.md"              # case-insensitive glob

# Find by type
find /home -type f                # files only
find /home -type d                # directories only
find /home -type l                # symbolic links only

# Find by size
find / -size +100M                # larger than 100 MB
find /tmp -size -10k              # smaller than 10 KB

# Find by modification time
find . -mtime -7                  # modified in the last 7 days
find . -mtime +30                 # not modified in 30+ days

# Find by permissions
find /etc -perm 644               # exactly 644
find /usr/bin -perm /u+s          # setuid bit set (SUID)

# Execute a command on results
find . -name "*.log" -delete      # delete all .log files found
find . -type f -exec chmod 644 {} \;   # chmod every file found
```

> **`{}`** is replaced by each found path. **`\;`** ends the `-exec` expression.

---

## Useful Path Shortcuts

| Shortcut | Expands to |
|----------|------------|
| `~` | your home directory (`/home/akash`) |
| `.` | current directory |
| `..` | parent directory |
| `-` | previous directory (used with `cd`) |
| `/` | filesystem root |

---

## Absolute vs Relative Paths

```bash
# Absolute — starts with /
cd /home/akash/Documents

# Relative — starts from current location
cd Documents           # if you're already in /home/akash
cd ./Documents         # same, ./ is optional
cd ../akash/Documents  # traverse up then back down
```

---

## stat — Detailed File Metadata

```bash
stat notes.txt
```

```
  File: notes.txt
  Size: 4096        Blocks: 8       IO Block: 4096   regular file
Device: 8,1         Inode: 131073   Links: 1
Access: (0644/-rw-r--r--)  Uid: (1000/akash)  Gid: (1000/akash)
Access: 2026-04-04 09:15:00
Modify: 2026-04-04 09:10:00
Change: 2026-04-04 09:10:00
```

---

## du — Disk Usage

```bash
du -sh *              # size of every item in current dir
du -sh /var/log       # size of a specific directory
du -ah --max-depth=1  # per-item sizes, 1 level deep
```

---

## df — Disk Free Space

```bash
df -h                 # all mounted filesystems, human-readable
df -h /home           # just the filesystem containing /home
```

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `pwd` | print current directory |
| `cd <path>` | change directory |
| `ls -lah` | detailed listing including hidden files |
| `tree -L 2` | visual tree, 2 levels deep |
| `find . -name "*.md"` | find files by name pattern |
| `stat <file>` | full metadata for a file |
| `du -sh *` | disk usage per item |
| `df -h` | free space on all filesystems |
