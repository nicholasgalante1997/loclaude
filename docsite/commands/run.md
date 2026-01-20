# run

Run Claude Code with a local Ollama model.

## Usage

```bash
loclaude run [options] [...args]
```

## Alias

```bash
loclaude x [options] [...args]
```

## Options

| Option | Description |
|--------|-------------|
| `-m, --model <name>` | Specify the model to use |

## Arguments

Any additional arguments after `--` are passed directly to Claude Code.

## Examples

### Interactive Model Selection

```bash
loclaude run
```

This displays an interactive picker with all installed models:

```
? Select a model
❯ qwen3-coder:30b (16.5 GB)
  llama3.2:3b (2.0 GB)
  mistral:7b (4.1 GB)
```

### Specify a Model

```bash
loclaude run -m qwen3-coder:30b
```

### Pass Arguments to Claude Code

```bash
# Show Claude Code help
loclaude run -- --help

# Start with a specific prompt
loclaude run -- "explain this codebase"

# Enable verbose mode
loclaude run -- --verbose
```

### Use the Alias

```bash
loclaude x -m llama3.2
```

## How It Works

When you run `loclaude run`, it:

1. Connects to the configured Ollama API
2. Fetches available models
3. Displays the model picker (if `-m` not specified)
4. Launches Claude Code with environment variables:
   - `ANTHROPIC_AUTH_TOKEN=ollama`
   - `ANTHROPIC_BASE_URL=<your ollama url>`

## Configuration

The Ollama URL and default model can be configured via:

- Environment variables: `OLLAMA_URL`, `OLLAMA_MODEL`
- Config file: `.loclaude/config.json`

```json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  }
}
```

## Troubleshooting

### "Could not connect to Ollama"

Ensure Ollama is running:

```bash
loclaude docker-status
```

If not running:

```bash
loclaude docker-up
```

### "No models found"

Pull a model first:

```bash
loclaude models-pull qwen3-coder:30b
```

### Model Too Slow

Try a smaller model:

```bash
loclaude models-pull llama3.2:3b
loclaude run -m llama3.2:3b
```
