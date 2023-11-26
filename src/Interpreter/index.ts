import {
  Node,
  Literal,
  Program,
  Identier,
  IfStatement,
  BlockStatement,
  CallExpression,
  BinaryExpression,
  ExpressionStatement,
  FunctionDeclaration,
  LogicalExpression,
  MemberExpression,
  ReturnStatement,
  ThrowStatement,
  WhileStatement,
  UnaryExpression,
  TryCatchStatement,
  VariableDeclaration,
  AssignmentExpression,
  ObjectExpression,
  ArrayExpression,
  UpdateExpression,
  ImportStatement,
  ExportStatement,
  ForStatement,
  FunctionExpression,
} from "../Parser/types";
import {
  Value,
  ObjectValue,
  BooleanValue,
  FunctionValue,
  NativeFunctionValue,
  ArrayValue,
} from "./types";

import Environment from "./Environment";
import {
  FalseBreakError,
  FalseContinueError,
  FalseReturnError,
  mkBoolean,
  mkIgnore,
  mkNull,
  mkNumber,
  mkString,
} from "./utils";
import fs from "fs";
import path from "path";
import { LangType, getRunner } from "..";

class Interpreter {
  private config: {
    keywordConfig: { [key: string]: string };
    spSymbolConfig: { [key: string]: string };
    bracketConfig: { [key: string]: string };
    opConfig: { [key: string]: string };
  };

  constructor(config: {
    keywordConfig: { [key: string]: string };
    spSymbolConfig: { [key: string]: string };
    bracketConfig: { [key: string]: string };
    opConfig: { [key: string]: string };
  }) {
    this.config = config;
  }

  eval(node: Node, env: Environment): Value {
    switch (node.type) {
      case "NumericLiteral":
      case "StringLiteral":
      case "NullLiteral":
      case "BooleanLiteral":
        return this.literal(node as Literal, env);

      case "Identifier":
        return this.identifier(node as Identier, env);

      case "ObjectExpression":
        return this.objectExpression(node as ObjectExpression, env);

      case "ArrayExpression":
        return this.arrayExpression(node as ArrayExpression, env);

      case "BinaryExpression":
        return this.binaryExpression(node as BinaryExpression, env);

      case "Program":
        return this.program(node as Program, env);

      case "VariableDeclaration":
        return this.variableDeclaration(node as VariableDeclaration, env);

      case "AssignmentExpression":
        return this.assignmentExpression(node as AssignmentExpression, env);

      case "ExpressionStatement":
        return this.expressionStatement(node as ExpressionStatement, env);

      case "TryCatchStatement":
        return this.tryCatchStatement(node as TryCatchStatement, env);

      case "EmptyStatement":
        return mkIgnore();

      case "LogicalExpression":
        return this.logicalExpression(node as LogicalExpression, env);

      case "FunctionDeclaration":
        return this.functionDeclaration(node as FunctionDeclaration, env);

      case "BlockStatement":
        return this.blockStatement(node as BlockStatement, env);

      case "UnaryExpression":
        return this.unaryExpression(node as UnaryExpression, env);

      case "CallExpression":
        return this.callExpression(node as CallExpression, env);

      case "MemberExpression":
        return this.memberExpression(node as MemberExpression, env);

      case "UpdateExpression":
        return this.updateExpression(node as UpdateExpression, env);

      case "IfStatement":
        return this.ifStatement(node as IfStatement, env);

      case "WhileStatement":
        return this.whileStatement(node as WhileStatement, env);

      case "ForStatement":
        return this.forStatement(node as ForStatement, env);

      case "ThrowStatement":
        return this.throwStatement(node as ThrowStatement, env);

      case "ReturnStatement":
        return this.returnStatement(node as ReturnStatement, env);

      case "BreakStatement":
        return this.breakStatement();

      case "ContinueStatement":
        return this.continueStatement();

      case "ImportStatement":
        return this.importStatement(node as ImportStatement, env);

      case "ExportStatement":
        return this.exportStatement(node as ExportStatement, env);

      case "FunctionExpression":
        return this.functionExpression(node as FunctionExpression, env);
    }

    throw new Error(`"${node.type}" Not implemented yet by interpreter`);
  }

  private exportStatement(node: ExportStatement, env: Environment): Value {
    for (const arg of node.args) {
      env.export(arg);
    }

    return mkIgnore();
  }

  private resolveImportPath(p: string): string {
    const modulesPath = path.join(__dirname, "..", "..", "modules");

    const modulesList = fs
      .readdirSync(modulesPath)
      .map((p) => path.join(modulesPath, p))
      .filter((p) => !fs.statSync(p).isDirectory())
      .map((p) => path.parse(p).name);

    if (modulesList.includes(p)) {
      return path.join(modulesPath, p + ".myriad");
    }

    let fullPath = path.join(process.cwd(), p);

    if (!fs.existsSync(fullPath))
      throw new Error(`Trying to import ${fullPath} which doesn't exist`);

    if (fs.statSync(fullPath).isDirectory()) {
      fullPath = path.join(fullPath, "main.myriad");
    }

    if (!fs.existsSync(fullPath))
      throw new Error(`Trying to import ${fullPath} which doesn't exist`);

    return fullPath;
  }

  private importStatement(node: ImportStatement, env: Environment): Value {
    const fullPath = this.resolveImportPath(node.arg);

    const src = fs.readFileSync(fullPath, "utf-8");

    const ext = path.extname(fullPath);
    const type = ext.slice(1, ext.length - 1) as LangType;

    const run = getRunner(type);

    const e = run(src, true) as Environment;

    env.declare(
      node.name,
      {
        type: "object",
        value: e.findRootParent().exported,
      } as ObjectValue,
      true
    );

    return mkIgnore();
  }

  private updateExpression(node: UpdateExpression, env: Environment): Value {
    const name = (node.arg as Identier).name;

    const resolvedEnv = env.resolve(name);
    const oldVal = resolvedEnv.lookup(name);

    if (oldVal.type !== "number") {
      return mkNull();
    }

    const newVal = mkNumber(
      node.operator === "--" ? oldVal.value - 1 : oldVal.value + 1
    );

    resolvedEnv.assign(name, newVal);

    return node.prefix ? newVal : oldVal;
  }

  private returnStatement(node: ReturnStatement, env: Environment): Value {
    const arg = node.argument;

    if (arg === null) return mkNull();

    const returnValue = arg === null ? mkNull() : this.eval(arg, env);

    throw new FalseReturnError(returnValue);
  }

  private continueStatement(): Value {
    throw new FalseContinueError();
  }

  private breakStatement(): Value {
    throw new FalseBreakError();
  }

  private throwStatement(node: ThrowStatement, env: Environment): Value {
    throw this.eval(node.argument, env);
  }

  private tryCatchStatement(node: TryCatchStatement, env: Environment): Value {
    try {
      this.eval(node.body, env);
    } catch (err: unknown) {
      const e = new Environment(env);
      e.declare(
        node.param.name,
        { type: (err as Value).type, value: (err as Value).value } as Value,
        true
      );
      this.eval(node.handler, e);
    }

    return mkIgnore();
  }

  private forStatement(node: ForStatement, env: Environment): Value {
    const e = new Environment(env);

    if (node.init) this.eval(node.init, e);

    while (true) {
      try {
        const scope = new Environment(e);

        const cond = node.condition
          ? this.eval(node.condition, scope).value
          : true;

        if (!cond) break;

        this.eval(node.body, scope);

        if (node.update) this.eval(node.update, scope);
      } catch (err) {
        if (err instanceof FalseBreakError) break;
        if (err instanceof FalseContinueError) continue;

        throw err;
      }
    }

    return mkIgnore();
  }

  private whileStatement(node: WhileStatement, env: Environment): Value {
    while (true) {
      try {
        let scope = new Environment(env);

        const cond = this.eval(node.condition, scope).value;
        if (!cond) break;

        this.eval(node.body, scope);
      } catch (err) {
        if (err instanceof FalseBreakError) break;
        if (err instanceof FalseContinueError) continue;

        throw err;
      }
    }

    return mkIgnore();
  }

  private ifStatement(node: IfStatement, env: Environment): Value {
    const cond = this.eval(node.condition, env).value;

    if (cond) {
      this.eval(node.body, env);
    } else if (node.alternate !== null) {
      this.eval(node.alternate as Node, env);
    }

    return mkIgnore();
  }

  private memberExpression(
    node: MemberExpression,
    env: Environment,
    set?: Value
  ): Value {
    let value: Value;
    if (node.object.type === "MemberExpression") {
      value = this.memberExpression(node.object as MemberExpression, env);
    } else if (node.object.type === "CallExpression") {
      value = this.callExpression(node.object as CallExpression, env);
    } else if (node.object.type === "Identifier") {
      const name = (node.object as Identier).name;
      value = env.lookup(name);
    } else {
      value = this.eval(node.object, env);
    }

    const prop =
      node.computed || node.prop.type === "NumericLiteral"
        ? this.eval(node.prop, env).value
        : (node.prop as Identier).name;

    if (typeof set !== "undefined") {
      if (value.type === "object") {
        value.value.set(prop, set);
      } else if (value.type === "array" && typeof prop === "number") {
        value.value[prop] = set;
      } else {
        throw new Error(
          `Member property can be assigned to object only. Assigned to ${JSON.stringify(
            prop
          )}`
        );
      }
    }

    if (value.value === null) {
      throw new Error(
        `Cannot read property of a null value, reading ${JSON.stringify(prop)}`
      );
    }

    if (value.type === "array" && typeof prop === "number") {
      const val = value.value[prop];

      if (val) return val;
      return mkNull();
    }

    if (value.type === "string" && typeof prop === "number") {
      const val = value.value[prop];

      if (val) return mkString(val);
      return mkNull();
    }

    if (value.type === "object") {
      let val = value.value.get(prop);

      if (typeof val === "undefined") {
        val = mkNull();
      }

      return val;
    }

    if (value.type === "string" || value.type === "array") {
      const obj = env.lookup(`__${value.type}__`).value;

      if (obj.has(prop)) {
        const val: Value = obj.get(prop).value([value]);
        return val;
      }
    }

    throw new Error(
      `Cannot read the property "${prop}" of type "${value.type}"`
    );
  }

  private callExpression(node: CallExpression, env: Environment): Value {
    const args = node.args.map((arg) => this.eval(arg, env));

    const fn = this.eval(node.callee, env);

    try {
      if (fn.type === "native-function") {
        return (fn as NativeFunctionValue).value(args, env);
      }

      if (fn.type === "function") {
        const func = fn as FunctionValue;
        const env = new Environment(func.env);

        for (let i = 0; i < func.params.length; i++) {
          const name = func.params[i];
          let value = args[i];

          if (typeof value === "undefined") value = mkNull();

          env.declare(name, value, false);
        }

        return this.eval(func.body, env);
      }
    } catch (err) {
      if (err instanceof FalseReturnError) {
        return err.value;
      }

      throw err;
    }

    throw new Error(
      `Cannot call a value that is not a function ${JSON.stringify(
        fn,
        null,
        2
      )}`
    );
  }

  private unaryExpression(node: UnaryExpression, env: Environment): Value {
    const value = (this.eval(node.value, env) as any).value;

    if (node.operator === this.config.opConfig.plus) {
      const num = Number(value);

      if (Number.isNaN(num)) {
        return mkNull();
      } else {
        return mkNumber(num);
      }
    }

    if (node.operator === this.config.opConfig.not) return mkBoolean(!value);

    throw new Error(
      `unaryExpression method for operator ${node.operator} not implemented.`
    );
  }

  private blockStatement(node: BlockStatement, env: Environment): Value {
    let lastValue: Value = mkNull();

    for (const statement of node.body) {
      lastValue = this.eval(statement, env);
    }

    return lastValue;
  }

  private functionDeclaration(
    node: FunctionDeclaration,
    env: Environment
  ): Value {
    const fn = {
      type: "function",
      name: node.name,
      body: node.body,
      params: node.params,
      env: env,
    } as FunctionValue;

    env.declare(node.name, fn, true);

    return fn;
  }

  private expressionStatement(
    node: ExpressionStatement,
    env: Environment
  ): Value {
    return this.eval(node.expression, env);
  }

  private assignmentExpression(
    node: AssignmentExpression,
    env: Environment
  ): Value {
    if (
      node.left.type !== "Identifier" &&
      node.left.type !== "MemberExpression"
    )
      throw `Invalid assignment ${JSON.stringify(node.left)}`;

    if (node.left.type === "MemberExpression") {
      return this.memberExpression(
        node.left as MemberExpression,
        env,
        this.eval(node.right, env)
      );
    }

    const name = (node.left as Identier).name;
    let value: Value;

    if (node.isComplex) {
      const operator =
        node.operator === this.config.opConfig.plusEqual
          ? this.config.opConfig.plus
          : node.operator === this.config.opConfig.minusEqual
          ? this.config.opConfig.minus
          : node.operator === this.config.opConfig.mulEqual
          ? this.config.opConfig.mul
          : this.config.opConfig.div;

      value = this.binaryExpression(
        {
          ...node,
          type: "BinaryExpression",
          operator,
        },
        env
      );
    } else {
      value = this.eval(node.right, env);
    }

    return env.assign(name, value);
  }

  private variableDeclaration(
    node: VariableDeclaration,
    env: Environment
  ): Value {
    let value: Value = mkNull();

    if (node.value) {
      value = this.eval(node.value, env);
    }

    return env.declare(node.identifier, value, node.isConstant);
  }

  private program(node: Program, env: Environment): Value {
    let lastValue: Value = mkNull();

    for (const statement of node.body) {
      lastValue = this.eval(statement, env);
    }

    return lastValue;
  }

  private identifier(node: Identier, env: Environment): Value {
    return env.lookup(node.name);
  }

  private literal(node: Literal, env: Environment): Value {
    switch (node.type) {
      case "StringLiteral":
        return mkString(node.value);

      case "NumericLiteral":
        return mkNumber(node.value);

      case "BooleanLiteral":
        return mkBoolean(node.value);

      default:
        return mkNull();
    }
  }

  private functionExpression(node: FunctionExpression, env: Environment) {
    const fn = {
      type: "function",
      name: "",
      body: node.body,
      params: node.params,
      env: env,
    } as FunctionValue;

    return fn;
  }

  private arrayExpression(node: ArrayExpression, env: Environment) {
    const values = [];

    for (const value of node.value) {
      values.push(this.eval(value, env));
    }

    return { type: "array", value: values } as ArrayValue;
  }

  private objectExpression(node: ObjectExpression, env: Environment) {
    const props = new Map();
    for (const prop of node.value) {
      const val = prop.shorthand
        ? env.lookup(prop.key)
        : this.eval(prop.value, env);

      props.set(prop.key, val);
    }

    return { type: "object", value: props } as ObjectValue;
  }

  private logicalExpression(node: LogicalExpression, env: Environment): Value {
    const lhs = this.eval(node.left, env) as BooleanValue;
    const rhs = this.eval(node.right, env) as BooleanValue;

    let result = undefined;
    if (node.operator === this.config.opConfig.andAnd)
      result = lhs.value && rhs.value;
    if (node.operator === this.config.opConfig.orOr)
      result = lhs.value || rhs.value;

    if (typeof result === "undefined") {
      return mkNull();
    }

    return mkBoolean(Boolean(result));
  }

  private binaryExpression(node: BinaryExpression, env: Environment): Value {
    const lhs = this.eval(node.left, env);
    const rhs = this.eval(node.right, env);

    switch (node.operator) {
      case this.config.opConfig.equalEqual:
      case this.config.opConfig.notEqual:
      case this.config.opConfig.lessOrEqual:
      case this.config.opConfig.greatOrEqual:
      case this.config.opConfig.less:
      case this.config.opConfig.great:
        return this.comparisionBinaryExpression(lhs, rhs, node.operator);

      case this.config.opConfig.plus:
      case this.config.opConfig.minus:
      case this.config.opConfig.mul:
      case this.config.opConfig.div:
        return this.calculationBinaryExpression(lhs, rhs, node.operator);

      default:
        throw new Error(
          `Binary operator "${node.operator}" is not implemented`
        );
    }
  }

  private comparisionBinaryExpression(
    lhs: Value,
    rhs: Value,
    operator: string
  ) {
    let value: boolean | undefined = undefined;

    if (operator === this.config.opConfig.equalEqual)
      value = lhs.value === rhs.value;
    else if (operator === this.config.opConfig.notEqual)
      value = lhs.value !== rhs.value;
    else if (operator === this.config.opConfig.lessOrEqual)
      value = lhs.value <= rhs.value;
    else if (operator === this.config.opConfig.greatOrEqual)
      value = lhs.value >= rhs.value;
    else if (operator === this.config.opConfig.great)
      value = lhs.value > rhs.value;
    else if (operator === this.config.opConfig.less)
      value = lhs.value < rhs.value;

    if (typeof value !== "boolean") {
      return mkNull();
    }

    return { type: "boolean", value } as BooleanValue;
  }

  private calculationBinaryExpression(
    lhs: Value,
    rhs: Value,
    operator: string
  ): Value {
    if (typeof lhs.value === "string" && typeof rhs.value === "string") {
      let value: string | undefined = undefined;

      if (operator === this.config.opConfig.plus)
        value = `${lhs.value}${rhs.value}`;

      if (typeof value === "undefined") return mkNull();

      return mkString(value);
    }

    if (typeof lhs.value === "number" && typeof rhs.value === "number") {
      let value: undefined | number = undefined;

      if (operator === this.config.opConfig.plus) value = lhs.value + rhs.value;
      else if (operator === this.config.opConfig.minus)
        value = lhs.value - rhs.value;
      else if (operator === this.config.opConfig.mul)
        value = lhs.value * rhs.value;
      else if (operator === this.config.opConfig.div)
        value = lhs.value / rhs.value;

      if (typeof value === "undefined") return mkNull();

      return mkNumber(value);
    }

    return mkNull();
  }
}

export default Interpreter;
