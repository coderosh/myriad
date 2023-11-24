import { promises as readline } from "readline";

import { print } from "./Interpreter/utils";
import { getRunner, LangType } from "./index";
import { Value } from "./Interpreter/types";

const repl = async (type: LangType = "main", name: string, version: number) => {
  console.log(`\n Repl ${name} v${version} \n`);

  let run = getRunner(type);

  const prompt = createPrompt();

  while (true) {
    try {
      const src = await prompt.question("> ");

      if (src.trim() === "exit") {
        break;
      } else if (src.trim() === "lang") {
        const which = (await prompt.question("> Which ? ")) as LangType;
        run = getRunner(which);
        continue;
      }

      const value = run(src, false) as Value;

      if (value && value.type !== "ignore") print([value]);
    } catch (err: any) {
      console.error(err);
    }
  }

  prompt.close();
};

export default repl;

const createPrompt = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    question: (query: string) => rl.question(query),
    close: () => rl.close(),
  };
};
