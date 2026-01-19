import base_config from "./base";

export const bun_config: typeof base_config = {
  ...base_config,
  target: "bun",
  metafile: true,
  naming: {
    entry: "index.bun.js",
  },
};
