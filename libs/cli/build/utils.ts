import type { BuildConfig, BuildOutput } from "bun";

export async function concurrent_build(...configs: BuildConfig[]) {
  let error = null,
    outputs: BuildOutput[] = [],
    start = performance.now(),
    builds = configs.map((config) => Bun.build({ ...config, metafile: true }));

  try {
    outputs = await Promise.all(builds);
  } catch (_error) {
    error = _error;
  } finally {
    let end = performance.now();
    let time = end - start;
    if (error) {
      console.error(`❌ Build failed after ${time.toFixed(2)} ms`);
      throw error;
    } else {
      console.log(`✅ Build succeeded in ${time.toFixed(2)} ms`);
      return outputs;
    }
  }
}
