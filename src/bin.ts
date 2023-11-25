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

if (hasArg("-v") || hasArg("--version")) {
  const pkg = getPkgInfo();
  console.log(`\n${pkg.name} v${pkg.version}`);
} else if (file) {
  fromFile(file);
} else {
  const pkg = getPkgInfo();
  repl("myriad", pkg.name, pkg.version);
}

function hasArg(key: string) {
  return process.argv.includes(key);
}

function getPkgInfo() {
  const pkg = require("../package.json");
  return {
    name: pkg.name.replace("@coderosh/", ""),
    version: pkg.version,
  };
}
