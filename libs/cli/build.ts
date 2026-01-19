import { concurrent_build, bun_config, node_config } from "./build/index.js";

try {
    await concurrent_build(bun_config, node_config);
} catch(e) {
    console.error('An error occurred during the build', e);
    process.exit(1);
}