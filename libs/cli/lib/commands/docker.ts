/**
 * docker command - Manage Docker containers
 */

import { existsSync } from 'fs';
import path, { join, isAbsolute } from 'path';
import { fileURLToPath } from 'url';
import { getComposeFile } from '../config';
import { spawn } from '../spawn';

/**
 * Find docker-compose.yml using config or searching directories
 */
function findComposeFile(): string | null {
  // First, check config for explicit compose file path
  const configPath = getComposeFile();
  if (configPath) {
    const absolutePath = isAbsolute(configPath) ? configPath : join(process.cwd(), configPath);
    if (existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  // Search in workspace only
  let dir = process.cwd();

  while (dir !== '/' && dir.startsWith(process.cwd())) {
    const composePath = join(dir, 'docker-compose.yml');
    if (existsSync(composePath)) {
      return composePath;
    }

    // Also check in docker/ subdirectory
    const dockerComposePath = join(dir, 'docker', 'docker-compose.yml');
    if (existsSync(dockerComposePath)) {
      return dockerComposePath;
    }

    dir = join(dir, '..');
  }

  /**
   * At this point, there's no locally defined docker compose file,
   * so we can at this time use the one that we ship with
   * we expect this script to run from bin/
   * and we package and ship the docker compose file in docker/docker-compose
   *
   * so we can reliably try to grab docker/docker-compose.yml from
   *    import.meta.url + '..' + 'docker/docker-compose.yml';
   */
  const backup = path.resolve(fileURLToPath(import.meta.url), '..', 'docker', 'docker-compose.yml');

  if (existsSync(backup)) {
    return backup;
  }

  return null;
}

/**
 * Get docker compose command (v2 preferred)
 */
function getComposeCommand(): string[] {
  return ['docker', 'compose'];
}

export interface DockerOptions {
  file?: string;
  detach?: boolean;
}

async function runCompose(args: string[], options: DockerOptions = {}): Promise<number> {
  const composeFile = options.file ?? findComposeFile();

  if (!composeFile) {
    console.error('Error: No docker-compose.yml found');
    console.error("Run 'loclaude init' to create one, or specify --file");
    return 1;
  }

  const cmd = [...getComposeCommand(), '-f', composeFile, ...args];
  return spawn(cmd);
}

export async function dockerUp(options: DockerOptions = {}): Promise<void> {
  const args = ['up'];
  if (options.detach !== false) {
    args.push('-d');
  }

  console.log('Starting containers...\n');
  const exitCode = await runCompose(args, options);

  if (exitCode === 0) {
    console.log('\n✓ Containers started');
    console.log('\nService URLs:');
    console.log('  Ollama API:  http://localhost:11434');
    console.log('  Open WebUI:  http://localhost:3000');
  }

  process.exit(exitCode);
}

export async function dockerDown(options: DockerOptions = {}): Promise<void> {
  console.log('Stopping containers...\n');
  const exitCode = await runCompose(['down'], options);

  if (exitCode === 0) {
    console.log('\n✓ Containers stopped');
  }

  process.exit(exitCode);
}

export async function dockerStatus(options: DockerOptions = {}): Promise<void> {
  const exitCode = await runCompose(['ps'], options);
  process.exit(exitCode);
}

export async function dockerLogs(
  options: DockerOptions & { follow?: boolean; service?: string } = {}
): Promise<void> {
  const args = ['logs'];

  if (options.follow) {
    args.push('-f');
  }

  if (options.service) {
    args.push(options.service);
  }

  const exitCode = await runCompose(args, options);
  process.exit(exitCode);
}

export async function dockerRestart(options: DockerOptions = {}): Promise<void> {
  console.log('Restarting containers...\n');
  const exitCode = await runCompose(['restart'], options);

  if (exitCode === 0) {
    console.log('\n✓ Containers restarted');
  }

  process.exit(exitCode);
}

export async function dockerExec(
  service: string,
  command: string[],
  options: DockerOptions = {}
): Promise<number> {
  const composeFile = options.file ?? findComposeFile();

  if (!composeFile) {
    console.error('Error: No docker-compose.yml found');
    return 1;
  }

  const cmd = [...getComposeCommand(), '-f', composeFile, 'exec', service, ...command];

  return spawn(cmd);
}
