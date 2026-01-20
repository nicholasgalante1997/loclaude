# Quick Start

Get up and running with loclaude in 5 minutes.

## 1. Initialize Your Project

Create a new directory and initialize loclaude:

```bash
mkdir my-project
cd my-project
loclaude init
```

This creates:

```
my-project/
├── .claude/
│   └── CLAUDE.md          # Claude Code instructions
├── .loclaude/
│   └── config.json        # loclaude configuration
├── models/                # Ollama model storage
├── docker-compose.yml     # Container definitions
├── mise.toml              # Task runner config
└── README.md
```

## 2. Start the Containers

Launch Ollama and Open WebUI:

```bash
loclaude docker-up
```

Wait for the containers to start. You can check their status:

```bash
loclaude docker-status
```

## 3. Pull a Model

Download a coding-optimized model:

```bash
# Recommended for coding
loclaude models-pull qwen3-coder:30b

# Or a smaller model for testing
loclaude models-pull llama3.2:3b
```

View installed models:

```bash
loclaude models
```

## 4. Run Claude Code

Launch Claude Code connected to your local Ollama:

```bash
loclaude run
```

You'll see an interactive model selector:

```
? Select a model
❯ qwen3-coder:30b (16.5 GB)
  llama3.2:3b (2.0 GB)
```

Select a model and Claude Code will start with your local LLM.

## 5. (Optional) Open WebUI

Access the chat interface at [http://localhost:3000](http://localhost:3000)

This provides a web-based interface for chatting with your models outside of Claude Code.

## Using with an Existing Ollama Instance

If you already have Ollama running (locally or on another machine), you can skip the Docker setup:

```bash
# Set the Ollama URL
export OLLAMA_URL=http://your-ollama-host:11434

# Run directly
loclaude run
```

Or create a config file:

```bash
mkdir -p .loclaude
cat > .loclaude/config.json << 'EOF'
{
  "ollama": {
    "url": "http://your-ollama-host:11434"
  }
}
EOF

loclaude run
```

## Command Shortcuts

If you have [mise](https://mise.jdx.dev/) installed, use the generated task shortcuts:

```bash
mise run up        # Start containers
mise run down      # Stop containers
mise run claude    # Run Claude Code
mise run pull qwen3-coder:30b  # Pull a model
```

## Next Steps

- [Commands Reference](commands.md) - All available commands
- [Configuration Guide](configuration.md) - Customize your setup
- [Model Selection Guide](guides/models.md) - Choosing the right model
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
