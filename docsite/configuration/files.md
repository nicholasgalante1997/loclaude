# Config Files

loclaude uses JSON configuration files for persistent settings.

## File Locations

Config files are searched in this order:

| Location | Scope | Priority |
|----------|-------|----------|
| `./.loclaude/config.json` | Project | Highest |
| `~/.config/loclaude/config.json` | User | Lower |

Both files are optional. Settings from multiple files are merged, with project config taking precedence.

## Creating Config Files

### Project Config

Create a project-specific config:

```bash
mkdir -p .loclaude
cat > .loclaude/config.json << 'EOF'
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  }
}
EOF
```

Or use `loclaude init` which creates this automatically.

### User Config

Create a global user config:

```bash
mkdir -p ~/.config/loclaude
cat > ~/.config/loclaude/config.json << 'EOF'
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "llama3.2"
  }
}
EOF
```

## Full Schema

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

### ollama

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | string | `http://localhost:11434` | Ollama API endpoint URL |
| `defaultModel` | string | `qwen3-coder:30b` | Model used when none specified |

### docker

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `composeFile` | string | `./docker-compose.yml` | Path to Docker Compose file |
| `gpu` | boolean | `true` | Enable NVIDIA GPU support |

### claude

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `extraArgs` | string[] | `[]` | Extra arguments passed to Claude Code |

## Partial Configs

You don't need to specify all settings. Missing values use defaults:

```json
{
  "ollama": {
    "defaultModel": "mistral:7b"
  }
}
```

This only overrides `defaultModel`; all other settings use defaults.

## Config Merging

When both project and user configs exist, they're deep-merged:

**User config (~/.config/loclaude/config.json):**
```json
{
  "ollama": {
    "defaultModel": "llama3.2"
  },
  "docker": {
    "gpu": true
  }
}
```

**Project config (./.loclaude/config.json):**
```json
{
  "ollama": {
    "url": "http://192.168.1.100:11434"
  }
}
```

**Effective config:**
```json
{
  "ollama": {
    "url": "http://192.168.1.100:11434",
    "defaultModel": "llama3.2"
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

## Validation

Invalid JSON will show a warning:

```
Warning: Failed to parse config file ./.loclaude/config.json
```

Check your JSON syntax:

```bash
cat .loclaude/config.json | jq .
```

## Best Practices

1. **Use project configs** for project-specific settings (custom Ollama URL, compose file path)
2. **Use user config** for personal defaults (preferred model, extra args)
3. **Keep secrets out** - Don't store API keys in config files
4. **Commit project configs** - They help team members use consistent settings
5. **Don't commit user configs** - They're personal preferences

## Related

- [Environment Variables](environment.md)
- [Configuration Overview](../configuration.md)
