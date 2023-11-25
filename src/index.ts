import Parser from "./Parser";
import configs from "./configs";
import Interpreter from "./Interpreter";
import getGlobalEnvironment from "./Interpreter/globalEnv";

export type LangType = "myriad" | "genz" | "nepali" | "uwu" | "pirate";

const getRunner = (type: LangType = "myriad") => {
  if (!(type in configs)) type = "myriad";

  const config = configs[type];

  const parser = new Parser(config);
  const interpreter = new Interpreter(config);
  const environment = getGlobalEnvironment(config.globalEnvConfig);

  return (src: string, returnEnv = false) => {
    try {
      const ast = parser.parse(src);
      const result = interpreter.eval(ast, environment);

      if (returnEnv) return environment;

      return result;
    } catch (error) {
      // TODO: error handle
      console.log("ERROR", error);
    }
  };
};

export { getRunner, Parser, Interpreter, getGlobalEnvironment, configs };
