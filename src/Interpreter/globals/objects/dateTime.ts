import { Value } from "../../types";
import { mkNativeFunction, mkNumber, mkObject } from "../../utils";

const dt: [string, Value][] = [
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
];

export default dt;
