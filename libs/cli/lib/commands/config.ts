/**
 * config command - Show and manage configuration
 */

import { inspect } from 'util';
import { loadConfig, getActiveConfigPath, getConfigSearchPaths } from '../config';

export async function configShow(): Promise<void> {
  const config = loadConfig();
  const activePath = getActiveConfigPath();

  console.log('Current configuration:\n');
  console.log(inspect(config, false, 3, true));

  console.log('\n---');
  if (activePath) {
    console.log(`Loaded from: ${activePath}`);
  } else {
    console.log('Using default configuration (no config file found)');
  }
}

export async function configPaths(): Promise<void> {
  const paths = getConfigSearchPaths();
  const activePath = getActiveConfigPath();

  console.log('Config file search paths (in priority order):\n');

  for (const path of paths) {
    const isActive = path === activePath;
    const marker = isActive ? ' ← active' : '';
    console.log(`  ${path}${marker}`);
  }

  if (!activePath) {
    console.log('\nNo config file found. Using defaults.');
    console.log("Run 'loclaude init' to create a project config.");
  }
}
