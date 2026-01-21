# Commands Overview

loclaude provides a comprehensive set of commands for managing your local Claude Code setup.

## Command Structure

```bash
loclaude <command> [options] [arguments]
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `run` | Run Claude Code with local Ollama |
| `init` | Initialize a new project |
| `doctor` | Check system requirements |
| `config` | Show current configuration |
| `docker-up` | Start containers |
| `docker-down` | Stop containers |
| `docker-status` | Show container status |
| `docker-logs` | View container logs |
| `docker-restart` | Restart containers |
| `models` | List installed models |
| `models-pull` | Pull a model |
| `models-rm` | Remove a model |
| `models-show` | Show model details |
| `models-run` | Run model interactively |

## Command Categories

### Running Claude Code

The primary command for launching Claude Code with your local LLM:

```bash
# Interactive model selection
loclaude run

# Specify a model
loclaude run -m qwen3-coder:30b

# Pass arguments to Claude Code
loclaude run -- --help
```

[Learn more about the run command](commands/run.md)

### Project Setup

Initialize and configure new projects:

```bash
# Full initialization
loclaude init

# Without Open WebUI
loclaude init --no-webui

# Force overwrite
loclaude init --force
```

[Learn more about the init command](commands/init.md)

### Docker Management

Control your Ollama and Open WebUI containers:

```bash
loclaude docker-up       # Start
loclaude docker-down     # Stop
loclaude docker-status   # Status
loclaude docker-logs     # Logs
loclaude docker-restart  # Restart
```

[Learn more about docker commands](commands/docker.md)

### Model Management

Manage your Ollama models:

```bash
loclaude models              # List models
loclaude models-pull <name>  # Pull model
loclaude models-rm <name>    # Remove model
loclaude models-show <name>  # Show details
loclaude models-run <name>   # Interactive chat
```

[Learn more about model commands](commands/models.md)

### Diagnostics

Check your system and configuration:

```bash
loclaude doctor        # System check
loclaude config        # Show config
loclaude config-paths  # Config locations
```

[Learn more about the doctor command](commands/doctor.md)

## Global Options

These options are available for all commands:

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show help for the command |
| `--version`, `-v` | Show version number |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Command not found |
| `3` | Missing prerequisites |
