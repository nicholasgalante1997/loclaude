# Troubleshooting

Common issues and solutions for loclaude.

## Diagnostic Commands

Start troubleshooting with these commands:

```bash
# Check all prerequisites
loclaude doctor

# View container status
loclaude docker-status

# View logs
loclaude docker-logs

# Check configuration
loclaude config
```

## Connection Issues

### "Could not connect to Ollama"

**Symptoms:**
```
Error: Could not connect to Ollama at http://localhost:11434
Make sure Ollama is running: loclaude docker-up
```

**Solutions:**

1. Start the containers:
   ```bash
   loclaude docker-up
   ```

2. Check container status:
   ```bash
   loclaude docker-status
   ```

3. Verify the API is accessible:
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. Check if the port is in use:
   ```bash
   lsof -i :11434
   ```

### "Connection refused"

**Cause:** Ollama isn't running or is on a different port/host.

**Solutions:**

1. Verify Ollama URL in config:
   ```bash
   loclaude config
   ```

2. Update if needed:
   ```bash
   export OLLAMA_URL="http://correct-host:11434"
   ```

### "No models found"

**Cause:** No models have been pulled yet.

**Solution:**
```bash
loclaude models-pull qwen3-coder:30b
```

## Docker Issues

### Containers Won't Start

**Check logs:**
```bash
loclaude docker-logs
```

**Common causes:**

1. **Port already in use:**
   ```bash
   # Find what's using the port
   lsof -i :11434

   # Stop the conflicting process or change port
   ```

2. **Docker not running:**
   ```bash
   sudo systemctl start docker
   ```

3. **Insufficient permissions:**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

### Container Keeps Restarting

**Check health status:**
```bash
docker inspect ollama --format='{{.State.Health.Status}}'
```

**View health check logs:**
```bash
docker inspect ollama --format='{{json .State.Health}}' | jq
```

**Common fixes:**

1. Increase start period in docker-compose.yml
2. Check for resource constraints
3. Review container logs for errors

### "nvidia runtime not found"

**Cause:** NVIDIA Container Toolkit not installed or configured.

**Solution:**
```bash
# Install toolkit
sudo apt-get install -y nvidia-container-toolkit

# Configure Docker
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Verify
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

## GPU Issues

### "No GPU detected"

**Check GPU visibility:**
```bash
nvidia-smi
```

**If not visible:**

1. Install/update NVIDIA drivers:
   ```bash
   sudo ubuntu-drivers autoinstall
   sudo reboot
   ```

2. Verify driver is loaded:
   ```bash
   lsmod | grep nvidia
   ```

### "CUDA out of memory"

**Symptoms:**
```
CUDA out of memory. Tried to allocate X GiB
```

**Solutions:**

1. Use a smaller model:
   ```bash
   loclaude models-pull llama3.2:3b
   loclaude run -m llama3.2:3b
   ```

2. Close other GPU applications

3. Use quantized models:
   ```bash
   loclaude models-pull codellama:13b-q4_k_m
   ```

### Slow Generation

**Possible causes:**

1. **Model too large for VRAM** - Using CPU fallback
2. **Thermal throttling** - Check GPU temperature
3. **Power limits** - Check nvidia-smi for power state

**Solutions:**

1. Use a smaller model
2. Ensure proper cooling
3. Check `nvidia-smi` for issues

## Model Issues

### "Model not found"

**Cause:** Model hasn't been pulled.

**Solution:**
```bash
# List available models
loclaude models

# Pull the model
loclaude models-pull <model-name>
```

### Slow Model Loading

**Cause:** Large model being loaded from disk.

**Solutions:**

1. Use SSD storage for models directory
2. Keep model loaded by using it frequently
3. Consider smaller models

### Poor Code Quality

**Solutions:**

1. Use a coding-specific model:
   ```bash
   loclaude models-pull qwen3-coder:30b
   ```

2. Use instruction-tuned variants:
   ```bash
   loclaude models-pull codellama:13b-instruct
   ```

3. Try a larger model if VRAM allows

## Claude Code Issues

### "Claude Code not found"

**Solution:**
```bash
npm install -g @anthropic-ai/claude-code
```

### Claude Code Crashes

**Check Claude Code logs:**
```bash
loclaude run -- --verbose
```

**Common fixes:**

1. Update Claude Code:
   ```bash
   npm update -g @anthropic-ai/claude-code
   ```

2. Check Node.js version (18+ required)

## Configuration Issues

### Config Not Loading

**Check paths:**
```bash
loclaude config-paths
```

**Verify JSON syntax:**
```bash
cat .loclaude/config.json | jq .
```

### Environment Variables Not Working

**Verify they're set:**
```bash
echo $OLLAMA_URL
echo $OLLAMA_MODEL
```

**Check effective config:**
```bash
loclaude config
```

## Getting Help

If you can't resolve an issue:

1. **Search existing issues:**
   [GitHub Issues](https://github.com/nicholasgalante1997/docker-ollama/issues)

2. **Create a new issue** with:
   - Output of `loclaude doctor`
   - Output of `loclaude config`
   - Error messages
   - Steps to reproduce

3. **Include system info:**
   ```bash
   uname -a
   docker --version
   nvidia-smi
   node --version
   ```
