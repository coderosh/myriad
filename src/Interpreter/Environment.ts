import { Value } from "./types";

class Environment {
  private parent: Environment | null;
  private variables: Map<string, Value>;
  private constants: Set<string>;

  public exported: Map<string, Value>;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
    this.variables = new Map<string, Value>();
    this.exported = new Map<string, Value>();
    this.constants = new Set<string>();
  }

  public export(name: string): Value {
    const parent = this.findRootParent();
    const val = parent.lookup(name);
    parent.exported.set(name, val);
    return val;
  }

  public declare(name: string, val: Value, isConstant: boolean): Value {
    if (this.variables.has(name)) {
      throw new Error(
        `Cannot declare variable "${name}". It is already defined`
      );
    }

    if (isConstant) {
      this.constants.add(name);
    }

    this.variables.set(name, val);

    return val;
  }

  public assign(name: string, value: Value): Value {
    const env = this.resolve(name);
    if (env.constants.has(name)) {
      throw new Error(`Cannot assign to a constant variable "${name}"`);
    }

    env.variables.set(name, value);
    return value;
  }

  public lookup(name: string): Value {
    const env = this.resolve(name);
    return env.variables.get(name)!;
  }

  public resolve(name: string): Environment {
    if (this.variables.has(name)) return this;

    if (this.parent === null) {
      throw new Error(`Variable \`${name}\` is not defined.`);
    }

    return this.parent.resolve(name);
  }

  public findRootParent(): Environment {
    if (this.parent === null) return this;
    return this.parent.findRootParent();
  }
}

export default Environment;
