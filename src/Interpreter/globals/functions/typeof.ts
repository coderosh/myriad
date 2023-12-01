import { Value } from "../../types";
import { mkString } from "../../utils";

function type_of(args: Value[]) {
  return mkString(args[0].type);
}

export default type_of;
