import fs from "./fs";
import math from "./math";
import json from "./json";
import array from "./array";
import number from "./number";
import string from "./string";
import runNode from "./run-node";
import dateTime from "./dateTime";
import { Value } from "../../types";

const objects: Record<string, [string, Value][]> = {
  run_node: runNode,
  __string__: string,
  __array__: array,
  __number__: number,
  math: math,
  dt: dateTime,
  json: json,
  fs: fs,
};

export default objects;
