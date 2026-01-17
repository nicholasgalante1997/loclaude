# Ollama + Open WebUI Docker Setup

A containerized setup for running [Ollama](https://ollama.ai/) with [Open WebUI](https://openwebui.com/) on NVIDIA GPU-enabled systems.

## Prerequisites

- Docker with Docker Compose v2
- NVIDIA GPU with drivers installed
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)
- [Mise](https://mise.jdx.dev/) (optional, for task management)

## Quick Start

```bash
# Start both services
docker compose -f docker/docker-compose.yml up -d

# Or with mise
mise run up
```

Once started:
- **Open WebUI**: http://localhost:3000
- **Ollama API**: http://localhost:11434

## Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| ollama | `ollama/ollama:latest` | 11434 | LLM inference server with GPU support |
| open-webui | `ghcr.io/open-webui/open-webui:cuda` | 3000 | Web interface for interacting with Ollama |

## Mise Tasks

This project uses [mise](https://mise.jdx.dev/) for task management. Run `mise tasks` to see all available commands.

### Container Management

```bash
mise run up        # Start containers
mise run down      # Stop containers
mise run restart   # Restart containers
mise run status    # Show container status
mise run health    # Check health status
mise run urls      # Display service URLs
```

### Logs

```bash
mise run logs          # Follow all logs
mise run logs:ollama   # Follow Ollama logs
mise run logs:webui    # Follow Open WebUI logs
```

### Model Management

```bash
mise run list              # List downloaded models
mise run pull llama3.2     # Pull a model
mise run rm llama3.2       # Remove a model
mise run run llama3.2      # Run model interactively
mise run show llama3.2     # Show model info
```

### Shell Access & Diagnostics

```bash
mise run shell:ollama  # Shell into Ollama container
mise run shell:webui   # Shell into Open WebUI container
mise run gpu           # Check GPU status (nvidia-smi)
mise run help          # Ollama CLI help
```

## Directory Structure

```
.
├── docker/
│   ├── docker-compose.yml   # Main Docker Compose configuration
│   └── models/              # Ollama model storage (gitignored)
├── doc/
│   └── SOURCES.md           # Reference documentation and links
├── scripts/
│   └── run-compose.sh       # Advanced compose helper script
├── mise.toml                # Mise task definitions
└── README.md
```

## Configuration

### GPU Configuration

GPU support is enabled by default. The docker-compose.yml uses:
- NVIDIA runtime
- All available GPUs (`count: all`)
- Compute and utility driver capabilities

To limit GPU usage, modify `docker/docker-compose.yml`:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1  # Use only 1 GPU
          capabilities: [gpu]
```

### Ports

Default ports can be changed in `docker/docker-compose.yml`:
- Ollama API: `11434:11434`
- Open WebUI: `3000:8080`

### Model Storage

Models are persisted to `docker/models/` on the host. This directory is gitignored.

## Useful Links

- [Ollama Documentation](https://docs.ollama.com/)
- [Open WebUI Documentation](https://docs.openwebui.com/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)

See `doc/SOURCES.md` for additional reference documentation.
