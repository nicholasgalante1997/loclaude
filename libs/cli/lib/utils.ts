import { select } from '@inquirer/prompts';
import bytes from 'bytes';
import { getOllamaUrl, getClaudeExtraArgs } from './config';
import { spawn } from './spawn';
import type { OllamaModel, OllamaTagsResponse } from './types';

/**
 * Fetch available models from Ollama API
 */
export async function fetchOllamaModels(): Promise<OllamaModel[]> {
  const ollamaUrl = getOllamaUrl();
  const response = await fetch(`${ollamaUrl}/api/tags`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data = (await response.json()) as OllamaTagsResponse;
  return data.models ?? [];
}

/**
 * Interactive model selection prompt
 */
export async function selectModelInteractively(): Promise<string> {
  const ollamaUrl = getOllamaUrl();
  let models: OllamaModel[];

  try {
    models = await fetchOllamaModels();
  } catch (error) {
    console.error('Error: Could not connect to Ollama at', ollamaUrl);
    console.error('Make sure Ollama is running: loclaude docker-up');
    process.exit(1);
  }

  if (models.length === 0) {
    console.error('Error: No models found in Ollama.');
    console.error('Pull a model first: loclaude models-pull <model-name>');
    process.exit(1);
  }

  const selected = await select({
    message: 'Select a model',
    choices: models.map((model) => ({
      name: `${model.name} (${bytes(model.size)})`,
      value: model.name
    }))
  });

  return selected;
}

/**
 * Launch Claude with Ollama configuration
 */
export async function launchClaude(model: string, passthroughArgs: string[]) {
  const ollamaUrl = getOllamaUrl();
  const extraArgs = getClaudeExtraArgs();

  const env: Record<string, string | undefined> = {
    ...process.env,
    ANTHROPIC_AUTH_TOKEN: 'ollama',
    ANTHROPIC_BASE_URL: ollamaUrl
  };

  const claudeArgs = ['claude', '--model', model, ...extraArgs, ...passthroughArgs];
  const exitCode = await spawn(claudeArgs, { env });
  process.exit(exitCode);
}
