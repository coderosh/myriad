import { Value } from "../../types";
import { mkNativeFunction, mkString } from "../../utils";

const number: [string, Value][] = [
  [
    "code_to_str",
    mkNativeFunction((args) => {
      const str = String.fromCharCode(args[0].value);
      return mkString(str);
    }),
  ],
];

export default number;
