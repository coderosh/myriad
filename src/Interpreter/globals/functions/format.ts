import { Value } from "../../types";
import { mkNull, mkString } from "../../utils";

function format(args: Value[]) {
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
}

export default format;
