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

## Automatic Model Loading

When you run `loclaude run`, it automatically ensures your selected model is loaded:

1. **Checks running models** via Ollama's `/api/ps` endpoint
2. **Loads if needed** - sends a warm-up request with 10-minute keep-alive
3. **Shows status** - displays `[loaded]` indicator in model picker

This eliminates the cold-start delay on first request to Claude Code.

## Examples

### Interactive Model Selection

```bash
loclaude run
```

This displays an interactive picker with all installed models:

```
? Select a model
❯ qwen3-coder:30b (16.5 GB) [loaded]
  llama3.2:3b (2.0 GB)
  mistral:7b (4.1 GB)
```

Models marked `[loaded]` are already in memory and will respond immediately.

### Specify a Model

```bash
loclaude run -m qwen3-coder:30b
```

Output:

```
Launching Claude Code with Ollama
  Model: qwen3-coder:30b
  API:   http://localhost:11434

ℹ Loading model qwen3-coder:30b...
  This may take a moment on first run
✓ Model qwen3-coder:30b loaded (keep_alive: 10m)

[Claude Code starts...]
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
2. Fetches available models from `/api/tags`
3. Fetches running models from `/api/ps` (shows `[loaded]` status)
4. Displays the model picker (if `-m` not specified)
5. **Ensures model is loaded** (warms up if not)
6. Launches Claude Code with environment variables:
   - `ANTHROPIC_AUTH_TOKEN=ollama`
   - `ANTHROPIC_BASE_URL=<your ollama url>`

## Model Keep-Alive

By default, models are loaded with a **10-minute keep-alive**. This means:

- Model stays in memory for 10 minutes after the last request
- Subsequent Claude Code sessions start immediately (no loading)
- Memory is freed after 10 minutes of inactivity

You can customize this in Ollama's configuration if needed.

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

### Model Loading Timeout

If model loading takes too long:

1. Check Ollama logs: `loclaude docker-logs ollama`
2. Verify disk space for model storage
3. Try a smaller model first

### Model Too Slow

Try a smaller model:

```bash
# For CPU or limited VRAM
loclaude models-pull qwen2.5-coder:7b
loclaude run -m qwen2.5-coder:7b

# For fast testing
loclaude models-pull llama3.2:3b
loclaude run -m llama3.2:3b
```

### Model Won't Stay Loaded

If the model keeps unloading:

1. Check available memory/VRAM: `nvidia-smi` or system monitor
2. Close other GPU applications
3. Use a smaller model
4. Increase Ollama's `OLLAMA_MAX_LOADED_MODELS` if running multiple models
