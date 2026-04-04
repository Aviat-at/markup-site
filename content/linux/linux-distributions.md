---
title: "Linux Distribution System"
date: "2026-04-04"
tags: ["linux", "distributions", "beginner"]
---

## What is a Linux Distribution?

The Linux **kernel** is just the core — it manages hardware, memory, and processes. A **distribution** (distro) bundles the kernel together with:

- A package manager
- A init system (usually `systemd`)
- Core utilities (GNU tools, `bash`, …)
- Optional: desktop environment, installer, default apps

There are 600+ active distros. Most trace back to one of three major families.

---

## The Three Major Families

### Debian
The oldest community-driven family. Known for stability and the `.deb` package format.

```
Debian
├── Ubuntu               # Most popular desktop/server distro
│   ├── Linux Mint       # Beginner-friendly, Windows-like UI
│   ├── Pop!_OS          # Developer & gaming focus (System76)
│   ├── elementary OS    # macOS-inspired design
│   └── Kubuntu / Xubuntu / Lubuntu   # Ubuntu + different DEs
├── Kali Linux           # Penetration testing & security
├── Raspberry Pi OS      # Optimised for Raspberry Pi hardware
└── MX Linux             # Lightweight, stable, highly rated
```

**Package manager:** `apt` / `dpkg`
**Package format:** `.deb`

---

### Red Hat
Enterprise-focused family. Favours stability over cutting-edge packages.

```
Red Hat
├── RHEL (Red Hat Enterprise Linux)   # Paid, enterprise support
│   ├── CentOS Stream    # Upstream preview of RHEL
│   ├── AlmaLinux        # Free RHEL binary-compatible rebuild
│   └── Rocky Linux      # Free RHEL binary-compatible rebuild
└── Fedora               # Community distro, leads RHEL features
    └── (feeds into RHEL every ~2 years)
```

**Package manager:** `dnf` / `rpm`
**Package format:** `.rpm`

---

### Arch
Rolling-release family. Always the latest packages; users build their system from scratch.

```
Arch
├── Arch Linux           # Minimal, DIY, bleeding-edge
├── Manjaro              # Arch with a user-friendly installer
├── EndeavourOS          # Arch with guided setup
└── Garuda Linux         # Gaming & performance-tuned
```

**Package manager:** `pacman`
**Package format:** `.pkg.tar.zst`
**Extra:** AUR (Arch User Repository) — community-built packages

---

## Other Notable Distros

| Distro | Family | Notable for |
|--------|--------|-------------|
| openSUSE | independent (RPM) | YaST config tool, rolling (Tumbleweed) + stable (Leap) |
| Gentoo | independent | Source-based, compile everything, maximum control |
| NixOS | independent | Declarative, reproducible system config |
| Alpine Linux | independent | Tiny (~5 MB), musl libc, popular in Docker containers |
| Void Linux | independent | runit init, rolling, no systemd |

---

## Release Models

### Fixed release
Versions ship on a schedule (e.g. every 6 months or 2 years). Packages are frozen at release and only receive security patches.

- More stable and predictable
- Software can lag behind upstream
- Examples: Ubuntu LTS, Debian stable, RHEL

### Rolling release
No versions — packages update continuously as upstream releases them.

- Always up to date
- Slightly higher risk of breakage
- Examples: Arch, openSUSE Tumbleweed, Manjaro

### LTS (Long-Term Support)
A fixed release with an extended support window (typically 5–10 years). Ideal for servers.

- Ubuntu LTS: supported for 5 years (10 with Extended Security Maintenance)
- RHEL: 10-year lifecycle

---

## Package Managers at a Glance

| Distro family | Tool | Install | Remove | Update all |
|---------------|------|---------|--------|------------|
| Debian/Ubuntu | `apt` | `apt install <pkg>` | `apt remove <pkg>` | `apt upgrade` |
| Red Hat/Fedora | `dnf` | `dnf install <pkg>` | `dnf remove <pkg>` | `dnf upgrade` |
| Arch | `pacman` | `pacman -S <pkg>` | `pacman -R <pkg>` | `pacman -Syu` |
| openSUSE | `zypper` | `zypper install <pkg>` | `zypper remove <pkg>` | `zypper update` |

### Universal package formats
These work across distros:

| Format | Tool | Notes |
|--------|------|-------|
| Snap | `snap` | Canonical, sandboxed, auto-updates |
| Flatpak | `flatpak` | Community, sandboxed, widely supported |
| AppImage | (run directly) | Single portable binary, no install needed |

---

## Init Systems

The init system is PID 1 — the first process the kernel starts. It brings up everything else.

| Init | Used by | Notes |
|------|---------|-------|
| `systemd` | Most modern distros | Units, journald, socket activation |
| `SysVinit` | Older Debian/RHEL | Shell scripts, runlevels |
| `OpenRC` | Gentoo, Alpine | Lightweight, dependency-based |
| `runit` | Void Linux | Minimal, fast boot |

```bash
# systemd — common commands
systemctl status nginx
systemctl start nginx
systemctl enable nginx    # start on boot
journalctl -u nginx -f    # follow logs for a unit
```

---

## Kernel Versions

All distros run the Linux kernel but ship different versions:

```bash
uname -r          # print running kernel version
# Example outputs:
# 6.8.0-51-generic      ← Ubuntu (stable, patched)
# 6.14.2-arch1-1        ← Arch   (latest upstream)
# 5.14.0-503.el9.x86_64 ← RHEL 9 (enterprise LTS)
```

- **Mainline** — Linus Torvalds' tree, latest features
- **Stable** — backported fixes from mainline
- **LTS kernel** — long-term maintained stable branch (e.g. 6.6 LTS)
- **Vendor kernel** — distro patches applied on top (most common in practice)

---

## Choosing a Distro

| Use case | Recommended |
|----------|-------------|
| First time on Linux | Ubuntu, Linux Mint |
| Development workstation | Ubuntu, Fedora, Pop!_OS |
| Production server | Ubuntu LTS, RHEL/AlmaLinux, Debian |
| Security / pentesting | Kali Linux |
| Containers / Docker images | Alpine Linux, Debian Slim |
| Maximum control | Arch Linux, Gentoo |
| Privacy-focused desktop | Fedora, Debian |

---

## Quick Reference

```bash
# Identify your distro
cat /etc/os-release
lsb_release -a        # on Debian-based systems

# Check kernel version
uname -r

# Check architecture
uname -m              # x86_64, aarch64, …
```
