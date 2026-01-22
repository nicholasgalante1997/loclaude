# Tool Calling Troubleshooting Guide for loclaude

## Problem
Claude Code relies heavily on tool calling (function calling) to interact with the filesystem, run commands, and perform actions. When using local Ollama models, you may experience:

- Models not recognizing tool definitions
- Models trying to "describe" what they would do instead of calling tools
- Malformed tool call responses
- Timeout errors during tool negotiation

## Root Cause
Most Ollama models don't implement the Anthropic Messages API tool calling format with the same fidelity as Claude models. The API translation layer between Claude Code and Ollama may fail.

## Solutions (in priority order)

### 1. Use Models with Strong Tool Support

**Best models for Claude Code:**
```bash
# Tier 1: Excellent tool calling
loclaude models-pull qwen2.5-coder:32b-instruct
loclaude models-pull deepseek-r1:32b

# Tier 2: Good tool calling
loclaude models-pull mistral-nemo:12b-instruct
loclaude models-pull llama3.1:70b-instruct

# Tier 3: Basic tool calling (CPU-friendly)
loclaude models-pull qwen2.5-coder:7b-instruct
loclaude models-pull mistral:7b-instruct
```

**Avoid these models:**
- Models < 7B parameters (insufficient capability)
- Base models without `:instruct` suffix
- Code-only models without instruction tuning

### 2. Enable Debug Logging

Edit `.loclaude/config.json`:

```json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen2.5-coder:32b-instruct"
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

Then monitor both logs:
```bash
# Terminal 1: Ollama container logs
loclaude docker-logs --follow

# Terminal 2: Run Claude Code with verbose output
loclaude run
```

**Common error patterns:**
- `tool_use not supported` → Switch to a better model
- `invalid schema` → Ollama API needs update
- Timeouts > 30s → Model too slow, reduce size or use GPU

### 3. Update Ollama to Latest Version

Ollama 0.5.0+ has significantly improved Anthropic API compatibility:

```bash
# Check version
docker exec ollama ollama --version

# Update to latest
loclaude docker-down
docker pull ollama/ollama:latest
loclaude docker-up

# Verify update
docker exec ollama ollama --version
```

### 4. Test Tool Calling Directly

Verify Ollama's tool calling implementation:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5-coder:32b-instruct",
  "messages": [
    {"role": "user", "content": "What files are in the current directory?"}
  ],
  "tools": [{
    "type": "function",
    "function": {
      "name": "list_files",
      "description": "List files in a directory",
      "parameters": {
        "type": "object",
        "properties": {
          "path": {"type": "string", "description": "Directory path"}
        },
        "required": ["path"]
      }
    }
  }]
}'
```

**Expected response:**
```json
{
  "message": {
    "role": "assistant",
    "content": "",
    "tool_calls": [{
      "id": "call_123",
      "type": "function",
      "function": {
        "name": "list_files",
        "arguments": "{\"path\": \".\"}"
      }
    }]
  }
}
```

**Bad response patterns:**
- No `tool_calls` field → Model doesn't support tools
- `tool_calls` present but malformed → API compatibility issue
- Response describes action instead of calling → Model needs fine-tuning

### 5. Optimize Ollama Settings for Tool Calling

Edit `docker-compose.yml` to tune Ollama for better tool performance:

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility

      # Reduce concurrent requests to improve tool calling reliability
      - OLLAMA_NUM_PARALLEL=1

      # Keep model loaded longer (reduces warmup delays)
      - OLLAMA_KEEP_ALIVE=30m

      # Increase context size for complex tool schemas
      - OLLAMA_MAX_LOADED_MODELS=1

      # Enable debug logging
      - OLLAMA_DEBUG=1
```

Then restart:
```bash
loclaude docker-restart
```

### 6. Use Modelfile Customization

Create a custom model with optimized settings for tool calling:

```bash
# Create a Modelfile
cat > Modelfile <<EOF
FROM qwen2.5-coder:32b-instruct

# Optimize for tool calling
PARAMETER temperature 0.1
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1

# Add system prompt that emphasizes tool usage
SYSTEM """
You are an AI assistant with access to tools. When asked to perform actions:
1. ALWAYS use the available tools by calling them with proper JSON format
2. NEVER describe what you would do - actually call the tool
3. Wait for tool results before continuing
4. Format tool calls exactly as: {"name": "tool_name", "arguments": {...}}
"""
EOF

# Build custom model
docker exec ollama ollama create qwen-tools -f Modelfile

# Use it in loclaude
loclaude run -m qwen-tools
```

### 7. Fallback: Use OpenAI-Compatible Proxy

If Ollama's Anthropic compatibility is broken, use an OpenAI-compatible proxy:

```bash
# Install litellm as a translation layer
pip install litellm

# Run litellm proxy
litellm --model ollama/qwen2.5-coder:32b-instruct \
        --api_base http://localhost:11434

# Update .loclaude/config.json to point to litellm
{
  "ollama": {
    "url": "http://localhost:4000",  # litellm default port
    "defaultModel": "qwen2.5-coder:32b-instruct"
  }
}
```

LiteLLM translates between different API formats and may handle tool calling better.

## Diagnostic Checklist

Run through this checklist to identify the issue:

- [ ] Ollama version >= 0.5.0
- [ ] Using a model with `:instruct` suffix
- [ ] Model size >= 7B parameters
- [ ] GPU has enough VRAM (check `nvidia-smi`)
- [ ] Ollama responds to `/api/tags` endpoint
- [ ] Direct tool calling test succeeds (curl command above)
- [ ] `--verbose` flag shows tool negotiations
- [ ] No timeout errors in Ollama logs
- [ ] Container has sufficient memory/CPU

## When All Else Fails

If you've tried everything:

1. **Report to Ollama**: File an issue at https://github.com/ollama/ollama/issues with:
   - Ollama version
   - Model name
   - Tool calling test results
   - Error logs

2. **Use Claude API for critical work**: Keep `loclaude` for experimentation, use real Claude for production:
   ```bash
   # Real Claude for important work
   claude

   # loclaude for learning/practice
   loclaude run
   ```

3. **Try alternative local solutions**:
   - [llama.cpp with function calling](https://github.com/ggerganov/llama.cpp)
   - [vllm with tool use](https://github.com/vllm-project/vllm)
   - [text-generation-webui with extensions](https://github.com/oobabooga/text-generation-webui)

## Success Metrics

You'll know tool calling works when:
- Claude Code can read files without errors
- Bash commands execute successfully
- File edits apply correctly
- No "tool negotiation failed" errors
- Sessions feel smooth like real Claude

## Further Reading

- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)
- [Function Calling Best Practices](https://platform.openai.com/docs/guides/function-calling)
