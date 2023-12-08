import { ObjectValue, Value } from "../../types";
import {
  mkArray,
  mkBoolean,
  mkNativeFunction,
  mkNull,
  mkNumber,
  mkString,
} from "../../utils";

const json: [string, Value][] = [
  [
    "parse",
    mkNativeFunction((args) => {
      const arg = args[0].value;
      const obj = JSON.parse(arg);
      return parse(obj);
    }),
  ],
  [
    "stringify",
    mkNativeFunction((args) => {
      const val = stringify(args[0]);
      const space = args[1]?.value;

      return mkString(JSON.stringify(val, null, space));
    }),
  ],
];

export default json;

const parse = (obj: any): Value => {
  if (typeof obj === "string") return mkString(obj);
  if (typeof obj === "boolean") return mkBoolean(obj);

  if (typeof obj === "number") return mkNumber(obj);
  if (obj === null) return mkNull();

  if (typeof obj !== "object") return mkNull();

  if (Array.isArray(obj)) return mkArray(obj.map((el) => parse(el)));

  const map = new Map();
  for (const key in obj) {
    const val = obj[key];
    map.set(key, parse(val));
  }

  return { type: "object", value: map } as ObjectValue;
};

const stringify = (value: Value) => {
  if (
    value.type === "string" ||
    value.type === "boolean" ||
    value.type === "number" ||
    value.type === "null"
  )
    return value.value;

  if (value.type === "array")
    return value.value.map((el: Value) => stringify(el));

  if (value.type === "object") {
    const obj: Record<string, any> = {};

    for (const key of value.value.keys()) {
      obj[key] = stringify(value.value.get(key));
    }

    return obj;
  }

  return null;
};
