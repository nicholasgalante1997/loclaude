# Claude Code Instructions

Guidelines for working with the loclaude CLI and Docker repository.

## Project Overview

**loclaude** is an npm package that runs Claude Code with local Ollama LLMs. It provides:
- CLI commands for launching Claude Code connected to Ollama
- Docker container management for Ollama + Open WebUI
- Project scaffolding with `loclaude init`
- Cross-runtime support (Bun and Node.js)

## Key Files

| File | Purpose |
|------|---------|
| `bin/index.ts` | Bun entry point |
| `bin/index.mjs` | Node.js entry point |
| `libs/cli/lib/cac.ts` | CLI command definitions |
| `libs/cli/lib/commands/` | Command implementations |
| `libs/cli/lib/config.ts` | Configuration system |
| `libs/cli/lib/spawn.ts` | Cross-runtime process spawning |
| `docker/docker-compose.yml` | Bundled Docker template |
| `package.json` | Root package (published to npm) |
| `libs/cli/package.json` | Internal CLI workspace package |

## Patterns & Conventions

### CLI Commands

Command naming follows these conventions:
- Hyphenated subcommands: `docker-up`, `models-pull`
- Base commands for listing: `models` (lists models), `config` (shows config)
- Action suffixes: `-pull`, `-rm`, `-show`, `-run`

### Configuration Priority

1. CLI arguments (highest)
2. Environment variables (`OLLAMA_URL`, `OLLAMA_MODEL`, etc.)
3. Project config (`./.loclaude/config.json`)
4. User config (`~/.config/loclaude/config.json`)
5. Default values (lowest)

### Docker Compose

- Bundled template in `libs/cli/lib/commands/init.ts`
- Deployed to user projects via `loclaude init`
- GPU support uses NVIDIA runtime with `deploy.resources.reservations.devices`
- Service names: `ollama`, `open-webui`
- Health checks defined for both services

### Docker Volume Mounts

- Ollama models: `./models:/root/.ollama` (persists models on host)
- Open WebUI data: named volume `open-webui:/app/backend/data`

### Networking

Services communicate via Docker's internal network:
- Open WebUI reaches Ollama at `http://ollama:11434`
- External access: Ollama on port 11434, WebUI on port 3000

## Common Operations

### Testing CLI Changes

```bash
# Rebuild
bun run build

# Test commands
bun bin/index.ts doctor
node bin/index.mjs config

# Test in a fresh directory
mkdir /tmp/test-loclaude && cd /tmp/test-loclaude
bun ~/path/to/ollama/bin/index.ts init
```

### Local Development Workflow

```bash
# Start containers
loclaude docker-up  # or: bun bin/index.ts docker-up

# Pull a model
loclaude models-pull qwen3-coder:30b

# Run Claude Code with local Ollama
loclaude run
```

## CLI Development

The `loclaude` CLI is built in `libs/cli/` as an internal workspace package.

### Architecture

```
libs/cli/
├── lib/
│   ├── cac.ts           # CLI definition using cac
│   ├── commands/        # Command implementations
│   │   ├── init.ts      # Project scaffolding
│   │   ├── doctor.ts    # System checks
│   │   ├── docker.ts    # Container management
│   │   ├── models.ts    # Ollama model operations
│   │   └── config.ts    # Config display
│   ├── config.ts        # Configuration loading/merging
│   ├── spawn.ts         # Cross-runtime process spawning
│   ├── utils.ts         # Ollama API utilities
│   └── constants.ts     # Default values
├── build/               # Bun build configuration
└── dist/                # Built bundles (index.js, index.bun.js)
```

### Building

```bash
bun run build          # Build all packages via turbo
cd libs/cli && bun run build  # Build CLI only
```

### Testing Locally

```bash
# Direct execution
bun bin/index.ts --help
node bin/index.mjs --help

# Test specific commands
bun bin/index.ts doctor
node bin/index.mjs config
```

### Adding New Commands

1. Create command file in `libs/cli/lib/commands/`
2. Export functions from `libs/cli/lib/commands/index.ts`
3. Register with cac in `libs/cli/lib/cac.ts`
4. Rebuild: `bun run build`

### Cross-Runtime Spawning

Use the `spawn` function from `./spawn.ts` instead of `Bun.spawn()` directly:

```typescript
import { spawn, spawnCapture } from "./spawn";

// Inherit stdio (for interactive commands)
await spawn(["docker", "compose", "up"], { env: process.env });

// Capture output
const result = await spawnCapture(["docker", "--version"]);
console.log(result.stdout);
```

### Releasing

```bash
# Run pre-release checks
bun run prerelease-check

# Publish to npm
bun run release        # Publish as latest
bun run release:rc     # Publish with rc tag
bun run release:beta   # Publish with beta tag
```

## Do Not

- Commit anything in `docker/models/` (gitignored, contains large model files)
- Use `Bun.spawn()` directly - use `spawn()` from `./spawn.ts` for cross-runtime support
- Hardcode Ollama URLs - always use `getOllamaUrl()` from config
- Forget to export new commands from `libs/cli/lib/commands/index.ts`
