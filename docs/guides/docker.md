# Docker Setup Guide

Complete guide to setting up and customizing the Docker environment for loclaude.

## Overview

loclaude uses Docker Compose to run:

- **Ollama** - LLM inference server with GPU support
- **Open WebUI** - Web-based chat interface (optional)

## Quick Setup

```bash
# Initialize project with Docker config
loclaude init

# Start containers
loclaude docker-up

# Verify
loclaude docker-status
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Host Machine                          │
│  ┌─────────────────┐                                        │
│  │  loclaude CLI   │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Docker Network                      │   │
│  │  ┌─────────────────┐     ┌─────────────────────┐    │   │
│  │  │     Ollama      │     │     Open WebUI      │    │   │
│  │  │  :11434 (API)   │◀────│    :3000 (Web)      │    │   │
│  │  │                 │     │                     │    │   │
│  │  │  GPU: NVIDIA    │     │  GPU: NVIDIA        │    │   │
│  │  └────────┬────────┘     └─────────────────────┘    │   │
│  │           │                                          │   │
│  └───────────│──────────────────────────────────────────┘   │
│              │                                               │
│              ▼                                               │
│  ┌─────────────────┐                                        │
│  │  ./models/      │  (Persistent storage)                  │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Default docker-compose.yml

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "ollama", "list"]
      interval: 300s
      timeout: 2s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  open-webui:
    image: ghcr.io/open-webui/open-webui:cuda
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - ollama
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    volumes:
      - open-webui:/app/backend/data
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  open-webui:
```

## Customization

### Changing Ports

Edit `docker-compose.yml`:

```yaml
services:
  ollama:
    ports:
      - "8080:11434"  # Expose Ollama on port 8080

  open-webui:
    ports:
      - "8000:8080"   # Expose WebUI on port 8000
```

Update your config:

```json
{
  "ollama": {
    "url": "http://localhost:8080"
  }
}
```

### Limiting GPU Usage

Use specific GPUs:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          device_ids: ['0']  # Only GPU 0
          capabilities: [gpu]
```

Or limit count:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1  # Only 1 GPU
          capabilities: [gpu]
```

### CPU-Only Mode

Remove GPU configuration:

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    # Remove: runtime: nvidia
    environment:
      # Remove NVIDIA variables
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
    # Remove: deploy section
```

### Custom Model Storage

Change the models directory:

```yaml
volumes:
  - /data/ollama-models:/root/.ollama
```

### Memory Limits

Limit container memory:

```yaml
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 32G
        reservations:
          memory: 16G
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

## Without Open WebUI

Initialize without the web interface:

```bash
loclaude init --no-webui
```

Or manually remove the `open-webui` service from docker-compose.yml.

## Multiple Compose Files

For complex setups, use multiple compose files:

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

**docker-compose.override.yml:**
```yaml
services:
  ollama:
    environment:
      - OLLAMA_DEBUG=1
    ports:
      - "11434:11434"
      - "11435:11435"  # Additional port
```

## Networking

### Accessing from Other Containers

Other containers can reach Ollama at `http://ollama:11434` on the same Docker network.

### External Access

By default, ports are bound to `0.0.0.0`, allowing external access. To restrict to localhost:

```yaml
ports:
  - "127.0.0.1:11434:11434"
```

### Custom Network

```yaml
networks:
  llm-network:
    driver: bridge

services:
  ollama:
    networks:
      - llm-network
```

## Monitoring

### Container Stats

```bash
docker stats ollama open-webui
```

### GPU Usage

```bash
docker exec ollama nvidia-smi
```

### Logs

```bash
loclaude docker-logs --follow
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
loclaude docker-logs -s ollama

# Verify Docker
docker info

# Check GPU access
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

### Out of Memory

1. Use a smaller model
2. Increase swap space
3. Limit concurrent requests

### Port Conflicts

```bash
# Find what's using the port
lsof -i :11434

# Change port in docker-compose.yml
```

## Related

- [Docker Commands](../commands/docker.md)
- [Troubleshooting](../troubleshooting.md)
