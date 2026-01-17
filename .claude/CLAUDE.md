# Claude Code Instructions

Guidelines for working with this Ollama + Open WebUI Docker repository.

## Project Overview

This is a Docker-based setup for running Ollama (LLM inference) with Open WebUI (chat interface) on NVIDIA GPU systems. The stack is managed via Docker Compose with mise tasks for convenience.

## Key Files

| File | Purpose |
|------|---------|
| `docker/docker-compose.yml` | Main service definitions (ollama + open-webui) |
| `mise.toml` | Task runner configuration (use `mise tasks` to list) |
| `doc/SOURCES.md` | Reference documentation and external links |
| `scripts/run-compose.sh` | Advanced compose helper (multi-file compose setups) |

## Patterns & Conventions

### Docker Compose

- Single compose file at `docker/docker-compose.yml`
- GPU support uses NVIDIA runtime with `deploy.resources.reservations.devices`
- Service names: `ollama`, `open-webui`
- Container names match service names for easy `docker exec`
- Health checks defined for both services

### Mise Tasks

Tasks are defined in root `mise.toml`. Naming conventions:
- Simple verbs for common actions: `up`, `down`, `restart`, `status`
- Colon-separated for service-specific: `logs:ollama`, `shell:webui`
- Model operations use ollama verbs: `pull`, `list`, `rm`, `run`, `show`

### When Adding New Tasks

1. Add to `mise.toml` under the appropriate section
2. Use `dir = "{{cwd}}/docker"` when running docker compose commands
3. Include a clear `description`
4. For tasks with arguments, use `{{arg(name='argname')}}`

### Docker Volume Mounts

- Ollama models: `./models:/root/.ollama` (persists models on host)
- Open WebUI data: named volume `open-webui:/app/backend/data`

### Networking

Services communicate via Docker's internal network:
- Open WebUI reaches Ollama at `http://ollama:11434`
- External access: Ollama on port 11434, WebUI on port 3000

## Common Operations

### Testing Changes

```bash
# Rebuild and restart
mise run down && mise run up

# Check logs for errors
mise run logs

# Verify GPU access
mise run gpu
```

### Pulling New Models

```bash
mise run pull llama3.2
mise run list  # Verify
```

## Do Not

- Commit anything in `docker/models/` (gitignored, contains large model files)
- Remove the NVIDIA runtime configuration without checking GPU availability
- Change container names without updating mise tasks that reference them
