import math from "./math";
import array from "./array";
import string from "./string";
import runNode from "./run-node";
import dateTime from "./dateTime";
import { NativeFunctionValue, Value } from "../../types";
import Environment from "../../Environment";
import json from "./json";

const objects: Record<string, [string, Value][]> = {
  run_node: runNode,
  __string__: string,
  __array__: array,
  math: math,
  dt: dateTime,
  json: json,
};

export default objects;
