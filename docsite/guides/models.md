# Model Selection Guide

Choosing the right model for your use case.

## Overview

The model you choose significantly impacts:

- **Quality** - How good the code suggestions are
- **Speed** - How fast responses are generated
- **Memory** - How much VRAM is required

## Recommended Models

### For Coding

| Model | Size | VRAM | Best For |
|-------|------|------|----------|
| `qwen3-coder:30b` | 16.5 GB | 20 GB | Complex coding tasks, architecture |
| `deepseek-coder:33b` | 18 GB | 24 GB | Code understanding, refactoring |
| `codellama:34b` | 19 GB | 24 GB | Code completion, generation |
| `codellama:13b` | 7.4 GB | 10 GB | Balanced performance |
| `codellama:7b` | 3.8 GB | 6 GB | Fast, lighter tasks |
| `qwen3-coder:7b` | 4.4 GB | 6 GB | Good balance for coding |

### For General Use

| Model | Size | VRAM | Best For |
|-------|------|------|----------|
| `llama3.2:70b` | 40 GB | 48 GB | Best quality, complex reasoning |
| `llama3.2:8b` | 4.7 GB | 8 GB | Good all-rounder |
| `llama3.2:3b` | 2.0 GB | 4 GB | Fast responses, simple tasks |
| `mistral:7b` | 4.1 GB | 6 GB | Efficient, good quality |

## Choosing by GPU

### Consumer GPUs

| GPU | VRAM | Recommended Models |
|-----|------|-------------------|
| RTX 4090 | 24 GB | `qwen3-coder:30b`, `codellama:34b` |
| RTX 4080 | 16 GB | `codellama:13b`, `qwen3-coder:14b` |
| RTX 4070 | 12 GB | `codellama:13b`, `llama3.2:8b` |
| RTX 3080 | 10 GB | `codellama:7b`, `mistral:7b` |
| RTX 3070 | 8 GB | `llama3.2:3b`, `codellama:7b` |

### Professional GPUs

| GPU | VRAM | Recommended Models |
|-----|------|-------------------|
| A100 | 80 GB | Any model, multiple simultaneous |
| A6000 | 48 GB | `llama3.2:70b`, multiple models |
| RTX A5000 | 24 GB | `qwen3-coder:30b` |

## Model Variants

### Quantization

Models come in different quantization levels:

| Suffix | Description | Quality | Size |
|--------|-------------|---------|------|
| (none) | Full precision | Best | Largest |
| `q8_0` | 8-bit | Excellent | ~50% smaller |
| `q4_k_m` | 4-bit (medium) | Good | ~25% of original |
| `q4_k_s` | 4-bit (small) | Acceptable | Smallest |

Example:
```bash
loclaude models-pull codellama:13b-q4_k_m
```

### Instruction Tuned

Look for `-instruct` variants for chat/coding tasks:

```bash
loclaude models-pull codellama:13b-instruct
loclaude models-pull mistral:7b-instruct
```

## Installing Models

### Pull a Model

```bash
loclaude models-pull qwen3-coder:30b
```

### List Installed Models

```bash
loclaude models
```

### Remove Unused Models

Free up disk space:

```bash
loclaude models-rm old-model:tag
```

## Testing Models

### Quick Test

```bash
loclaude models-run qwen3-coder:30b
```

Then try a coding prompt:

```
>>> Write a Python function to merge two sorted lists

Here's an efficient solution:

def merge_sorted_lists(list1, list2):
    result = []
    i = j = 0

    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1

    result.extend(list1[i:])
    result.extend(list2[j:])
    return result
```

### Compare Models

Try the same prompt with different models:

```bash
# Test each model
loclaude run -m codellama:13b
loclaude run -m qwen3-coder:30b
loclaude run -m deepseek-coder:33b
```

## Performance Tips

### Memory Management

1. **One large model** is usually better than multiple small ones
2. **Close other GPU applications** (games, rendering)
3. **Use quantized models** if running low on VRAM

### Speed Optimization

1. **Smaller context** = faster responses
2. **Quantized models** are faster
3. **Dedicated GPU** outperforms shared resources

### Quality Tips

1. **Larger models** generally produce better code
2. **Coding-specific models** outperform general models for code
3. **Instruct variants** follow instructions better

## Model Comparison

### Code Completion Quality

```
qwen3-coder:30b  ████████████████████  Excellent
deepseek-coder   ███████████████████   Excellent
codellama:34b    ██████████████████    Very Good
codellama:13b    ███████████████       Good
codellama:7b     ████████████          Acceptable
llama3.2:8b      ███████████           Good (general)
```

### Response Speed (tokens/sec)

```
llama3.2:3b      ████████████████████  ~100 t/s
codellama:7b     ███████████████       ~60 t/s
codellama:13b    ████████████          ~40 t/s
qwen3-coder:30b  ████████              ~25 t/s
deepseek-coder   ███████               ~20 t/s
```

*Speeds vary by hardware*

## Finding More Models

Browse available models:

- [Ollama Model Library](https://ollama.ai/library)
- Search by tag: `ollama search code`

## Related

- [Model Commands](../commands/models.md)
- [Troubleshooting](../troubleshooting.md)
