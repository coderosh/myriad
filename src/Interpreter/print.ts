import { colors } from "../utils";
import {
  ArrayValue,
  BooleanValue,
  FunctionValue,
  NativeFunctionValue,
  NumberValue,
  ObjectValue,
  StringValue,
  Value,
} from "./types";
import { mkIgnore } from "./utils";

const print = (
  args: Value[],
  printEscapeSequence = true,
  printDecoratedString = false
): Value => {
  let values = args.map((arg) => getPrintValue(arg, printDecoratedString));

  if (printEscapeSequence)
    values = values.map((val) => preserveEscapeSequence(`${val}`));

  console.log(...values);

  return mkIgnore();
};

const getPrintValue = (arg: Value, printDecoratedString = false) => {
  switch (arg.type) {
    case "string":
      return getStringPrintValue(arg as StringValue, printDecoratedString);

    case "number":
      return getNumberPrintValue(arg as NumberValue);

    case "boolean":
      return getBooleanPrintValue(arg as BooleanValue);

    case "null":
      return getNullPrintValue();

    case "native-function":
      return getNativeFunctionPrintValue(arg as NativeFunctionValue);

    case "function":
      return getFunctionPrintValue(arg as FunctionValue);

    case "object":
      return getObjPrintValue(arg as ObjectValue);

    case "array":
      return getArrayPrintValue(arg as ArrayValue);

    default:
      return null;
  }
};

function getNullPrintValue(): string {
  return colors.magenta(`null`);
}

function getBooleanPrintValue(boolValue: BooleanValue): string {
  return colors.yellow(`${boolValue.value}`);
}

function getNumberPrintValue(numValue: NumberValue): string {
  return colors.yellow(`${numValue.value}`);
}

function getStringPrintValue(
  strValue: StringValue,
  printDecoratedString: boolean
): string {
  const val = strValue.value;

  if (!printDecoratedString) return val;

  const quote = !val.includes("'") ? "'" : !val.includes('"') ? '"' : "`";
  return colors.green(`${quote}${val}${quote}`);
}

function getNativeFunctionPrintValue(fn: NativeFunctionValue): string {
  return colors.blue(`[NativeFunction]`);
}

function getFunctionPrintValue(funcValue: FunctionValue): string {
  const name = funcValue.name;
  const params = funcValue.params.join(", ");
  if (!name) return colors.blue(`[AnonymousFunction](${params})`);

  return colors.blue(`[Function](${params})`);
}

function getArrayPrintValue(arrValue: ArrayValue): string {
  let str = `[ `;

  for (const val of arrValue.value) {
    if (str !== "[ ") str += ", ";

    str += getPrintValue(val, true);
  }

  str += " ]";

  return str;
}

function getObjPrintValue(objValue: ObjectValue) {
  const mapValue = objValue.value;

  const newLine = mapValue.size > 3;

  let str = "{";

  for (const [k, v] of mapValue.entries()) {
    if (str !== "{") str += `,`;

    str += newLine ? `\n  ` : " ";

    str += `${k}: ${getPrintValue(v, true)}`;
  }

  str += newLine ? "\n" : " ";

  str += `}`;

  return str;
}

function preserveEscapeSequence(s: string) {
  return s.replace(/\\([\\rnt'"])/g, function (_, a) {
    if (a === "n") return "\n";
    if (a === "t") return "\t";
    if (a === "r") return "\r";
    if (a === "\\") return "\\";
    return a;
  });
}

export default print;
