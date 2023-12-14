import format from "./format";
import input from "./input";
import print from "./print";
import type_of from "./typeof";

export type GlobalFuncConfig = {
  format: string;
  input: string;
  print: string;
  typeof: string;
};

export default function getGlobalFunctions(config: GlobalFuncConfig) {
  return {
    [config.format]: format,
    [config.input]: input,
    [config.print]: print,
    [config.typeof]: type_of,
  };
}
