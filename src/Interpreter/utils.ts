import Environment from "./Environment";
import {
  ArrayValue,
  BooleanValue,
  FunctionValue,
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

export const mkNativeFunction = (
  value: (args: Value[], scope?: Environment) => Value
) => {
  return { type: "native-function", value } as NativeFunctionValue;
};

export const print = (args: Value[]): Value => {
  console.log(...args.map((arg) => getPrintValue(arg)));

  return mkIgnore();
};

const getPrintValue = (arg: Value) => {
  switch (arg.type) {
    case "string":
    case "number":
    case "boolean":
    case "null":
      return arg.value;

    case "native-function":
      return `<native-function>`;

    case "function":
      return `< ${(arg as FunctionValue).name} (${(
        arg as FunctionValue
      ).params.join(", ")}){...} >`;

    case "object":
      return getObjPrintValue(arg as ObjectValue);

    case "array":
      return getArrayPrintValue(arg as ArrayValue);

    default:
      return null;
  }
};

function getArrayPrintValue(arrValue: ArrayValue): Value[] {
  const arr: Value[] = [];
  for (const val of arrValue.value) {
    arr.push(getPrintValue(val));
  }
  return arr;
}

function getObjPrintValue(objValue: ObjectValue) {
  const mapValue = objValue.value;

  const obj: { [key: string]: Value } = {};

  for (const [k, v] of mapValue.entries()) {
    obj[k] = getPrintValue(v);
  }

  return obj;
}

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
    super(`Cannot use "break" keyword outside the loop`);
  }
}
