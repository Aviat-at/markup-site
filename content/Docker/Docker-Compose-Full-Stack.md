# Understanding a Production-Style Docker Compose Setup for a Django + Next.js Stack

If you've ever wondered how to wire together a full-stack web application using Docker Compose — with a PostgreSQL database, a Django backend, and a Next.js frontend — this article walks you through a real-world `docker-compose.yml` configuration, line by line. By the end, you'll understand not just *what* each line does, but *why* it's written that way.

---

## What Are We Building?

The setup in this article runs three services together:

| Service | Technology | Role |
|---|---|---|
| `db` | PostgreSQL 16 | Database |
| `backend` | Django (Python) | REST API |
| `frontend` | Next.js (React) | UI / Client |

All three are orchestrated by Docker Compose, which handles networking, startup order, environment variables, and volume management.

---

## The Full Configuration

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-kpccc}
      POSTGRES_USER: ${POSTGRES_USER:-kpccc}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-kpccc_dev}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${POSTGRES_HOST_PORT:-5433}:5432"
      - "${BACKEND_HOST_PORT:-8001}:8000"
      - "${FRONTEND_HOST_PORT:-3001}:3000"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-kpccc}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - ./backend/.env
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-kpccc}:${POSTGRES_PASSWORD:-kpccc_dev}@127.0.0.1:5432/${POSTGRES_DB:-kpccc}
      - DJANGO_SETTINGS_MODULE=config.settings.local
      - CORS_ALLOWED_ORIGINS=http://localhost:${FRONTEND_HOST_PORT:-3001},http://127.0.0.1:${FRONTEND_HOST_PORT:-3001}
    volumes:
      - ./backend:/app
    network_mode: "service:db"
    depends_on:
      db:
        condition: service_healthy
    command: python manage.py runserver 0.0.0.0:8000

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: dev
    restart: unless-stopped
    env_file:
      - ./frontend/.env
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    network_mode: "service:db"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:${BACKEND_HOST_PORT:-8001}
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Section 1: The Database Service (`db`)

```yaml
db:
  image: postgres:16-alpine
  restart: unless-stopped
```

The `db` service uses the official **PostgreSQL 16** image based on **Alpine Linux** — a minimal Linux distribution that keeps the image footprint small. The `restart: unless-stopped` policy means Docker will automatically restart this container if it crashes or if the host machine reboots, unless you manually stop it yourself with `docker compose stop`.

### Environment Variables with Fallback Defaults

```yaml
environment:
  POSTGRES_DB: ${POSTGRES_DB:-kpccc}
  POSTGRES_USER: ${POSTGRES_USER:-kpccc}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-kpccc_dev}
```

These environment variables configure the Postgres instance on first run. The `${VAR:-default}` syntax is a shell substitution pattern that means: *use the value of `VAR` if it exists in the environment or `.env` file; otherwise, use the default after `:-`*.

This makes the configuration **flexible** — you can override any of these values in a `.env` file or in CI/CD pipelines without touching the `docker-compose.yml` itself.

### Persistent Data with Named Volumes

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

This mounts a **named volume** called `postgres_data` to the directory where Postgres stores all its data files. Without this, your database would be wiped clean every time the container is stopped or rebuilt. Named volumes are managed by Docker and survive `docker compose down` — they're only removed if you explicitly run `docker compose down -v`.

### Port Mappings — All Three on the `db` Service

```yaml
ports:
  - "${POSTGRES_HOST_PORT:-5433}:5432"
  - "${BACKEND_HOST_PORT:-8001}:8000"
  - "${FRONTEND_HOST_PORT:-3001}:3000"
```

At first glance, it seems odd that port mappings for the backend (`8000`) and frontend (`3000`) are declared on the `db` service. This is intentional and directly tied to the `network_mode: "service:db"` setting used by the other two services (more on this in a moment).

The port format is always `host_port:container_port`. So:

- `5433:5432` → your machine's port 5433 connects to Postgres inside the container
- `8001:8000` → your machine's port 8001 connects to Django inside the container
- `3001:3000` → your machine's port 3001 connects to Next.js inside the container

Using non-standard host ports (5433, 8001, 3001) avoids conflicts with other services that might already be running locally on the default ports.

### Health Checks

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-kpccc}"]
  interval: 10s
  timeout: 5s
  retries: 5
```

A healthcheck tells Docker how to determine if the service is actually *ready*, not just *running*. Postgres can take a few seconds to initialize before it accepts connections. The `pg_isready` utility is a built-in Postgres tool that probes the database connection.

Docker runs this check every 10 seconds, waits up to 5 seconds for a response, and retries up to 5 times before marking the container as **unhealthy**. Other services can use `condition: service_healthy` to wait for this check to pass before starting.

---

## Section 2: The Backend Service (Django)

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
```

Instead of pulling a pre-built image from Docker Hub, this service **builds its own image** from the `Dockerfile` inside the `./backend` directory. The `context` setting controls which files are available to Docker during the build process.

### Loading Environment Variables

```yaml
env_file:
  - ./backend/.env
environment:
  - DATABASE_URL=postgresql://...
  - DJANGO_SETTINGS_MODULE=config.settings.local
  - CORS_ALLOWED_ORIGINS=http://localhost:${FRONTEND_HOST_PORT:-3001},...
```

There are two ways environment variables are supplied here:

- **`env_file`** loads variables from a file on disk — great for secrets that shouldn't be committed to version control
- **`environment`** sets variables inline — these take precedence over `env_file` values if there's a conflict

The `DATABASE_URL` uses `127.0.0.1` (localhost) to connect to Postgres. This works because of `network_mode: "service:db"` — the backend shares the database container's network, so Postgres is literally reachable at localhost.

`DJANGO_SETTINGS_MODULE` points Django to the local development settings file (`config/settings/local.py`), keeping dev and production configurations cleanly separated.

`CORS_ALLOWED_ORIGINS` tells Django's CORS middleware which browser origins are permitted to call the API — in this case, the Next.js frontend running on port 3001.

### Live Code Sync with Bind Mounts

```yaml
volumes:
  - ./backend:/app
```

This mounts your local `./backend` directory directly into the container at `/app`. Any file you edit locally is immediately visible inside the running container — no rebuild required. Combined with Django's `runserver`, this gives you **instant hot reload** during development.

### The Key Architectural Decision: Shared Networking

```yaml
network_mode: "service:db"
```

This is the most important and unconventional line in the entire file. Instead of creating its own isolated network namespace, the backend **joins the `db` container's network stack completely**. They share the same:

- IP address
- Network interfaces
- Localhost (`127.0.0.1`)

This is why `DATABASE_URL` can point to `127.0.0.1:5432` — from the backend's perspective, Postgres is on the same "machine". It's also why the port `8001:8000` is declared on the `db` service rather than the backend — ports can only be published from the container that owns the network namespace.

### Startup Order and Dependency Management

```yaml
depends_on:
  db:
    condition: service_healthy
```

This tells Compose not to start the backend until `db` has passed its healthcheck. Without this, Django might try to connect to Postgres before it's ready and crash on startup.

### Startup Command

```yaml
command: python manage.py runserver 0.0.0.0:8000
```

This overrides whatever `CMD` is defined in the Dockerfile and starts Django's built-in development server, listening on all network interfaces at port 8000.

> **Note:** `manage.py runserver` is suitable for development only. In production, you'd replace this with a proper WSGI/ASGI server like Gunicorn or Uvicorn.

---

## Section 3: The Frontend Service (Next.js)

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
    target: dev
```

The `target: dev` option uses a **specific stage** from a multi-stage Dockerfile. Multi-stage builds allow you to define multiple build targets in one file — for example, a `dev` stage with all development dependencies, and a `prod` stage with a leaner, optimized build.

### Volume Strategy

```yaml
volumes:
  - ./frontend:/app
  - /app/node_modules
  - /app/.next
```

Three volumes are mounted here, each with a specific purpose:

1. `./frontend:/app` — syncs your local source code into the container for hot reload
2. `/app/node_modules` — an **anonymous volume** that "shadows" the `node_modules` folder. This prevents your host's `node_modules` (compiled for your OS) from overwriting the one built inside the Linux container, which could cause cryptic errors
3. `/app/.next` — similarly protects Next.js's build cache from being overwritten by the host

This pattern — bind mounting the source but protecting specific subdirectories with anonymous volumes — is a common and important Docker development technique.

### Shared Network and Frontend API URL

```yaml
network_mode: "service:db"
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:${BACKEND_HOST_PORT:-8001}
```

Like the backend, the frontend joins the `db` container's network. The `NEXT_PUBLIC_API_URL` tells the Next.js application where to find the backend API.

The `NEXT_PUBLIC_` prefix is a Next.js convention — variables with this prefix are **embedded into the browser-side JavaScript bundle** at build time, making them accessible in client components. Variables without this prefix are only available server-side.

### Dependency Chain

```yaml
depends_on:
  - backend
```

The frontend waits for the backend container to be *running* before starting. Note that unlike the backend's dependency on `db`, there's no `condition: service_healthy` here — it simply waits for the backend container to exist and be running, not necessarily for Django to be fully ready.

---

## Section 4: Top-Level Volumes

```yaml
volumes:
  postgres_data:
```

Declaring `postgres_data` at the top level registers it as a **Docker-managed named volume**. This is what gives it persistence across container restarts and rebuilds. Docker stores it in its own managed location on the host filesystem (typically `/var/lib/docker/volumes/` on Linux).

To completely wipe the database and start fresh, you'd run:

```bash
docker compose down -v
```

The `-v` flag removes named volumes along with the containers.

---

## The Complete Network Picture

Understanding how all three services relate to each other visually:

```
Your Machine (Host)
│
├── localhost:5433  ──→  db container :5432  (PostgreSQL)
├── localhost:8001  ──→  db container :8000  ──→ backend (Django, shares db network)
└── localhost:3001  ──→  db container :3000  ──→ frontend (Next.js, shares db network)

Inside the shared network namespace:
  backend  ←──127.0.0.1:5432──→  PostgreSQL
  frontend ←──127.0.0.1:8000──→  Django (if calling internally)
```

Because all three containers share the same network namespace, they communicate via `127.0.0.1` — just like processes on the same operating system.

---

## Key Concepts to Remember

| Concept | What It Does |
|---|---|
| `${VAR:-default}` | Use env var if set, otherwise use default |
| Named volumes | Persist data across container restarts |
| Bind mounts | Sync local files into the container for hot reload |
| Anonymous volumes | Protect container-specific directories from host overwrites |
| `network_mode: "service:db"` | Share another container's network namespace |
| `condition: service_healthy` | Wait for healthcheck to pass before starting |
| `NEXT_PUBLIC_` prefix | Exposes Next.js env vars to the browser |
| `target: dev` | Use a specific stage in a multi-stage Dockerfile |

---

## When to Use This Pattern

This shared-network approach (`network_mode: "service:db"`) is a clean, low-overhead pattern for **local development** when you want all services to feel like they're on the same machine. It simplifies connection strings and reduces networking complexity.

However, for **production deployments**, you'd typically want each service in its own network namespace with explicit service discovery — using Docker's default bridge networking or an orchestration platform like Kubernetes — so services are properly isolated and individually scalable.

---

## Conclusion

This `docker-compose.yml` is a well-structured development environment that demonstrates several important Docker patterns: environment variable substitution with fallbacks, healthcheck-gated startup ordering, shared network namespaces for simplified inter-service communication, and volume strategies that enable hot reload without compromising container-native dependencies.

Whether you're building your own Django + Next.js stack or just learning Docker Compose, understanding *why* each line is written the way it is — not just *what* it does — will help you adapt these patterns confidently to your own projects.

---

*Written for developers who want to go beyond copy-pasting Docker configurations and actually understand what's happening under the hood.*
