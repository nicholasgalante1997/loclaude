# loclaude

Run [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with local [Ollama](https://ollama.ai/) LLMs.

loclaude provides a CLI to:
- Launch Claude Code sessions connected to your local Ollama instance
- Manage Ollama + Open WebUI Docker containers
- Pull and manage Ollama models
- Scaffold new projects with opinionated Docker configs

## Installation

```bash
# With npm (requires Node.js 18+)
npm install -g loclaude

# With bun (recommended)
bun install -g loclaude
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- [NVIDIA GPU](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) with drivers and container toolkit
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed (`npm install -g @anthropic-ai/claude-code`)

Check your setup with:

```bash
loclaude doctor
```

## Quick Start

```bash
# Initialize a new project with Docker configs
loclaude init

# Start Ollama + Open WebUI containers
loclaude docker-up

# Pull a model
loclaude models-pull qwen3-coder:30b

# Run Claude Code with local LLM (interactive model selection)
loclaude run
```

## Commands

### Running Claude Code

```bash
loclaude run                    # Interactive model selection
loclaude run -m qwen3-coder:30b # Use specific model
loclaude run -- --help          # Pass args to claude
```

### Project Setup

```bash
loclaude init                   # Scaffold docker-compose.yml, config, mise.toml
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
├── docker-compose.yml     # Container definitions
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
- NVIDIA GPU detection
- NVIDIA Container Toolkit
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
