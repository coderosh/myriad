import readline from "readline";

import print from "./Interpreter/print";
import { getRunner, LangType } from "./index";
import { Value } from "./Interpreter/types";

const repl = async (
  type: LangType = "myriad",
  name: string,
  version: number
) => {
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
      } else if (src.trim() === "clear") {
        prompt.clear();
        continue;
      } else if (src.trim() === "") {
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
  const rl = readline.createInterface(process.stdin, process.stdout);

  return {
    question: (query: string) =>
      new Promise<string>((resolve) =>
        rl.question(query, (answer) => resolve(answer))
      ),
    close: () => rl.close(),
    clear: () => {
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
    },
  };
};
