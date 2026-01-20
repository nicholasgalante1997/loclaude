# API Reference

Technical reference for loclaude's internal APIs.

## Overview

loclaude is primarily a CLI tool, but understanding its internal architecture can help with:

- Troubleshooting
- Contributing
- Building integrations

## Architecture

```
bin/
├── index.ts        # Bun entry point
└── index.mjs       # Node.js entry point

libs/cli/
├── lib/
│   ├── cac.ts      # CLI definition
│   ├── commands/   # Command implementations
│   ├── config.ts   # Configuration system
│   ├── spawn.ts    # Cross-runtime process spawning
│   └── utils.ts    # Utilities
└── dist/           # Built bundles
```

## Ollama API

loclaude communicates with Ollama via its REST API.

### List Models

```bash
GET /api/tags
```

**Response:**
```json
{
  "models": [
    {
      "name": "qwen3-coder:30b",
      "size": 17716740096,
      "modified_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Generate

```bash
POST /api/generate
```

**Request:**
```json
{
  "model": "qwen3-coder:30b",
  "prompt": "Write a function to sort a list",
  "stream": true
}
```

## Configuration API

### loadConfig()

Loads and merges configuration from all sources.

```typescript
import { loadConfig } from './config';

const config = loadConfig();
// Returns LoclaudeConfig object
```

### Config Priority

1. CLI arguments
2. Environment variables
3. Project config (`./.loclaude/config.json`)
4. User config (`~/.config/loclaude/config.json`)
5. Defaults

### Config Schema

```typescript
interface LoclaudeConfig {
  ollama: {
    url: string;           // Default: "http://localhost:11434"
    defaultModel: string;  // Default: "qwen3-coder:30b"
  };
  docker: {
    composeFile: string;   // Default: "./docker-compose.yml"
    gpu: boolean;          // Default: true
  };
  claude: {
    extraArgs: string[];   // Default: []
  };
}
```

## Spawn API

Cross-runtime process spawning that works with both Bun and Node.js.

### spawn()

Spawn a process with inherited stdio.

```typescript
import { spawn } from './spawn';

const exitCode = await spawn(['claude', '--model', 'qwen3-coder:30b'], {
  env: process.env,
  cwd: process.cwd(),
});
```

### spawnCapture()

Spawn a process and capture output.

```typescript
import { spawnCapture } from './spawn';

const result = await spawnCapture(['docker', '--version']);
console.log(result.stdout);  // "Docker version 28.0.1..."
console.log(result.exitCode); // 0
```

### commandExists()

Check if a command is available.

```typescript
import { commandExists } from './spawn';

if (await commandExists('docker')) {
  console.log('Docker is installed');
}
```

### getCommandVersion()

Get a command's version string.

```typescript
import { getCommandVersion } from './spawn';

const version = await getCommandVersion('docker');
// "Docker version 28.0.1, build e180ab8"
```

## Runtime Detection

loclaude detects the runtime to use appropriate APIs:

```typescript
if (typeof Bun !== 'undefined') {
  // Bun runtime
  const proc = Bun.spawn(cmd, opts);
} else {
  // Node.js runtime
  const { spawn } = await import('child_process');
  const proc = spawn(cmd[0], cmd.slice(1), opts);
}
```

## Building

### Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Test locally
bun bin/index.ts --help
node bin/index.mjs --help
```

### Production Build

```bash
# Full build with turbo
bun run build

# Pack for distribution
npm pack
```

## Contributing

See the [GitHub repository](https://github.com/nicholasgalante1997/docker-ollama/loclaude) for:

- Contribution guidelines
- Development setup
- Issue reporting
