import { select } from "@inquirer/prompts";
import { OLLAMA_URL } from "./constants";
import type { OllamaModel, OllamaTagsResponse } from "./types";
import bytes from "bytes";

/**
 * Fetch available models from Ollama API
 */
export async function fetchOllamaModels(): Promise<OllamaModel[]> {
  const response = await fetch(`${OLLAMA_URL}/api/tags`);
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
  let models: OllamaModel[];

  try {
    models = await fetchOllamaModels();
  } catch (error) {
    console.error("Error: Could not connect to Ollama at", OLLAMA_URL);
    console.error("Make sure Ollama is running: mise run status");
    process.exit(1);
  }

  if (models.length === 0) {
    console.error("Error: No models found in Ollama.");
    console.error("Pull a model first: mise run pull <model-name>");
    process.exit(1);
  }

  const selected = await select({
    message: "Select a model",
    choices: models.map((model) => ({
      name: `${model.name} (${bytes(model.size)})`,
      value: model.name,
    })),
  });

  return selected;
}

/**
 * Launch Claude with Ollama configuration
 */
export async function launchClaude(model: string, passthroughArgs: string[]) {
  const env = {
    ...process.env,
    ANTHROPIC_AUTH_TOKEN: "ollama",
    ANTHROPIC_BASE_URL: OLLAMA_URL,
  };

  const claudeArgs = ["claude", "--model", model, ...passthroughArgs];

  const proc = Bun.spawn(claudeArgs, {
    env,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  process.exit(await proc.exited);
}
