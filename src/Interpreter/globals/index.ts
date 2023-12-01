import objects from "./objects";
import functions from "./functions";
import Environment from "../Environment";
import { Value } from "../types";
import { mkNativeFunction, mkObject } from "../utils";

const getGlobalEnvironment = (globalEnvConfig: { [key: string]: any }) => {
  const globalEnvironment = new Environment();

  Object.keys(functions).map((fnName) => {
    const name = globalEnvConfig[fnName] || fnName;
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
