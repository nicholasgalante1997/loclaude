# Installation

This guide covers installing loclaude and its prerequisites.

## Prerequisites

Before installing loclaude, ensure you have the following:

### Required

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | v2+ | `docker compose version` |
| Claude Code | Latest | `claude --version` |

### For GPU Mode (Recommended)

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| NVIDIA Drivers | 525+ | `nvidia-smi` |
| NVIDIA Container Toolkit | Latest | `docker run --gpus all nvidia/cuda:12.0-base nvidia-smi` |

> **Note:** GPU is optional! loclaude works in CPU-only mode with `--no-gpu` flag.

### Runtime (one of)

| Runtime | Version | Check Command |
|---------|---------|---------------|
| Node.js | 18+ | `node --version` |
| Bun | 1.0+ | `bun --version` |

## Install loclaude

> Bun is a first class citizen here, the future is now old man!

<!-- tabs:start -->

#### **bun**

```bash
bun install -g loclaude
```

#### **npm**

```bash
npm install -g loclaude
```

#### **pnpm**

```bash
pnpm add -g loclaude
```

#### **yarn**

```bash
yarn global add loclaude
```

<!-- tabs:end -->

## Verify Installation

After installing, verify everything is set up correctly:

```bash
loclaude doctor
```

### With GPU

```
  System Health Check
  ─────────────────────

✓ Docker: Installed (Docker version 28.x.x)
✓ Docker Compose: Installed (v2) (Docker Compose version v2.x.x)
✓ NVIDIA GPU: 1 GPU(s) detected (NVIDIA RTX 4090)
✓ NVIDIA Container Toolkit: nvidia runtime available
✓ Claude Code: Installed (2.x.x)
⚠ Ollama API: Not reachable
    → Cannot connect to http://localhost:11434. Start Ollama: loclaude docker-up

1 warning(s). loclaude may work with limited functionality.
```

### CPU-Only (No GPU)

```
  System Health Check
  ─────────────────────

✓ Docker: Installed (Docker version 28.x.x)
✓ Docker Compose: Installed (v2) (Docker Compose version v2.x.x)
⚠ NVIDIA GPU: nvidia-smi not found
    → GPU support requires NVIDIA drivers. CPU-only mode will be used.
⚠ NVIDIA Container Toolkit: nvidia runtime not found
    → Install: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html
✓ Claude Code: Installed (2.x.x)
⚠ Ollama API: Not reachable

3 warning(s). loclaude may work with limited functionality.
```

> **Note:** GPU warnings are expected for CPU-only setups. Use `loclaude init --no-gpu` to configure CPU mode.

## Installing Prerequisites

### Docker

<!-- tabs:start -->

#### **Ubuntu/Debian**

```bash
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### **macOS**

```bash
# Install Docker Desktop
brew install --cask docker

# Start Docker Desktop from Applications
```

#### **Windows**

1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Run the installer
3. Enable WSL 2 when prompted
4. Restart your computer

<!-- tabs:end -->

### NVIDIA Container Toolkit (GPU Mode Only)

Skip this section if using CPU-only mode.

```bash
# Configure the repository
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Install the toolkit
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Configure Docker
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

Verify GPU access:

```bash
docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi
```

### Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

## Next Steps

Now that loclaude is installed, continue to the [Quick Start](quickstart.md) guide.

### GPU Users

```bash
loclaude init          # Auto-detects GPU
loclaude docker-up
loclaude models-pull qwen3-coder:30b
loclaude run
```

### CPU-Only Users

```bash
loclaude init --no-gpu
loclaude docker-up
loclaude models-pull qwen2.5-coder:7b
loclaude run
```
