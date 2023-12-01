import { Value } from "../../types";
import {
  mkNativeFunction,
  mkNumber,
  mkString,
  mkNull,
  mkBoolean,
} from "../../utils";

const array: [string, Value][] = [
  ["length", mkNativeFunction((args) => mkNumber(args[0].value.length))],
  [
    "foreach",
    mkNativeFunction((args) => {
      const arr = args[0];
      const fn = args[1].value;
      const len = arr.value.length;

      for (let i = 0; i < len; i++) {
        const val = arr.value[i];
        fn([val, mkNumber(i), arr]);
      }

      return mkNull();
    }),
  ],
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
];

export default array;
