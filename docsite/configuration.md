# Configuration Overview

loclaude supports flexible configuration through files, environment variables, and CLI arguments.

## Configuration Priority

Settings are loaded and merged in this order (highest priority first):

1. **CLI arguments** - Flags passed to commands
2. **Environment variables** - `OLLAMA_URL`, `OLLAMA_MODEL`, etc.
3. **Project config** - `./.loclaude/config.json`
4. **User config** - `~/.config/loclaude/config.json`
5. **Default values** - Built-in defaults

Higher priority settings override lower ones.

## Quick Reference

### Config File

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

```bash
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="qwen3-coder:30b"
export LOCLAUDE_COMPOSE_FILE="./docker-compose.yml"
export LOCLAUDE_GPU="true"
```

## Configuration Sections

### Ollama Settings

| Setting | Env Variable | Default | Description |
|---------|--------------|---------|-------------|
| `ollama.url` | `OLLAMA_URL` | `http://localhost:11434` | Ollama API endpoint |
| `ollama.defaultModel` | `OLLAMA_MODEL` | `qwen3-coder:30b` | Default model for `run` command |

### Docker Settings

| Setting | Env Variable | Default | Description |
|---------|--------------|---------|-------------|
| `docker.composeFile` | `LOCLAUDE_COMPOSE_FILE` | `./docker-compose.yml` | Path to compose file |
| `docker.gpu` | `LOCLAUDE_GPU` | `true` | Enable GPU support |

### Claude Settings

| Setting | Env Variable | Default | Description |
|---------|--------------|---------|-------------|
| `claude.extraArgs` | - | `[]` | Additional args passed to Claude Code |

## Viewing Configuration

### Current Config

```bash
loclaude config
```

Output:

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
    "extraArgs": []
  }
}
```

### Config File Locations

```bash
loclaude config-paths
```

Output:

```
Config file search paths (in priority order):

1. ./.loclaude/config.json
   Status: Found ✓

2. ~/.config/loclaude/config.json
   Status: Not found
```

## Common Configurations

### Remote Ollama Server

Connect to Ollama running on another machine:

```json
{
  "ollama": {
    "url": "http://192.168.1.100:11434"
  }
}
```

### CPU-Only Mode

Disable GPU requirements:

```json
{
  "docker": {
    "gpu": false
  }
}
```

### Custom Docker Location

Use a non-standard compose file:

```json
{
  "docker": {
    "composeFile": "./infrastructure/docker-compose.yml"
  }
}
```

### Claude Code Customization

Pass additional arguments to Claude Code:

```json
{
  "claude": {
    "extraArgs": ["--verbose", "--no-telemetry"]
  }
}
```

## Next Steps

- [Config Files](configuration/files.md) - Detailed file format
- [Environment Variables](configuration/environment.md) - All env vars
