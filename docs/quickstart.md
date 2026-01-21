# Quick Start

Get up and running with loclaude in 5 minutes.

## Choose Your Mode

loclaude supports both **GPU** and **CPU-only** modes:

| Mode | Requirements | Performance | Best For |
|------|--------------|-------------|----------|
| **GPU** | NVIDIA GPU + Container Toolkit | Fast (50-100 t/s) | Production use, large models |
| **CPU** | None | Slower (10-20 t/s) | Testing, laptops, no GPU systems |

## GPU Mode (Recommended)

### 1. Initialize Your Project

```bash
mkdir my-project
cd my-project
loclaude init
```

This auto-detects your GPU and creates:

```
my-project/
├── .claude/
│   └── CLAUDE.md          # Claude Code instructions
├── .loclaude/
│   └── config.json        # loclaude configuration
├── models/                # Ollama model storage
├── docker-compose.yml     # Container definitions (GPU mode)
├── mise.toml              # Task runner config
└── README.md
```

### 2. Start the Containers

```bash
loclaude docker-up
```

Wait for the containers to start. Check their status:

```bash
loclaude docker-status
```

### 3. Pull a Model

```bash
# Recommended for GPU with 16GB+ VRAM
loclaude models-pull qwen3-coder:30b

# Or for 8-12GB VRAM
loclaude models-pull qwen2.5-coder:14b
```

### 4. Run Claude Code

```bash
loclaude run
```

Select a model and Claude Code will start with your local LLM.

---

## CPU-Only Mode

### 1. Initialize Without GPU

```bash
mkdir my-project
cd my-project
loclaude init --no-gpu
```

### 2. Start Containers

```bash
loclaude docker-up
```

### 3. Pull a CPU-Optimized Model

```bash
# Balanced performance for coding
loclaude models-pull qwen2.5-coder:7b

# Faster, for simpler tasks
loclaude models-pull llama3.2:3b
```

### 4. Run Claude Code

```bash
loclaude run
```

> **Note:** CPU inference is slower. Expect ~10-20 tokens/sec on modern CPUs.

---

## Verify Your Setup

Check that everything is working:

```bash
loclaude doctor
```

Expected output:

```
  System Health Check
  ─────────────────────

✓ Docker: Installed (Docker version 28.x.x)
✓ Docker Compose: Installed (v2)
✓ NVIDIA GPU: 1 GPU(s) detected        # Or "⚠ nvidia-smi not found" for CPU mode
✓ Claude Code: Installed (2.x.x)
✓ Ollama API: Connected (3 models)

All checks passed! Ready to use loclaude.
```

## View Installed Models

```bash
loclaude models
```

Output:

```
  Installed Models
  ──────────────────

NAME                SIZE        MODIFIED
──────────────────  ──────────  ────────────────────
qwen3-coder:30b        17.28GB  2 hours ago
qwen2.5-coder:7b        4.43GB  3 days ago

2 model(s) installed
```

## (Optional) Open WebUI

Access the chat interface at [http://localhost:3000](http://localhost:3000)

This provides a web-based interface for chatting with your models outside of Claude Code.

## Using with an Existing Ollama Instance

If you already have Ollama running (locally or on another machine), skip the Docker setup:

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
mise run models    # List models
mise run pull qwen3-coder:30b  # Pull a model
mise run doctor    # Check system health
```

## Next Steps

- [Commands Reference](commands.md) - All available commands
- [Configuration Guide](configuration.md) - Customize your setup
- [Model Selection Guide](guides/models.md) - Choosing the right model
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
