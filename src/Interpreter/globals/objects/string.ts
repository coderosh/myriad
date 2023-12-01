import { Value } from "../../types";
import { mkArray, mkNativeFunction, mkNumber, mkString } from "../../utils";

const string: [string, Value][] = [
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
];

export default string;
