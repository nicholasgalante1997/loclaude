/**
 * doctor command - Check prerequisites and system health
 */

import { getOllamaUrl } from '../config';
import { commandExists, getCommandVersion, spawnCapture } from '../spawn';

interface CheckResult {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  version?: string;
  hint?: string;
}

async function checkDocker(): Promise<CheckResult> {
  const exists = await commandExists('docker');
  if (!exists) {
    return {
      name: 'Docker',
      status: 'error',
      message: 'Not installed',
      hint: 'Install Docker: https://docs.docker.com/get-docker/'
    };
  }

  const version = await getCommandVersion('docker');
  return {
    name: 'Docker',
    status: 'ok',
    message: 'Installed',
    version: version ?? undefined
  };
}

async function checkDockerCompose(): Promise<CheckResult> {
  // Try docker compose (v2) first
  const result = await spawnCapture(['docker', 'compose', 'version']);
  if (result.exitCode === 0) {
    const version = result.stdout?.trim().split('\n')[0];
    return {
      name: 'Docker Compose',
      status: 'ok',
      message: 'Installed (v2)',
      version: version ?? undefined
    };
  }

  // Fall back to docker-compose (v1)
  const v1Exists = await commandExists('docker-compose');
  if (v1Exists) {
    const version = await getCommandVersion('docker-compose');
    return {
      name: 'Docker Compose',
      status: 'warning',
      message: 'Using legacy v1',
      version: version ?? undefined,
      hint: 'Consider upgrading to Docker Compose v2'
    };
  }

  return {
    name: 'Docker Compose',
    status: 'error',
    message: 'Not installed',
    hint: 'Docker Compose is included with Docker Desktop, or install separately'
  };
}

async function checkNvidiaSmi(): Promise<CheckResult> {
  const exists = await commandExists('nvidia-smi');
  if (!exists) {
    return {
      name: 'NVIDIA GPU',
      status: 'warning',
      message: 'nvidia-smi not found',
      hint: 'GPU support requires NVIDIA drivers. CPU-only mode will be used.'
    };
  }

  const result = await spawnCapture(['nvidia-smi', '--query-gpu=name', '--format=csv,noheader']);
  if (result.exitCode === 0 && result.stdout) {
    const gpus = result.stdout.trim().split('\n').filter(Boolean);
    return {
      name: 'NVIDIA GPU',
      status: 'ok',
      message: `${gpus.length} GPU(s) detected`,
      version: gpus[0]
    };
  }

  return {
    name: 'NVIDIA GPU',
    status: 'warning',
    message: 'nvidia-smi failed',
    hint: 'GPU may not be available. Check NVIDIA drivers.'
  };
}

async function checkNvidiaContainerToolkit(): Promise<CheckResult> {
  // Check if nvidia container runtime is available
  const result = await spawnCapture(['docker', 'info', '--format', '{{.Runtimes}}']);
  if (result.exitCode === 0 && result.stdout?.includes('nvidia')) {
    return {
      name: 'NVIDIA Container Toolkit',
      status: 'ok',
      message: 'nvidia runtime available'
    };
  }

  return {
    name: 'NVIDIA Container Toolkit',
    status: 'warning',
    message: 'nvidia runtime not found',
    hint: 'Install: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html'
  };
}

async function checkClaude(): Promise<CheckResult> {
  const exists = await commandExists('claude');
  if (!exists) {
    return {
      name: 'Claude Code',
      status: 'error',
      message: 'Not installed',
      hint: 'Install: npm install -g @anthropic-ai/claude-code'
    };
  }

  const version = await getCommandVersion('claude');
  return {
    name: 'Claude Code',
    status: 'ok',
    message: 'Installed',
    version: version ?? undefined
  };
}

async function checkOllamaConnection(): Promise<CheckResult> {
  const ollamaUrl = getOllamaUrl();
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = (await response.json()) as { models?: unknown[] };
      const modelCount = data.models?.length ?? 0;
      return {
        name: 'Ollama API',
        status: 'ok',
        message: `Connected (${modelCount} model${modelCount === 1 ? '' : 's'})`,
        version: ollamaUrl
      };
    }

    return {
      name: 'Ollama API',
      status: 'warning',
      message: `HTTP ${response.status}`,
      hint: 'Ollama may not be running. Try: loclaude docker-up'
    };
  } catch (error) {
    return {
      name: 'Ollama API',
      status: 'warning',
      message: 'Not reachable',
      hint: `Cannot connect to ${ollamaUrl}. Start Ollama: loclaude docker-up`
    };
  }
}

function formatCheck(check: CheckResult): string {
  const icons = {
    ok: '✓',
    warning: '⚠',
    error: '✗'
  };

  const colors = {
    ok: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m'
  };

  const reset = '\x1b[0m';
  const icon = icons[check.status];
  const color = colors[check.status];

  let line = `${color}${icon}${reset} ${check.name}: ${check.message}`;
  if (check.version) {
    line += ` (${check.version})`;
  }

  if (check.hint) {
    line += `\n    ${check.hint}`;
  }

  return line;
}

export async function doctor(): Promise<void> {
  console.log('Checking system requirements...\n');

  const checks: CheckResult[] = await Promise.all([
    checkDocker(),
    checkDockerCompose(),
    checkNvidiaSmi(),
    checkNvidiaContainerToolkit(),
    checkClaude(),
    checkOllamaConnection()
  ]);

  for (const check of checks) {
    console.log(formatCheck(check));
  }

  const errors = checks.filter((c) => c.status === 'error');
  const warnings = checks.filter((c) => c.status === 'warning');

  console.log('');

  if (errors.length > 0) {
    console.log(`\x1b[31m${errors.length} error(s) found.\x1b[0m Fix these before proceeding.`);
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(
      `\x1b[33m${warnings.length} warning(s).\x1b[0m loclaude may work with limited functionality.`
    );
  } else {
    console.log('\x1b[32mAll checks passed!\x1b[0m Ready to use loclaude.');
  }
}
