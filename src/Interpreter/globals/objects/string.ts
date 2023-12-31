import { Value } from "../../types";
import { mkArray, mkNativeFunction, mkNumber, mkString } from "../../utils";

const string: [string, Value][] = [
  ["length", mkNativeFunction((args) => mkNumber(args[0].value.length))],
  [
    "replace",
    mkNativeFunction((args) => {
      const searchValue = args[1].value;
      const replaceValue = args[2].value;
      return mkString(args[0].value.replace(searchValue, replaceValue));
    }),
  ],
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
  [
    "char_code",
    mkNativeFunction((args) => {
      const str: string = args[0].value;
      const index: number = args[1]?.value || 0;

      return mkNumber(str.charCodeAt(index));
    }),
  ],
];

export default string;
