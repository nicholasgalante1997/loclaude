/**
 * models command - Manage Ollama models
 */

import bytes from 'bytes';
import { getOllamaUrl } from '../config';
import type { OllamaModel, OllamaTagsResponse } from '../types';
import { spawn, spawnCapture } from '../spawn';

/**
 * Fetch models from Ollama API
 */
async function fetchModels(): Promise<OllamaModel[]> {
  const ollamaUrl = getOllamaUrl();
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as OllamaTagsResponse;
    return data.models ?? [];
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`Connection to Ollama timed out (${ollamaUrl})`);
    }
    throw error;
  }
}

/**
 * Check if Ollama is running in Docker
 */
async function isOllamaInDocker(): Promise<boolean> {
  const result = await spawnCapture(['docker', 'ps', '--filter', 'name=ollama', '--format', '{{.Names}}']);
  return result.exitCode === 0 && (result.stdout?.includes('ollama') ?? false);
}

/**
 * Run ollama command (via docker if container exists, otherwise direct)
 */
async function runOllamaCommand(args: string[]): Promise<number> {
  const inDocker = await isOllamaInDocker();

  if (inDocker) {
    return spawn(['docker', 'exec', '-it', 'ollama', 'ollama', ...args]);
  } else {
    return spawn(['ollama', ...args]);
  }
}

export async function modelsList(): Promise<void> {
  try {
    const models = await fetchModels();

    if (models.length === 0) {
      console.log('No models installed.');
      console.log('\nPull a model with: loclaude models-pull <model-name>');
      console.log('Example: loclaude models-pull llama3.2');
      return;
    }

    console.log('Installed models:\n');

    // Calculate column widths
    const nameWidth = Math.max(...models.map((m) => m.name.length), 'NAME'.length);
    const sizeWidth = 10;

    // Header
    console.log(`${'NAME'.padEnd(nameWidth)}  ${'SIZE'.padStart(sizeWidth)}  MODIFIED`);
    console.log('-'.repeat(nameWidth + sizeWidth + 30));

    // Rows
    for (const model of models) {
      const name = model.name.padEnd(nameWidth);
      const size = (bytes(model.size) ?? '?').padStart(sizeWidth);
      const modified = formatRelativeTime(model.modified_at);
      console.log(`${name}  ${size}  ${modified}`);
    }

    console.log(`\n${models.length} model(s) installed`);
  } catch (error) {
    const ollamaUrl = getOllamaUrl();
    console.error('Error: Could not connect to Ollama at', ollamaUrl);
    console.error('Make sure Ollama is running: loclaude docker-up');
    process.exit(1);
  }
}

export async function modelsPull(modelName: string): Promise<void> {
  if (!modelName) {
    console.error('Error: Model name required');
    console.error('Usage: loclaude models pull <model-name>');
    console.error('Example: loclaude models pull llama3.2');
    process.exit(1);
  }

  console.log(`Pulling model: ${modelName}\n`);
  const exitCode = await runOllamaCommand(['pull', modelName]);

  if (exitCode === 0) {
    console.log(`\n✓ Model '${modelName}' pulled successfully`);
  }

  process.exit(exitCode);
}

export async function modelsRm(modelName: string): Promise<void> {
  if (!modelName) {
    console.error('Error: Model name required');
    console.error('Usage: loclaude models rm <model-name>');
    process.exit(1);
  }

  console.log(`Removing model: ${modelName}\n`);
  const exitCode = await runOllamaCommand(['rm', modelName]);

  if (exitCode === 0) {
    console.log(`\n✓ Model '${modelName}' removed`);
  }

  process.exit(exitCode);
}

export async function modelsShow(modelName: string): Promise<void> {
  if (!modelName) {
    console.error('Error: Model name required');
    console.error('Usage: loclaude models show <model-name>');
    process.exit(1);
  }

  const exitCode = await runOllamaCommand(['show', modelName]);
  process.exit(exitCode);
}

export async function modelsRun(modelName: string): Promise<void> {
  if (!modelName) {
    console.error('Error: Model name required');
    console.error('Usage: loclaude models run <model-name>');
    process.exit(1);
  }

  const exitCode = await runOllamaCommand(['run', modelName]);
  process.exit(exitCode);
}

/**
 * Format a date string as relative time
 */
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString();
}
