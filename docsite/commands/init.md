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

## What It Creates

Running `loclaude init` creates the following structure:

```
.
├── .claude/
│   └── CLAUDE.md          # Claude Code instructions
├── .loclaude/
│   └── config.json        # loclaude configuration
├── models/                # Ollama model storage (gitignored)
├── docker-compose.yml     # Container definitions
├── mise.toml              # Task runner configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## Examples

### Standard Initialization

```bash
mkdir my-project
cd my-project
loclaude init
```

Output:

```
Initializing loclaude project...

✓ Created README.md
✓ Created docker-compose.yml
✓ Created mise.toml
✓ Created .claude/CLAUDE.md
✓ Created .loclaude/ directory
✓ Created .loclaude/config.json
✓ Created models/ directory
✓ Created .gitignore

🎉 Project initialized!

Next steps:
  1. Start containers:  mise run up
  2. Pull a model:      mise run pull qwen3-coder:30b
  3. Run Claude:        mise run claude

Service URLs:
  Ollama API:  http://localhost:11434
  Open WebUI:  http://localhost:3000
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

### docker-compose.yml

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

### .loclaude/config.json

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
```

## Customization

After initialization, you can customize:

- **Ports:** Edit `docker-compose.yml` to change port mappings
- **GPU allocation:** Modify `deploy.resources.reservations.devices`
- **Default model:** Update `.loclaude/config.json`
- **Claude settings:** Edit `.claude/CLAUDE.md`
