import objects from "./objects";
import { Value } from "../types";
import Environment from "../Environment";
import getGlobalFunctions, { GlobalFuncConfig } from "./functions";
import { mkNativeFunction, mkObject } from "../utils";

interface GlobalEnvConfig extends GlobalFuncConfig {
  [key: string]: any;
}

const getGlobalEnvironment = (globalEnvConfig: GlobalEnvConfig) => {
  const globalEnvironment = new Environment();

  const functions = getGlobalFunctions(globalEnvConfig);

  Object.keys(functions).map((fnName) => {
    const name = fnName;
    const fn = functions[fnName as keyof typeof functions];

    globalEnvironment.declare(
      name,
      mkNativeFunction((args) => fn(args)),
      true
    );
  });

  Object.keys(objects).map((key) => {
    const name = globalEnvConfig[key] || key;
    const obj = objects[key as keyof typeof objects] as [string, Value][];

    globalEnvironment.declare(name, mkObject(obj), true);
  });

  return globalEnvironment;
};

export default getGlobalEnvironment;
