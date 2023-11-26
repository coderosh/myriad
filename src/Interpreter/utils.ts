import Environment from "./Environment";
import {
  ArrayValue,
  BooleanValue,
  NativeFunctionValue,
  NullValue,
  NumberValue,
  ObjectValue,
  StringValue,
  Value,
} from "./types";

export const mkString = (value: string) => {
  return { type: "string", value } as StringValue;
};

export const mkNull = () => {
  return { type: "null", value: null } as NullValue;
};

export const mkNumber = (value: number) => {
  return { type: "number", value } as NumberValue;
};

export const mkBoolean = (value: boolean) => {
  return { type: "boolean", value } as BooleanValue;
};

export const mkIgnore = () => {
  return { type: "ignore" } as Value;
};

export const mkArray = (value: Value[]) => {
  return { type: "array", value } as ArrayValue;
};

export const mkObject = (val: [string, Value][]) => {
  const value = new Map(val);
  return { type: "object", value } as ObjectValue;
};

export const mkNativeFunction = (
  value: (args: Value[], scope?: Environment) => Value
) => {
  return { type: "native-function", value } as NativeFunctionValue;
};

export class FalseReturnError extends Error {
  constructor(public value: Value) {
    super(`Cannot use return outside the function`);
  }
}

export class FalseBreakError extends Error {
  constructor() {
    super(`Cannot use break outside the loop`);
  }
}

export class FalseContinueError extends Error {
  constructor() {
    super(`Cannot use continue outside the loop`);
  }
}
