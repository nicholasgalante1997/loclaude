# doctor

Check system requirements and diagnose issues.

## Usage

```bash
loclaude doctor
```

## What It Checks

The doctor command verifies:

| Check | What It Verifies |
|-------|------------------|
| **Docker** | Docker is installed and accessible |
| **Docker Compose** | Compose v2 is available |
| **NVIDIA GPU** | GPU hardware is detected |
| **NVIDIA Container Toolkit** | Docker can access GPUs |
| **Claude Code** | Claude CLI is installed |
| **Ollama API** | Ollama is running and reachable |

## Example Output

### All Checks Pass

```
Checking system requirements...

✓ Docker: Installed (Docker version 28.0.1, build e180ab8)
✓ Docker Compose: Installed (v2) (Docker Compose version v2.40.0)
✓ NVIDIA GPU: 1 GPU(s) detected (NVIDIA RTX 4090)
✓ NVIDIA Container Toolkit: nvidia runtime available
✓ Claude Code: Installed (2.1.12 (Claude Code))
✓ Ollama API: Connected (5 models) (http://localhost:11434)

All checks passed! Ready to use loclaude.
```

### Some Checks Fail

```
Checking system requirements...

✓ Docker: Installed (Docker version 28.0.1)
✓ Docker Compose: Installed (v2)
✗ NVIDIA GPU: No GPU detected
✗ NVIDIA Container Toolkit: nvidia runtime not found
✓ Claude Code: Installed (2.1.12)
✗ Ollama API: Connection refused

Some checks failed. See above for details.
```

## Fixing Common Issues

### Docker Not Found

Install Docker:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Or install Docker Desktop
```

### Docker Compose Not Found

Docker Compose v2 comes with Docker Desktop. For standalone installation:

```bash
sudo apt-get install docker-compose-plugin
```

### NVIDIA GPU Not Detected

1. Check that your GPU is visible:
   ```bash
   lspci | grep -i nvidia
   ```

2. Install/update NVIDIA drivers:
   ```bash
   sudo ubuntu-drivers autoinstall
   ```

3. Verify drivers are loaded:
   ```bash
   nvidia-smi
   ```

### NVIDIA Container Toolkit Missing

Install the container toolkit:

```bash
# Add repository
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Install
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Configure Docker
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### Claude Code Not Installed

Install the Claude Code CLI:

```bash
npm install -g @anthropic-ai/claude-code
```

### Ollama API Not Running

Start the containers:

```bash
loclaude docker-up
```

Wait for startup, then check again:

```bash
loclaude doctor
```

If still failing, check container logs:

```bash
loclaude docker-logs -s ollama
```

## Related Commands

| Command | Description |
|---------|-------------|
| `config` | Show current configuration |
| `config-paths` | Show config file locations |
| `docker-status` | Show container status |
| `docker-logs` | View container logs |
