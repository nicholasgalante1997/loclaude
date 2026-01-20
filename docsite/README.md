# loclaude

**loclaude** (Local Claude) is a CLI tool that connects [Claude Code](https://docs.anthropic.com/en/docs/claude-code) to your local [Ollama](https://ollama.ai/) instance, enabling you to use local LLMs as your AI coding assistant.

## What is loclaude?

loclaude bridges the gap between Claude Code's powerful coding interface and locally-run open-source LLMs. Instead of sending your code to cloud APIs, you can:

- **Run everything locally** - Your code stays on your machine
- **Use any Ollama model** - Llama, Qwen, Mistral, CodeLlama, and more
- **Manage Docker containers** - Built-in Ollama + Open WebUI stack
- **Scaffold projects** - Get started quickly with `loclaude init`

## Features

| Feature | Description |
|---------|-------------|
| **Interactive Model Selection** | Choose from installed models with a visual picker |
| **Docker Management** | Start/stop Ollama and Open WebUI containers |
| **Project Scaffolding** | Generate docker-compose.yml and config files |
| **System Diagnostics** | Check prerequisites with `loclaude doctor` |
| **Cross-Runtime** | Works with both Bun and Node.js |
| **Configurable** | JSON config files and environment variables |

## Quick Example

```bash
# Install globally
npm install -g loclaude

# Initialize a new project
loclaude init

# Start the Docker stack
loclaude docker-up

# Pull a coding model
loclaude models-pull qwen3-coder:30b

# Run Claude Code with your local model
loclaude run
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Claude Code   │────▶│    loclaude     │────▶│     Ollama      │
│     (CLI)       │     │   (bridge)      │     │   (inference)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │   Open WebUI    │
                                                │   (optional)    │
                                                │                 │
                                                └─────────────────┘
```

## Requirements

- **Docker** with Docker Compose v2
- **NVIDIA GPU** with drivers and container toolkit
- **Claude Code CLI** installed (`npm install -g @anthropic-ai/claude-code`)
- **Node.js 18+** or **Bun 1.0+**

## Next Steps

- [Installation Guide](getting-started.md) - Detailed setup instructions
- [Quick Start](quickstart.md) - Get running in 5 minutes
- [Commands Reference](commands.md) - All available commands
- [Configuration](configuration.md) - Customize your setup
