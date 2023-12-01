import print from "./print";
import Environment from "./Environment";
import { Value } from "./types";
import {
  mkArray,
  mkBoolean,
  mkNativeFunction,
  mkNull,
  mkNumber,
  mkObject,
  mkString,
} from "./utils";

const functions = {
  print: (args: Value[]) => {
    return print(args);
  },
  len: (args: Value[]): Value => {
    const arg = args[0];
    if (arg.type === "string" || arg.type === "array")
      return mkNumber(arg.value.length);
    return mkNull();
  },
  input: (args: Value[]): Value => {
    const query = args[0];

    const readline = require("readline-sync");

    const result = readline.question(query.value);
    if (result == null) {
      return mkNull();
    }

    return mkString(result);
  },
  format: (args: Value[]): Value => {
    if (args[0].type !== "string") return mkNull();

    const str: string = args[0].value;

    let i = 0;

    const formatted = str.replace(/\\?{}/gs, (match: string, index: number) => {
      if (match[0] === "\\" && str[index - 1] !== "\\") {
        return match.slice(1);
      }

      const val = args[++i];
      if (typeof val === "undefined") return ` <${i}th parameter expected> `;

      return val.value;
    });

    return mkString(formatted);
  },
};

const objects = {
  __string__: [
    ["length", mkNativeFunction((args) => mkNumber(args[0].value.length))],
    [
      "uppercase",
      mkNativeFunction((args) => mkString(args[0].value.toUpperCase())),
    ],
    [
      "lowercase",
      mkNativeFunction((args) => mkString(args[0].value.toLowerCase())),
    ],
    [
      "split",
      mkNativeFunction((args) => {
        const str: string = args[0].value;
        const spChar: string = args[1]?.value || "";

        const arr = str.split(spChar);

        return mkArray(arr.map((el) => mkString(el)));
      }),
    ],
  ],
  __array__: [
    ["length", mkNativeFunction((args) => mkNumber(args[0].value.length))],
    [
      "join",
      mkNativeFunction((args) => {
        const arr: Value[] = args[0].value;
        const sep: string = args[1]?.value || ",";

        const str = arr.map((el) => el.value).join(sep);
        return mkString(str);
      }),
    ],
    [
      "pop",
      mkNativeFunction((args) => {
        const arr: Value[] = args[0].value;

        const value = arr.pop();
        if (value) return value;

        return mkNull();
      }),
    ],
    [
      "push",
      mkNativeFunction((args) => {
        const arr: Value[] = args[0].value;
        const newValue: Value = args[1];

        arr.push(newValue);

        return mkNumber(arr.length);
      }),
    ],
    [
      "includes",
      mkNativeFunction((args) => {
        const arr: Value[] = args[0].value;
        const value = args[1].value;

        for (const el of arr) {
          if (el.value === value) return mkBoolean(true);
        }

        return mkBoolean(false);
      }),
    ],
  ],
  math: [
    ["rand", mkNativeFunction(() => mkNumber(Math.random()))],
    ["abs", mkNativeFunction((args) => mkNumber(Math.abs(args[0].value)))],
    ["ceil", mkNativeFunction((args) => mkNumber(Math.ceil(args[0].value)))],
    ["floor", mkNativeFunction((args) => mkNumber(Math.floor(args[0].value)))],
    ["round", mkNativeFunction((args) => mkNumber(Math.round(args[0].value)))],
    ["cos", mkNativeFunction((args) => mkNumber(Math.cos(args[0].value)))],
    ["sin", mkNativeFunction((args) => mkNumber(Math.sin(args[0].value)))],
    ["tan", mkNativeFunction((args) => mkNumber(Math.tan(args[0].value)))],
    ["pi", mkNumber(Math.PI)],
  ],
  dt: [
    ["now", mkNativeFunction(() => mkNumber(Date.now()))],
    [
      "date",
      mkNativeFunction((args) => {
        const date = args[0] ? new Date(args[0].value) : new Date();

        return mkObject([
          ["date", mkNativeFunction(() => mkNumber(date.getDate()))],
          ["year", mkNativeFunction(() => mkNumber(date.getFullYear()))],
          ["month", mkNativeFunction(() => mkNumber(date.getMonth()))],
        ]);
      }),
    ],
  ],
};

const getGlobalEnvironment = (globalEnvConfig: { [key: string]: any }) => {
  const globalEnvironment = new Environment();

  Object.keys(functions).map((fnName) => {
    const name = globalEnvConfig[fnName] || fnName;
    const fn = functions[fnName as keyof typeof functions];

    globalEnvironment.declare(
      name,
      mkNativeFunction((args) => fn(args)),
      true
    );
  });

  Object.keys(objects).map((key) => {
    const name = globalEnvConfig[key] || key;
    const obj = objects[key as keyof typeof objects] as [string, Value][];

    globalEnvironment.declare(name, mkObject(obj), true);
  });

  return globalEnvironment;
};

export default getGlobalEnvironment;
