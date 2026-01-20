# Installation

This guide covers installing loclaude and its prerequisites.

## Prerequisites

Before installing loclaude, ensure you have the following:

### Required

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | v2+ | `docker compose version` |
| NVIDIA Drivers | 525+ | `nvidia-smi` |
| NVIDIA Container Toolkit | Latest | `docker run --gpus all nvidia/cuda:11.0-base nvidia-smi` |
| Claude Code | Latest | `claude --version` |

### Runtime (one of)

| Runtime | Version | Check Command |
|---------|---------|---------------|
| Node.js | 18+ | `node --version` |
| Bun | 1.0+ | `bun --version` |

## Install loclaude

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

You should see output like:

```
Checking system requirements...

✓ Docker: Installed (Docker version 28.x.x)
✓ Docker Compose: Installed (v2) (Docker Compose version v2.x.x)
✓ NVIDIA GPU: 1 GPU(s) detected (NVIDIA RTX 4090)
✓ NVIDIA Container Toolkit: nvidia runtime available
✓ Claude Code: Installed (2.x.x)
✗ Ollama API: Not running

Some checks failed. See above for details.
```

> **Note:** The Ollama API check will fail until you start the containers.

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

### NVIDIA Container Toolkit

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

### Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

## Next Steps

Now that loclaude is installed, continue to the [Quick Start](quickstart.md) guide.
