import cac from "cac";
import { DEFAULT_MODEL } from "./constants";
import { launchClaude, selectModelInteractively } from "./utils";

// CLI setup
const cli = cac("loclaude");

cli
  .command("[...args]", "Run Claude Code with local Ollama")
  .option("-m, --model <name>", "Specify model to use", {
    default: "",
  })
  .action(async (args: string[], options: { model: string }) => {
    let model: string;

    if (options.model) {
      model = options.model;
    } else if (args.includes("--help") || args.includes("-h")) {
      // Pass through help without prompting
      model = DEFAULT_MODEL;
    } else {
      model = await selectModelInteractively();
    }

    await launchClaude(model, args);
  });

export const help = () => cli.help();
export const version = () => cli.version("1.0.0");

export const run_cli = (): void => {
  cli.parse();
};

export { cli };
