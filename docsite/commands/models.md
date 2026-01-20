# Model Commands

Commands for managing Ollama models.

## Commands

| Command | Description |
|---------|-------------|
| `models` | List installed models |
| `models-pull <name>` | Pull a model from registry |
| `models-rm <name>` | Remove an installed model |
| `models-show <name>` | Show model details |
| `models-run <name>` | Run model interactively |

## models

List all installed Ollama models.

### Usage

```bash
loclaude models
```

### Example Output

```
NAME                    SIZE      MODIFIED
qwen3-coder:30b        16.5 GB   2 hours ago
llama3.2:3b            2.0 GB    1 day ago
mistral:7b-instruct    4.1 GB    3 days ago
codellama:13b          7.4 GB    1 week ago
```

## models-pull

Pull a model from the Ollama registry.

### Usage

```bash
loclaude models-pull <name>
```

### Examples

```bash
# Pull a specific model
loclaude models-pull qwen3-coder:30b

# Pull latest version
loclaude models-pull llama3.2

# Pull specific version
loclaude models-pull llama3.2:3b
```

### Progress Output

```
pulling manifest
pulling 8eeb52dfb3bb... 100% ▕████████████████▏ 16.5 GB
pulling 73a84971e36d... 100% ▕████████████████▏ 11 KB
pulling 0ba8f0e314b4... 100% ▕████████████████▏ 59 B
pulling f02dd72bb242... 100% ▕████████████████▏ 120 B
pulling 42ba7f8a01dd... 100% ▕████████████████▏ 557 B
verifying sha256 digest
writing manifest
success
```

## models-rm

Remove an installed model.

### Usage

```bash
loclaude models-rm <name>
```

### Examples

```bash
# Remove a model
loclaude models-rm mistral:7b

# This frees up disk space
```

> **Warning:** This permanently deletes the model. You'll need to pull it again to use it.

## models-show

Show detailed information about a model.

### Usage

```bash
loclaude models-show <name>
```

### Example Output

```
Model: qwen3-coder:30b

  Parameters:    30B
  Quantization:  Q4_K_M
  Context:       32768
  Size:          16.5 GB

  Family:        qwen3
  Format:        gguf
  License:       Apache 2.0

  System Prompt:
    You are a helpful coding assistant...
```

## models-run

Run a model interactively in the terminal.

### Usage

```bash
loclaude models-run <name>
```

This opens an interactive chat session with the model directly (not through Claude Code).

### Example

```bash
loclaude models-run llama3.2
```

```
>>> Hello, can you help me with Python?

Of course! I'd be happy to help you with Python. What would you like to know
or what problem are you trying to solve?

>>> How do I read a JSON file?

Here's how to read a JSON file in Python:

import json

with open('data.json', 'r') as f:
    data = json.load(f)

print(data)

>>> /bye
```

Use `/bye` or Ctrl+D to exit.

## Recommended Models

### For Coding

| Model | Size | Best For |
|-------|------|----------|
| `qwen3-coder:30b` | 16.5 GB | Complex coding tasks |
| `codellama:34b` | 19 GB | Code completion & generation |
| `deepseek-coder:33b` | 18 GB | Code understanding |
| `codellama:13b` | 7.4 GB | Balanced performance |
| `codellama:7b` | 3.8 GB | Fast, lighter tasks |

### For General Use

| Model | Size | Best For |
|-------|------|----------|
| `llama3.2:70b` | 40 GB | Best quality |
| `llama3.2:8b` | 4.7 GB | Balanced |
| `llama3.2:3b` | 2.0 GB | Fast responses |
| `mistral:7b` | 4.1 GB | Good all-rounder |

## Storage Location

Models are stored in the `models/` directory (mounted to `/root/.ollama` in the container).

To see disk usage:

```bash
du -sh models/
```

To free up space, remove unused models:

```bash
loclaude models-rm <unused-model>
```
