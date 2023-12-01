import Parser from "./Parser";
import configs from "./configs";
import Interpreter from "./Interpreter";
import getGlobalEnvironment from "./Interpreter/globals";
import { mkNativeFunction } from "./Interpreter/utils";
import { Value } from "./Interpreter/types";

export type LangType = "myriad" | "genz" | "nepali" | "uwu" | "pirate";

const getRunner = (type: LangType = "myriad") => {
  if (!(type in configs)) type = "myriad";

  const config = configs[type];

  const parser = new Parser(config);
  const interpreter = new Interpreter(config);
  const environment = getGlobalEnvironment(config.globalEnvConfig);

  environment.declare(
    "eval",
    mkNativeFunction(
      (args) => getRunner(type)(args[0].value, false, false) as Value
    ),
    true
  );

  return (src: string, returnEnv = false, throwError = false) => {
    try {
      const ast = parser.parse(src);
      const result = interpreter.eval(ast, environment);

      if (returnEnv) return environment;

      return result;
    } catch (error) {
      if (throwError) throw error;

      // TODO: error handle
      console.log("ERROR", error);
    }
  };
};

export const getLangTypeFromExt = (ext: string) => {
  let type = ext.slice(1, ext.length - 1);

  // if ext is .myriad then in above calculation
  // myriad will be myria, so check for that case

  if (type === "myria") type = "myriad";

  return type as LangType;
};

export { getRunner, Parser, Interpreter, getGlobalEnvironment, configs };
