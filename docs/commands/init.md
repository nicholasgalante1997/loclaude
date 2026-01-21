# init

Initialize a new loclaude project with Docker configuration and scaffolding.

## Usage

```bash
loclaude init [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--force` | Overwrite existing files |
| `--no-webui` | Skip Open WebUI in docker-compose |
| `--gpu` | Force GPU mode (NVIDIA) |
| `--no-gpu` | Force CPU-only mode |

## GPU Auto-Detection

By default, `loclaude init` automatically detects NVIDIA GPU availability:

- **GPU detected**: Creates docker-compose with NVIDIA runtime, CUDA images
- **No GPU**: Creates CPU-only docker-compose with smaller default models

Override auto-detection with `--gpu` or `--no-gpu` flags.

## What It Creates

Running `loclaude init` creates the following structure:

```
.
├── .claude/
│   └── CLAUDE.md          # Claude Code instructions
├── .loclaude/
│   └── config.json        # loclaude configuration
├── models/                # Ollama model storage (gitignored)
├── docker-compose.yml     # Container definitions (GPU or CPU)
├── mise.toml              # Task runner configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## Examples

### Standard Initialization (Auto-detect GPU)

```bash
mkdir my-project
cd my-project
loclaude init
```

Output (with GPU):

```
  Initializing loclaude project
  ───────────────────────────────

  Detecting GPU...
✓ NVIDIA GPU detected - using GPU mode

✓ Created README.md
✓ Created docker-compose.yml (GPU mode)
✓ Created mise.toml
✓ Created .claude/CLAUDE.md
✓ Created .loclaude/ directory
✓ Created .loclaude/config.json
✓ Created models/ directory
✓ Created .gitignore

Project initialized!

Next steps:
  1. Start containers:  mise run up
  2. Pull a model:      mise run pull qwen3-coder:30b
  3. Run Claude:        mise run claude

Service URLs:
  Ollama API:  http://localhost:11434
  Open WebUI:  http://localhost:3000
```

### CPU-Only Mode

For systems without NVIDIA GPUs:

```bash
loclaude init --no-gpu
```

Output:

```
  Initializing loclaude project
  ───────────────────────────────

ℹ CPU-only mode (--no-gpu)

✓ Created README.md
✓ Created docker-compose.yml (CPU mode)
✓ Created mise.toml
✓ Created .claude/CLAUDE.md
✓ Created .loclaude/ directory
✓ Created .loclaude/config.json
✓ Created models/ directory
✓ Created .gitignore

Project initialized!

Next steps:
  1. Start containers:  mise run up
  2. Pull a model:      mise run pull qwen2.5-coder:7b
  3. Run Claude:        mise run claude
```

### Without Open WebUI

If you only need Ollama without the web interface:

```bash
loclaude init --no-webui
```

This creates a simpler docker-compose.yml with only the Ollama service.

### Force Overwrite

To regenerate files in an existing project:

```bash
loclaude init --force
```

> **Warning:** This overwrites existing configuration files.

## Generated Files

### docker-compose.yml (GPU Mode)

```yaml
# =============================================================================
# LOCLAUDE DOCKER COMPOSE - GPU MODE
# =============================================================================
# This configuration runs Ollama with NVIDIA GPU acceleration for fast inference.
#
# Prerequisites:
#   - NVIDIA GPU with CUDA support
#   - NVIDIA drivers installed on host
#   - NVIDIA Container Toolkit
# =============================================================================

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
    volumes:
      - open-webui:/app/backend/data

volumes:
  open-webui:
```

### docker-compose.yml (CPU Mode)

```yaml
# =============================================================================
# LOCLAUDE DOCKER COMPOSE - CPU MODE
# =============================================================================
# This configuration runs Ollama in CPU-only mode.
# Inference will be slower than GPU mode but works on any system.
#
# Performance notes:
#   - 7B models: ~10-20 tokens/sec on modern CPUs
#   - Larger models will be significantly slower
#   - Consider using quantized models (Q4_K_M, Q5_K_M)
# =============================================================================

services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    # NOTE: No 'runtime: nvidia' - running in CPU mode
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped

  open-webui:
    image: ghcr.io/open-webui/open-webui:main  # Non-CUDA image
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - ollama
    volumes:
      - open-webui:/app/backend/data

volumes:
  open-webui:
```

### .loclaude/config.json

**GPU Mode:**
```json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  },
  "docker": {
    "composeFile": "./docker-compose.yml",
    "gpu": true
  }
}
```

**CPU Mode:**
```json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen2.5-coder:7b"
  },
  "docker": {
    "composeFile": "./docker-compose.yml",
    "gpu": false
  }
}
```

### mise.toml

The generated mise.toml provides task shortcuts:

```toml
[tasks.up]
description = "Start Ollama and Open WebUI containers"
run = "loclaude docker-up"

[tasks.down]
description = "Stop all containers"
run = "loclaude docker-down"

[tasks.claude]
description = "Run Claude Code with local Ollama"
run = "loclaude run"

[tasks.pull]
description = "Pull a model (usage: mise run pull <model-name>)"
run = "loclaude models-pull {{arg(name='model')}}"

[tasks.models]
description = "List installed models"
run = "loclaude models"

[tasks.doctor]
description = "Check system requirements"
run = "loclaude doctor"
```

## Customization

After initialization, you can customize:

- **Ports:** Edit `docker-compose.yml` to change port mappings
- **GPU allocation:** Modify `deploy.resources.reservations.devices`
- **Default model:** Update `.loclaude/config.json`
- **Claude settings:** Edit `.claude/CLAUDE.md`

## Switching Between GPU and CPU Mode

If you need to switch modes after initial setup:

```bash
# Switch to CPU mode
loclaude init --no-gpu --force

# Switch to GPU mode
loclaude init --gpu --force
```

> **Note:** This regenerates all config files. Back up any customizations first.
