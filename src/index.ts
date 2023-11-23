import Parser from "./Parser";
import Interpreter from "./Interpreter";
import getGlobalEnvironment from "./Interpreter/globalEnv";

import configs from "./configs";

export type LangType = "main" | "genz" | "nepali";

const getRunner = (type: LangType = "main") => {
  if (!(type in configs)) type = "main";

  const config = configs[type];

  const parser = new Parser(config);
  const interpreter = new Interpreter(config);
  const environment = getGlobalEnvironment(config.globalEnvConfig);

  return (src: string) => {
    try {
      const ast = parser.parse(src);
      return interpreter.eval(ast, environment);
    } catch (error) {
      // TODO: error handle
      console.log("ERROR", error);
    }
  };
};

export { getRunner, Parser, Interpreter, getGlobalEnvironment, configs };
