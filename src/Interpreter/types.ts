import Interpreter from ".";
import { Node } from "../Parser/types";
import type Environment from "./Environment";

export type ValueType =
  | "number"
  | "string"
  | "null"
  | "boolean"
  | "object"
  | "function"
  | "native-function"
  | "ignore"
  | "array";

export interface Value {
  type: ValueType;
  value: any;
}

export interface NullValue extends Value {
  type: "null";
  value: null;
}

export interface NumberValue extends Value {
  type: "number";
  value: number;
}

export interface StringValue extends Value {
  type: "string";
  value: string;
}

export interface BooleanValue extends Value {
  type: "boolean";
  value: boolean;
}

export interface ObjectValue extends Value {
  type: "object";
  value: Map<string, Value>;
}

export interface ArrayValue extends Value {
  type: "array";
  value: Value[];
}

export interface FunctionValue extends Value {
  type: "function";
  name: string;
  params: string[];
  env: Environment;
  body: Node;
  _i: Interpreter;
}

export interface NativeFunctionValue extends Value {
  type: "native-function";
  value: Function;
}
