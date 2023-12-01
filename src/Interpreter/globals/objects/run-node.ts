import vm from "vm";
import path from "path";
import { Value } from "../../types";
import { mkNativeFunction, mkNull, mkNumber, mkString } from "../../utils";

const runNode: [string, Value][] = [
  [
    "run",
    mkNativeFunction((args) => {
      const code = String(args[0].value);
      const result = vm.runInNewContext(
        code,
        { require: require },
        { filename: path.join(process.cwd(), "index.js") }
      );

      if (typeof result === "undefined" || result === null) return mkNull();

      if (typeof result === "string") return mkString(result);

      if (typeof result === "number") return mkNumber(result);

      return mkString(JSON.stringify(result));
    }),
  ],
];

export default runNode;
