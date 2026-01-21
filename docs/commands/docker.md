# Docker Commands

Commands for managing the Ollama and Open WebUI Docker containers.

## Commands

| Command | Description |
|---------|-------------|
| `docker-up` | Start containers |
| `docker-down` | Stop containers |
| `docker-status` | Show container status |
| `docker-logs` | View container logs |
| `docker-restart` | Restart containers |

## docker-up

Start the Ollama and Open WebUI containers.

### Usage

```bash
loclaude docker-up [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |
| `--no-detach` | Run in foreground (don't detach) |

### Examples

```bash
# Start in background (default)
loclaude docker-up

# Start in foreground
loclaude docker-up --no-detach

# Use custom compose file
loclaude docker-up -f ./custom/docker-compose.yml
```

## docker-down

Stop and remove containers.

### Usage

```bash
loclaude docker-down [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |

### Examples

```bash
loclaude docker-down
```

## docker-status

Show the status of containers.

### Usage

```bash
loclaude docker-status [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |

### Example Output

```
NAME         IMAGE                              STATUS          PORTS
ollama       ollama/ollama:latest              Up 2 hours      0.0.0.0:11434->11434/tcp
open-webui   ghcr.io/open-webui/open-webui     Up 2 hours      0.0.0.0:3000->8080/tcp
```

## docker-logs

View container logs.

### Usage

```bash
loclaude docker-logs [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |
| `--follow` | Follow log output (like `tail -f`) |
| `-s, --service <name>` | Show logs for specific service |

### Examples

```bash
# View all logs
loclaude docker-logs

# Follow logs in real-time
loclaude docker-logs --follow

# View only Ollama logs
loclaude docker-logs -s ollama

# Follow specific service
loclaude docker-logs --follow -s open-webui
```

## docker-restart

Restart containers.

### Usage

```bash
loclaude docker-restart [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |

### Examples

```bash
loclaude docker-restart
```

## Configuration

### Compose File Location

By default, loclaude looks for `docker-compose.yml` in the current directory. You can override this:

1. **CLI option:** `-f ./path/to/docker-compose.yml`
2. **Environment variable:** `LOCLAUDE_COMPOSE_FILE`
3. **Config file:**
   ```json
   {
     "docker": {
       "composeFile": "./docker/docker-compose.yml"
     }
   }
   ```

### GPU Configuration

GPU support is enabled by default. To disable:

```json
{
  "docker": {
    "gpu": false
  }
}
```

Or via environment:

```bash
export LOCLAUDE_GPU=false
```

## Troubleshooting

### Containers Won't Start

Check the logs:

```bash
loclaude docker-logs
```

Common issues:

- **Port already in use:** Change ports in docker-compose.yml
- **GPU not available:** Verify NVIDIA Container Toolkit installation
- **Out of memory:** Reduce model size or close other applications

### GPU Not Detected

Verify the NVIDIA runtime:

```bash
docker run --gpus all nvidia/cuda:11.0-base nvidia-smi
```

If this fails, reinstall the NVIDIA Container Toolkit:

```bash
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### Container Keeps Restarting

Check for health check failures:

```bash
docker inspect ollama --format='{{.State.Health.Status}}'
```

View detailed health logs:

```bash
docker inspect ollama --format='{{json .State.Health}}' | jq
```
