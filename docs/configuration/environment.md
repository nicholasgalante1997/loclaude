# Environment Variables

loclaude reads several environment variables for configuration.

## Available Variables

| Variable | Config Equivalent | Default | Description |
|----------|------------------|---------|-------------|
| `OLLAMA_URL` | `ollama.url` | `http://localhost:11434` | Ollama API endpoint |
| `OLLAMA_MODEL` | `ollama.defaultModel` | `qwen3-coder:30b` | Default model |
| `LOCLAUDE_COMPOSE_FILE` | `docker.composeFile` | `./docker-compose.yml` | Compose file path |
| `LOCLAUDE_GPU` | `docker.gpu` | `true` | Enable GPU (`true`/`false`) |

## Priority

Environment variables override config files but are overridden by CLI arguments:

```
CLI args > Env vars > Project config > User config > Defaults
```

## Setting Variables

### Temporary (Current Session)

```bash
export OLLAMA_URL="http://192.168.1.100:11434"
loclaude run
```

### Permanent (Shell Profile)

Add to `~/.bashrc`, `~/.zshrc`, or similar:

```bash
# loclaude configuration
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="qwen3-coder:30b"
```

Then reload:

```bash
source ~/.bashrc
```

### Per-Command

```bash
OLLAMA_URL="http://remote:11434" loclaude run
```

### In Scripts

```bash
#!/bin/bash
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="llama3.2"

loclaude run -m "$OLLAMA_MODEL"
```

## Variable Details

### OLLAMA_URL

The HTTP endpoint for the Ollama API.

```bash
# Local Docker (default)
export OLLAMA_URL="http://localhost:11434"

# Remote server
export OLLAMA_URL="http://192.168.1.100:11434"

# Custom port
export OLLAMA_URL="http://localhost:8080"
```

### OLLAMA_MODEL

Default model when `-m` flag is not provided.

```bash
# Large coding model
export OLLAMA_MODEL="qwen3-coder:30b"

# Smaller, faster model
export OLLAMA_MODEL="llama3.2:3b"

# Specific version
export OLLAMA_MODEL="codellama:13b-instruct"
```

### LOCLAUDE_COMPOSE_FILE

Path to the Docker Compose file.

```bash
# Default
export LOCLAUDE_COMPOSE_FILE="./docker-compose.yml"

# Custom location
export LOCLAUDE_COMPOSE_FILE="./docker/compose.yml"

# Absolute path
export LOCLAUDE_COMPOSE_FILE="/opt/loclaude/docker-compose.yml"
```

### LOCLAUDE_GPU

Enable or disable GPU support. Accepts:
- `true`, `1` - Enable GPU
- `false`, `0` - Disable GPU

```bash
# Enable GPU (default)
export LOCLAUDE_GPU="true"

# Disable for CPU-only systems
export LOCLAUDE_GPU="false"
```

## Using .env Files

loclaude doesn't automatically load `.env` files, but you can use tools like [direnv](https://direnv.net/):

**.envrc:**
```bash
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="qwen3-coder:30b"
```

Then:
```bash
direnv allow
loclaude run  # Uses env vars from .envrc
```

## Checking Current Values

View the effective configuration (including env vars):

```bash
loclaude config
```

Check specific environment variables:

```bash
echo $OLLAMA_URL
echo $OLLAMA_MODEL
```

## Common Patterns

### Development vs Production

```bash
# Development (local)
export OLLAMA_URL="http://localhost:11434"

# Production (remote server)
export OLLAMA_URL="http://gpu-server.internal:11434"
```

### CI/CD Pipelines

```yaml
# GitHub Actions example
env:
  OLLAMA_URL: ${{ secrets.OLLAMA_URL }}
  LOCLAUDE_GPU: "false"

steps:
  - run: loclaude doctor
```

### Docker Compose Override

When running loclaude itself in Docker:

```yaml
services:
  loclaude:
    environment:
      - OLLAMA_URL=http://ollama:11434
      - OLLAMA_MODEL=llama3.2
```

## Related

- [Config Files](files.md)
- [Configuration Overview](../configuration.md)
