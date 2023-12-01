import { Value } from "../../types";
import { mkNull, mkString } from "../../utils";

function input(args: Value[]) {
  const query = args[0];

  const readline = require("readline-sync");

  const result = readline.question(query.value);
  if (result == null) {
    return mkNull();
  }

  return mkString(result);
}

export default input;
