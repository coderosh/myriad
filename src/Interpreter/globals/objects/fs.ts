import fs from "fs";
import path from "path";
import { Value } from "../../types";
import {
  mkArray,
  mkBoolean,
  mkNativeFunction,
  mkNull,
  mkNumber,
  mkObject,
  mkString,
} from "../../utils";

const fileSystem: [string, Value][] = [
  [
    "read",
    mkNativeFunction((args) => {
      const p = args[0].value;
      const filePath = path.join(process.cwd(), p);
      const value = fs.readFileSync(filePath, "utf-8");
      return mkString(value);
    }),
  ],
  [
    "write",
    mkNativeFunction((args) => {
      const p = args[0].value;
      const data = args[1].value;

      const filePath = path.join(process.cwd(), p);
      fs.writeFileSync(filePath, data);

      return mkNull();
    }),
  ],
  [
    "rmrf",
    mkNativeFunction((args) => {
      const p = args[0].value;
      const filePath = path.join(process.cwd(), p);

      fs.rmSync(filePath, { recursive: true, force: true });

      return mkNull();
    }),
  ],
  [
    "mkdir",
    mkNativeFunction((args) => {
      const p = args[0].value;
      const filePath = path.join(process.cwd(), p);

      fs.mkdirSync(filePath, { recursive: true });
      return mkNull();
    }),
  ],
  [
    "readdir",
    mkNativeFunction((args) => {
      const p = args[0].value;

      const recursive: boolean = args[1]?.value || false;

      const filePath = path.join(process.cwd(), p);

      const lists = fs.readdirSync(filePath, { recursive }) as string[];
      return mkArray(lists.map((el) => mkString(el)));
    }),
  ],
  [
    "stat",
    mkNativeFunction((args) => {
      const p = args[0].value;
      const filePath = path.join(process.cwd(), p);

      const stats = fs.statSync(filePath);

      return mkObject([
        [
          "is_directory",
          mkNativeFunction(() => mkBoolean(stats.isDirectory())),
        ],
        ["is_file", mkNativeFunction(() => mkBoolean(stats.isFile()))],
        ["size", mkNumber(stats.size)],
        ["size", mkNumber(stats.size)],
        ["atime", mkNumber(stats.atimeMs)],
        ["ctime", mkNumber(stats.ctimeMs)],
        ["mtime", mkNumber(stats.mtimeMs)],
        ["birthtime", mkNumber(stats.birthtimeMs)],
        ["inode", mkNumber(stats.ino)],
        ["mode", mkNumber(stats.mode)],
        ["uid", mkNumber(stats.uid)],
      ]);
    }),
  ],
];
export default fileSystem;
