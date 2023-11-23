import fs from "fs/promises";
import { extname } from "path";

import repl from "./repl";
import { LangType, getRunner } from "./index";

const fromFile = async (filename: string) => {
  const ext = extname(filename);

  const type = ext.slice(1, ext.length - 1) as LangType;

  const src = await fs.readFile(filename, "utf-8");
  const run = getRunner(type);

  run(src);
};

const file = process.argv[2];

if (file) {
  fromFile(file);
} else {
  repl();
}
