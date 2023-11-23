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
} from "../Parser/types";
import {
  Value,
  ObjectValue,
  BooleanValue,
  FunctionValue,
  NativeFunctionValue,
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
      case "ObjectLiteral":
        return this.literal(node as Literal, env);

      case "Identifier":
        return this.identifier(node as Identier, env);

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

      case "IfStatement":
        return this.ifStatement(node as IfStatement, env);

      case "WhileStatement":
        return this.whileStatement(node as WhileStatement, env);

      case "ThrowStatement":
        return this.throwStatement(node as ThrowStatement, env);

      case "ReturnStatement":
        return this.returnStatement(node as ReturnStatement, env);

      case "BreakStatement":
        return this.breakStatement();

      case "ContinueStatement":
        return this.continueStatement();
    }

    throw new Error(`"${node.type}" Not implemented yet by interpreter`);
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

  private whileStatement(node: WhileStatement, env: Environment): Value {
    let cond = this.eval(node.condition, env).value;

    while (cond) {
      try {
        this.eval(node.body, env);

        cond = this.eval(node.condition, env).value;
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
    let obj;
    if (node.object.type === "MemberExpression") {
      obj = this.memberExpression(node.object as MemberExpression, env).value;
    } else if (node.object.type === "CallExpression") {
      obj = this.callExpression(node.object as CallExpression, env).value;
    } else {
      const name = (node.object as Identier).name;
      obj = env.lookup(name).value;
    }

    const prop = node.computed
      ? this.eval(node.prop, env).value
      : (node.prop as Identier).name;

    if (typeof set !== "undefined") {
      if (obj instanceof Map) {
        obj.set(prop, set);
      } else {
        throw new Error(
          `Member property can be assigned to object only. Assigned to ${JSON.stringify(
            prop
          )}`
        );
      }
    }

    if (obj === null) {
      throw new Error(
        `Cannot read property of a null value, reading ${JSON.stringify(prop)}`
      );
    }

    if (typeof obj === "string") {
      return mkString(obj[prop]);
    }

    let val = obj.get(prop);

    if (typeof val === "undefined") {
      val = mkNull();
    }

    return val;
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
    }

    throw new Error(
      `Cannot call a value that is not a function ${JSON.stringify(fn)}`
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

      case "ObjectLiteral":
        const props = new Map();
        for (const prop of node.value) {
          const val = prop.shorthand
            ? env.lookup(prop.key)
            : this.eval(prop.value, env);

          props.set(prop.key, val);
        }

        return { type: "object", value: props } as ObjectValue;

      default:
        return mkNull();
    }
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
