import { Value } from "../../types";
import { mkNativeFunction, mkNumber } from "../../utils";

const math: [string, Value][] = [
  ["rand", mkNativeFunction(() => mkNumber(Math.random()))],
  ["abs", mkNativeFunction((args) => mkNumber(Math.abs(args[0].value)))],
  ["ceil", mkNativeFunction((args) => mkNumber(Math.ceil(args[0].value)))],
  ["floor", mkNativeFunction((args) => mkNumber(Math.floor(args[0].value)))],
  ["round", mkNativeFunction((args) => mkNumber(Math.round(args[0].value)))],
  ["cos", mkNativeFunction((args) => mkNumber(Math.cos(args[0].value)))],
  ["sin", mkNativeFunction((args) => mkNumber(Math.sin(args[0].value)))],
  ["tan", mkNativeFunction((args) => mkNumber(Math.tan(args[0].value)))],
  ["pi", mkNumber(Math.PI)],
];

export default math;
