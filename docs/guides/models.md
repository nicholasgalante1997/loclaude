# Model Selection Guide

Choosing the right model for your use case.

## Overview

The model you choose significantly impacts:

- **Quality** - How good the code suggestions are
- **Speed** - How fast responses are generated
- **Memory** - How much VRAM/RAM is required

## Quick Recommendations

### For GPU Users (16GB+ VRAM)

```bash
loclaude models-pull qwen3-coder:30b
```

### For CPU-Only Users

```bash
loclaude models-pull qwen2.5-coder:7b
```

## Models by Hardware

### CPU-Only (No GPU)

Running on CPU is slower but works on any system.

| Model | Size | Speed | Best For |
|-------|------|-------|----------|
| `llama3.2:3b` | 2 GB | ~20 t/s | Fast responses, simple tasks |
| `qwen2.5-coder:7b` | 4 GB | ~15 t/s | Balanced coding performance |
| `gemma2:9b` | 5 GB | ~10 t/s | General purpose |
| `codellama:7b` | 4 GB | ~15 t/s | Code completion |

> **Tip:** Use quantized models (Q4_K_M) for better CPU performance.

### Consumer GPUs (8-24GB VRAM)

| GPU | VRAM | Recommended Models |
|-----|------|-------------------|
| RTX 4090 | 24 GB | `qwen3-coder:30b`, `deepseek-coder:33b` |
| RTX 4080 | 16 GB | `qwen3-coder:30b`, `codellama:13b` |
| RTX 4070 | 12 GB | `codellama:13b`, `qwen2.5-coder:14b` |
| RTX 3080 | 10 GB | `codellama:7b`, `qwen2.5-coder:7b` |
| RTX 3070 | 8 GB | `llama3.2:8b`, `codellama:7b` |

### Professional GPUs (48GB+ VRAM)

| GPU | VRAM | Recommended Models |
|-----|------|-------------------|
| A100 | 80 GB | Any model, multiple simultaneous |
| A6000 | 48 GB | `llama3.2:70b`, multiple models |
| RTX A5000 | 24 GB | `qwen3-coder:30b` |

## Recommended Coding Models

### Best for Coding (GPU)

| Model | Size | VRAM | Best For |
|-------|------|------|----------|
| `qwen3-coder:30b` | 17 GB | 20 GB | Complex coding tasks, architecture |
| `deepseek-coder:33b` | 18 GB | 24 GB | Code understanding, refactoring |
| `codellama:34b` | 19 GB | 24 GB | Code completion, generation |
| `qwen2.5-coder:14b` | 8 GB | 12 GB | Balanced performance |
| `codellama:13b` | 7 GB | 10 GB | Balanced performance |

### Best for Coding (CPU)

| Model | Size | RAM | Best For |
|-------|------|-----|----------|
| `qwen2.5-coder:7b` | 4 GB | 8 GB | Primary CPU coding model |
| `codellama:7b` | 4 GB | 8 GB | Code completion |
| `llama3.2:3b` | 2 GB | 4 GB | Fast responses, simpler tasks |
| `starcoder2:3b` | 2 GB | 4 GB | Code-specific, fast |

### General Purpose

| Model | Size | VRAM | Best For |
|-------|------|------|----------|
| `llama3.2:70b` | 40 GB | 48 GB | Best quality, complex reasoning |
| `llama3.2:8b` | 5 GB | 8 GB | Good all-rounder |
| `llama3.2:3b` | 2 GB | 4 GB | Fast responses, simple tasks |
| `mistral:7b` | 4 GB | 6 GB | Efficient, good quality |

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

> **CPU Users:** Quantized models (Q4_K_M) run faster on CPU.

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

Output:

```
ℹ Pulling model: qwen3-coder:30b

pulling manifest
pulling 8a89ed24f89a... 100% ▐████████████████████████████████████████▌ 17.3 GB
verifying sha256 digest
writing manifest
success

✓ Model 'qwen3-coder:30b' pulled successfully
```

### List Installed Models

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
llama3.2:3b             2.01GB  1 week ago

3 model(s) installed
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
loclaude run -m codellama:13b
loclaude run -m qwen3-coder:30b
loclaude run -m qwen2.5-coder:7b
```

## Performance Tips

### For CPU Users

1. **Use smaller models** - 3B-7B parameters work best
2. **Use quantized models** - Q4_K_M variants are faster
3. **Close other applications** - Free up RAM
4. **Expect 10-20 t/s** - CPU inference is slower than GPU

### For GPU Users

1. **One large model** is usually better than multiple small ones
2. **Close other GPU applications** (games, rendering)
3. **Use quantized models** if running low on VRAM
4. **Monitor VRAM** with `nvidia-smi`

### General Tips

1. **Larger models** generally produce better code
2. **Coding-specific models** outperform general models for code
3. **Instruct variants** follow instructions better
4. **Model stays loaded** for 10 minutes after use (configurable)

## Model Comparison

### Code Completion Quality

```
qwen3-coder:30b  ████████████████████  Excellent
deepseek-coder   ███████████████████   Excellent
codellama:34b    ██████████████████    Very Good
qwen2.5-coder:7b ███████████████       Good
codellama:7b     ████████████          Acceptable
llama3.2:3b      ██████████            Basic
```

### Response Speed (GPU)

```
llama3.2:3b      ████████████████████  ~100 t/s
codellama:7b     ███████████████       ~60 t/s
codellama:13b    ████████████          ~40 t/s
qwen3-coder:30b  ████████              ~25 t/s
deepseek-coder   ███████               ~20 t/s
```

### Response Speed (CPU)

```
llama3.2:3b      ████████████████████  ~20 t/s
codellama:7b     ████████████          ~15 t/s
qwen2.5-coder:7b ████████████          ~15 t/s
gemma2:9b        ████████              ~10 t/s
codellama:13b    ██████                ~8 t/s
```

*Speeds vary by hardware*

## Finding More Models

Browse available models:

- [Ollama Model Library](https://ollama.ai/library)
- Search by tag: `ollama search code`

## Related

- [Model Commands](../commands/models.md)
- [Run Command](../commands/run.md)
- [Troubleshooting](../troubleshooting.md)
