# loclaude

Run [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with local [Ollama](https://ollama.ai/) LLMs.

loclaude provides a CLI to:
- Launch Claude Code sessions connected to your local Ollama instance
- Manage Ollama + Open WebUI Docker containers
- Pull and manage Ollama models
- Scaffold new projects with opinionated Docker configs
- **Supports both GPU and CPU-only modes**

## Installation

```bash
# With npm (requires Node.js 18+)
npm install -g loclaude

# With bun (recommended)
bun install -g loclaude
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed (`npm install -g @anthropic-ai/claude-code`)

### For GPU Mode (Recommended)

- [NVIDIA GPU](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) with drivers
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

### CPU-Only Mode

No GPU required! Use `--no-gpu` flag during init for systems without NVIDIA GPUs.

Check your setup with:

```bash
loclaude doctor
```

## Quick Start

### With GPU (Auto-detected)

```bash
# Initialize a new project (auto-detects GPU)
loclaude init

# Start Ollama + Open WebUI containers
loclaude docker-up

# Pull a model
loclaude models-pull qwen3-coder:30b

# Run Claude Code with local LLM
loclaude run
```

### CPU-Only Mode

```bash
# Initialize without GPU support
loclaude init --no-gpu

# Start containers
loclaude docker-up

# Pull a CPU-optimized model
loclaude models-pull qwen2.5-coder:7b

# Run Claude Code
loclaude run
```

## Features

### Automatic Model Loading

When you run `loclaude run`, it automatically:
1. Checks if your selected model is loaded in Ollama
2. If not loaded, warms up the model with a 10-minute keep-alive
3. Shows `[loaded]` indicator in model selection for running models

### Colorful CLI Output

All commands feature colorful, themed output for better readability:
- Status indicators with colors (green/yellow/red)
- Model sizes color-coded by magnitude
- Clear headers and structured output

### GPU Auto-Detection

`loclaude init` automatically detects NVIDIA GPUs and configures the appropriate Docker setup:
- **GPU detected**: Uses `runtime: nvidia` and CUDA-enabled images
- **No GPU**: Uses CPU-only configuration with smaller default models

## Commands

### Running Claude Code

```bash
loclaude run                    # Interactive model selection
loclaude run -m qwen3-coder:30b # Use specific model
loclaude run -- --help          # Pass args to claude
```

### Project Setup

```bash
loclaude init                   # Auto-detect GPU, scaffold project
loclaude init --gpu             # Force GPU mode
loclaude init --no-gpu          # Force CPU-only mode
loclaude init --force           # Overwrite existing files
loclaude init --no-webui        # Skip Open WebUI in compose file
```

### Docker Management

```bash
loclaude docker-up              # Start containers (detached)
loclaude docker-up --no-detach  # Start in foreground
loclaude docker-down            # Stop containers
loclaude docker-status          # Show container status
loclaude docker-logs            # Show logs
loclaude docker-logs --follow   # Follow logs
loclaude docker-restart         # Restart containers
```

### Model Management

```bash
loclaude models                 # List installed models
loclaude models-pull <name>     # Pull a model
loclaude models-rm <name>       # Remove a model
loclaude models-show <name>     # Show model details
loclaude models-run <name>      # Run model interactively (ollama CLI)
```

### Diagnostics

```bash
loclaude doctor                 # Check prerequisites
loclaude config                 # Show current configuration
loclaude config-paths           # Show config file search paths
```

## Recommended Models

### For GPU (16GB+ VRAM)

| Model | Size | Use Case |
|-------|------|----------|
| `qwen3-coder:30b` | ~17 GB | Best coding performance |
| `deepseek-coder:33b` | ~18 GB | Code understanding |
| `gpt-oss:20b` | ~13 GB | General purpose |

### For CPU or Limited VRAM

| Model | Size | Use Case |
|-------|------|----------|
| `qwen2.5-coder:7b` | ~4 GB | Coding on CPU |
| `llama3.2:3b` | ~2 GB | Fast, simple tasks |
| `gemma2:9b` | ~5 GB | General purpose |

## Configuration

loclaude supports configuration via files and environment variables.

### Config Files

Config files are loaded in priority order:

1. `./.loclaude/config.json` (project-local)
2. `~/.config/loclaude/config.json` (user global)

Example config:

```json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  },
  "docker": {
    "composeFile": "./docker-compose.yml",
    "gpu": true
  },
  "claude": {
    "extraArgs": ["--verbose"]
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_URL` | Ollama API endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Default model name | `qwen3-coder:30b` |
| `LOCLAUDE_COMPOSE_FILE` | Path to docker-compose.yml | `./docker-compose.yml` |
| `LOCLAUDE_GPU` | Enable GPU (`true`/`false`) | `true` |

### Priority

Configuration is merged in this order (highest priority first):

1. CLI arguments
2. Environment variables
3. Project config (`./.loclaude/config.json`)
4. User config (`~/.config/loclaude/config.json`)
5. Default values

## Service URLs

When containers are running:

| Service | URL | Description |
|---------|-----|-------------|
| Ollama API | http://localhost:11434 | LLM inference API |
| Open WebUI | http://localhost:3000 | Chat interface |

## Project Structure

After running `loclaude init`:

```
.
├── .claude/
│   └── CLAUDE.md          # Claude Code instructions
├── .loclaude/
│   └── config.json        # Loclaude configuration
├── models/                # Ollama model storage (gitignored)
├── docker-compose.yml     # Container definitions (GPU or CPU mode)
├── mise.toml              # Task runner configuration
└── README.md
```

## Using with mise

The `init` command creates a `mise.toml` with convenient task aliases:

```bash
mise run up              # loclaude docker-up
mise run down            # loclaude docker-down
mise run claude          # loclaude run
mise run pull <model>    # loclaude models-pull <model>
mise run doctor          # loclaude doctor
```

## Troubleshooting

### Check System Requirements

```bash
loclaude doctor
```

This verifies:
- Docker and Docker Compose installation
- NVIDIA GPU detection (optional)
- NVIDIA Container Toolkit (optional)
- Claude Code CLI
- Ollama API connectivity

### Container Issues

```bash
# View logs
loclaude docker-logs --follow

# Restart containers
loclaude docker-restart

# Full reset
loclaude docker-down && loclaude docker-up
```

### Connection Issues

If Claude Code can't connect to Ollama:

1. Verify Ollama is running: `loclaude docker-status`
2. Check the API: `curl http://localhost:11434/api/tags`
3. Verify your config: `loclaude config`

### GPU Not Detected

If you have a GPU but it's not detected:

1. Check NVIDIA drivers: `nvidia-smi`
2. Test Docker GPU access: `docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi`
3. Install NVIDIA Container Toolkit if missing
4. Re-run `loclaude init --gpu` to force GPU mode

### Running on CPU

If inference is slow on CPU:

1. Use smaller, quantized models: `qwen2.5-coder:7b`, `llama3.2:3b`
2. Expect ~10-20 tokens/sec on modern CPUs
3. Consider cloud models via Ollama: `glm-4.7:cloud`

## Development

### Building from Source

```bash
git clone https://github.com/nicholasgalante1997/docker-ollama.git loclaude
cd loclaude
bun install
bun run build
```

### Running Locally

```bash
# With bun (direct)
bun bin/index.ts --help

# With node (built)
node bin/index.mjs --help
```

### Testing

```bash
# Test both runtimes
bun bin/index.ts doctor
node bin/index.mjs doctor
```

## License

MIT
