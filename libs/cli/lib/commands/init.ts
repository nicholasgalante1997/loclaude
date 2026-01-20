/**
 * init command - Scaffold docker-compose.yml and config
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Bundled docker-compose.yml template
const DOCKER_COMPOSE_TEMPLATE = `services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "ollama", "list"]
      interval: 300s
      timeout: 2s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  open-webui:
    image: ghcr.io/open-webui/open-webui:cuda
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - ollama
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    volumes:
      - open-webui:/app/backend/data
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  open-webui:
`;

// Default config template
const CONFIG_TEMPLATE = `{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  },
  "docker": {
    "composeFile": "./docker-compose.yml",
    "gpu": true
  }
}
`;

// .gitignore template for models directory
const GITIGNORE_TEMPLATE = `# Ollama models (large binary files)
models/
`;

// mise.toml template
const MISE_TOML_TEMPLATE = `# Mise task runner configuration
# Run \`mise tasks\` to see all available tasks
# https://mise.jdx.dev/

[tasks]

# =============================================================================
# Docker Management
# =============================================================================

[tasks.up]
description = "Start Ollama and Open WebUI containers"
run = "loclaude docker-up"

[tasks.down]
description = "Stop all containers"
run = "loclaude docker-down"

[tasks.restart]
description = "Restart all containers"
run = "loclaude docker-restart"

[tasks.status]
description = "Show container status"
run = "loclaude docker-status"

[tasks.logs]
description = "Follow container logs"
run = "loclaude docker-logs --follow"

# =============================================================================
# Model Management
# =============================================================================

[tasks.models]
description = "List installed models"
run = "loclaude models"

[tasks.pull]
description = "Pull a model (usage: mise run pull <model-name>)"
run = "loclaude models-pull {{arg(name='model')}}"

# =============================================================================
# Claude Code
# =============================================================================

[tasks.claude]
description = "Run Claude Code with local Ollama"
run = "loclaude run"

[tasks."claude:model"]
description = "Run Claude with specific model (usage: mise run claude:model <model>)"
run = "loclaude run -m {{arg(name='model')}}"

# =============================================================================
# Diagnostics
# =============================================================================

[tasks.doctor]
description = "Check system requirements"
run = "loclaude doctor"

[tasks.gpu]
description = "Check GPU status"
run = "docker exec ollama nvidia-smi"
`;

// README.md template
const README_TEMPLATE = `# Project Name

> Powered by [loclaude](https://github.com/nicholasgalante1997/docker-ollama) - Run Claude Code with local Ollama LLMs

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- [NVIDIA GPU](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) with drivers and container toolkit
- [mise](https://mise.jdx.dev/) task runner (recommended)
- [loclaude](https://www.npmjs.com/package/loclaude) CLI (\`npm install -g loclaude\`)

## Quick Start

\`\`\`bash
# Start the LLM backend (Ollama + Open WebUI)
mise run up

# Pull a model
mise run pull qwen3-coder:30b

# Run Claude Code with local LLM
mise run claude
\`\`\`

## Available Commands

Run \`mise tasks\` to see all available commands.

| Command | Description |
|---------|-------------|
| \`mise run up\` | Start Ollama and Open WebUI containers |
| \`mise run down\` | Stop all containers |
| \`mise run status\` | Show container status |
| \`mise run logs\` | Follow container logs |
| \`mise run models\` | List installed models |
| \`mise run pull <model>\` | Pull a model from Ollama registry |
| \`mise run claude\` | Run Claude Code with model selection |
| \`mise run claude:model <model>\` | Run Claude with specific model |
| \`mise run doctor\` | Check system requirements |
| \`mise run gpu\` | Check GPU status |

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Ollama API | http://localhost:11434 | LLM inference API |
| Open WebUI | http://localhost:3000 | Chat interface |

## Project Structure

\`\`\`
.
├── .claude/
│   └── CLAUDE.md          # Claude Code instructions
├── .loclaude/
│   └── config.json        # Loclaude configuration
├── models/                # Ollama model storage (gitignored)
├── docker-compose.yml     # Container definitions
├── mise.toml              # Task runner configuration
└── README.md
\`\`\`

## Configuration

### Loclaude Config (\`.loclaude/config.json\`)

\`\`\`json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  },
  "docker": {
    "composeFile": "./docker-compose.yml",
    "gpu": true
  }
}
\`\`\`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`OLLAMA_URL\` | Ollama API endpoint | \`http://localhost:11434\` |
| \`OLLAMA_MODEL\` | Default model name | \`qwen3-coder:30b\` |

## Troubleshooting

### Check System Requirements

\`\`\`bash
mise run doctor
\`\`\`

### View Container Logs

\`\`\`bash
mise run logs
\`\`\`

### Restart Containers

\`\`\`bash
mise run down && mise run up
\`\`\`

## License

MIT
`;

// .claude/CLAUDE.md template
const CLAUDE_MD_TEMPLATE = `# Claude Code Instructions

Project-specific instructions for Claude Code.

## Project Overview

This project uses [loclaude](https://github.com/nicholasgalante1997/docker-ollama) to run Claude Code with local Ollama LLMs.

## Quick Reference

\`\`\`bash
# Start the LLM backend
mise run up

# Run Claude Code
mise run claude

# Check system status
mise run doctor
\`\`\`

## Available Commands

| Command | Description |
|---------|-------------|
| \`mise run up\` | Start Ollama + Open WebUI containers |
| \`mise run down\` | Stop containers |
| \`mise run claude\` | Run Claude Code with model selection |
| \`mise run models\` | List installed models |
| \`mise run pull <model>\` | Pull a new model |
| \`mise run doctor\` | Check prerequisites |

## Service URLs

- **Ollama API:** http://localhost:11434
- **Open WebUI:** http://localhost:3000

## Configuration

- **Docker:** \`docker-compose.yml\`
- **Loclaude:** \`.loclaude/config.json\`
- **Tasks:** \`mise.toml\`

## Conventions

<!-- Add project-specific conventions here -->

## Do Not

- Commit the \`models/\` directory (contains large model files)
`;

export interface InitOptions {
  force?: boolean;
  noWebui?: boolean;
}

export async function init(options: InitOptions = {}): Promise<void> {
  const cwd = process.cwd();
  const composePath = join(cwd, 'docker-compose.yml');
  const configDir = join(cwd, '.loclaude');
  const configPath = join(configDir, 'config.json');
  const modelsDir = join(cwd, 'models');
  const gitignorePath = join(cwd, '.gitignore');
  const miseTomlPath = join(cwd, 'mise.toml');
  const claudeDir = join(cwd, '.claude');
  const claudeMdPath = join(claudeDir, 'CLAUDE.md');
  const readmePath = join(cwd, 'README.md');

  console.log('Initializing loclaude project...\n');

  // Create README.md
  if (existsSync(readmePath) && !options.force) {
    console.log('⚠️  README.md already exists');
  } else {
    writeFileSync(readmePath, README_TEMPLATE);
    console.log('✓ Created README.md');
  }

  // Check for existing docker-compose.yml
  if (existsSync(composePath) && !options.force) {
    console.log('⚠️  docker-compose.yml already exists');
    console.log('   Use --force to overwrite\n');
  } else {
    let composeContent = DOCKER_COMPOSE_TEMPLATE;

    // Remove open-webui if --no-webui flag
    if (options.noWebui) {
      composeContent = composeContent
        .replace(/\n  open-webui:[\s\S]*?capabilities: \[gpu\]\n/m, '\n')
        .replace(/\nvolumes:\n  open-webui:\n/, '\n');
    }

    writeFileSync(composePath, composeContent);
    console.log('✓ Created docker-compose.yml');
  }

  // Create mise.toml
  if (existsSync(miseTomlPath) && !options.force) {
    console.log('⚠️  mise.toml already exists');
  } else {
    writeFileSync(miseTomlPath, MISE_TOML_TEMPLATE);
    console.log('✓ Created mise.toml');
  }

  // Create .claude directory and CLAUDE.md
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }
  if (existsSync(claudeMdPath) && !options.force) {
    console.log('⚠️  .claude/CLAUDE.md already exists');
  } else {
    writeFileSync(claudeMdPath, CLAUDE_MD_TEMPLATE);
    console.log('✓ Created .claude/CLAUDE.md');
  }

  // Create .loclaude config directory
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
    console.log('✓ Created .loclaude/ directory');
  }

  // Create config file
  if (existsSync(configPath) && !options.force) {
    console.log('⚠️  .loclaude/config.json already exists');
  } else {
    writeFileSync(configPath, CONFIG_TEMPLATE);
    console.log('✓ Created .loclaude/config.json');
  }

  // Create models directory
  if (!existsSync(modelsDir)) {
    mkdirSync(modelsDir, { recursive: true });
    console.log('✓ Created models/ directory');
  }

  // Append to .gitignore if it exists, or create it
  if (existsSync(gitignorePath)) {
    const existing = readFileSync(gitignorePath, 'utf-8');
    if (!existing.includes('models/')) {
      writeFileSync(gitignorePath, existing + '\n' + GITIGNORE_TEMPLATE);
      console.log('✓ Updated .gitignore');
    }
  } else {
    writeFileSync(gitignorePath, GITIGNORE_TEMPLATE);
    console.log('✓ Created .gitignore');
  }

  console.log('\n🎉 Project initialized!\n');
  console.log('Next steps:');
  console.log('  1. Start containers:  mise run up');
  console.log('  2. Pull a model:      mise run pull qwen3-coder:30b');
  console.log('  3. Run Claude:        mise run claude');
  console.log('\nService URLs:');
  console.log('  Ollama API:  http://localhost:11434');
  if (!options.noWebui) {
    console.log('  Open WebUI:  http://localhost:3000');
  }
}
