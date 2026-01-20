# CLI Reference

Complete reference for all loclaude commands.

## Global Options

```bash
loclaude [command] [options]
```

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help |
| `-v, --version` | Show version |

## Commands

### run

Run Claude Code with local Ollama.

```bash
loclaude run [options] [...args]
loclaude x [options] [...args]  # Alias
```

| Option | Description |
|--------|-------------|
| `-m, --model <name>` | Specify model to use |

**Arguments:** Any arguments after `--` are passed to Claude Code.

**Examples:**
```bash
loclaude run
loclaude run -m qwen3-coder:30b
loclaude run -- --help
loclaude x -m llama3.2
```

---

### init

Initialize a new loclaude project.

```bash
loclaude init [options]
```

| Option | Description |
|--------|-------------|
| `--force` | Overwrite existing files |
| `--no-webui` | Skip Open WebUI in docker-compose |

**Examples:**
```bash
loclaude init
loclaude init --force
loclaude init --no-webui
```

---

### doctor

Check system requirements and health.

```bash
loclaude doctor
```

No options.

---

### config

Show current configuration.

```bash
loclaude config
```

No options.

---

### config-paths

Show config file search paths.

```bash
loclaude config-paths
```

No options.

---

### docker-up

Start Ollama and Open WebUI containers.

```bash
loclaude docker-up [options]
```

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |
| `--no-detach` | Run in foreground |

**Examples:**
```bash
loclaude docker-up
loclaude docker-up --no-detach
loclaude docker-up -f ./custom/docker-compose.yml
```

---

### docker-down

Stop containers.

```bash
loclaude docker-down [options]
```

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |

---

### docker-status

Show container status.

```bash
loclaude docker-status [options]
```

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |

---

### docker-logs

Show container logs.

```bash
loclaude docker-logs [options]
```

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |
| `--follow` | Follow log output |
| `-s, --service <name>` | Show logs for specific service |

**Examples:**
```bash
loclaude docker-logs
loclaude docker-logs --follow
loclaude docker-logs -s ollama
loclaude docker-logs --follow -s open-webui
```

---

### docker-restart

Restart containers.

```bash
loclaude docker-restart [options]
```

| Option | Description |
|--------|-------------|
| `-f, --file <path>` | Path to docker-compose.yml |

---

### models

List installed Ollama models.

```bash
loclaude models
```

No options.

---

### models-pull

Pull a model from Ollama registry.

```bash
loclaude models-pull <name>
```

| Argument | Description |
|----------|-------------|
| `name` | Model name (e.g., `qwen3-coder:30b`) |

**Examples:**
```bash
loclaude models-pull qwen3-coder:30b
loclaude models-pull llama3.2
loclaude models-pull codellama:13b-instruct
```

---

### models-rm

Remove an installed model.

```bash
loclaude models-rm <name>
```

| Argument | Description |
|----------|-------------|
| `name` | Model name to remove |

---

### models-show

Show model information.

```bash
loclaude models-show <name>
```

| Argument | Description |
|----------|-------------|
| `name` | Model name |

---

### models-run

Run a model interactively.

```bash
loclaude models-run <name>
```

| Argument | Description |
|----------|-------------|
| `name` | Model name |

Opens an interactive chat session with the model.

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Command not found |
| `3` | Missing prerequisites |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OLLAMA_URL` | Ollama API endpoint |
| `OLLAMA_MODEL` | Default model |
| `LOCLAUDE_COMPOSE_FILE` | Docker compose file path |
| `LOCLAUDE_GPU` | Enable GPU (`true`/`false`) |

See [Environment Variables](../configuration/environment.md) for details.
