export const base_config: Bun.BuildConfig = {
  entrypoints: ['lib/index.ts'],
  outdir: './dist',
  format: 'esm',
  splitting: false,
  sourcemap: 'linked',
  minify: false,
  root: '.',
  packages: 'bundle'
};

export default base_config;
