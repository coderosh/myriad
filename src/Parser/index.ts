import ParserError from "./error";
import Tokenizer from "../Tokenizer";
import { LangConfig } from "../configs";
import { Token, TokenType } from "../Tokenizer/types";
import {
  AssignmentExpression,
  BinaryExpression,
  BlockStatement,
  BooleanLiteral,
  BreakStatement,
  ContinueStatement,
  EmptyStatement,
  ExpressionStatement,
  FunctionDeclaration,
  Identier,
  IfStatement,
  LogicalExpression,
  MemberExpression,
  Node,
  NullLiteral,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  ReturnStatement,
  StringLiteral,
  ThrowStatement,
  TryCatchStatement,
  UnaryExpression,
  VariableDeclaration,
  WhileStatement,
} from "./types";

class Parser {
  private src: string;
  private tokenizer: Tokenizer;
  private current: Token;

  private config: LangConfig;

  constructor(config: LangConfig) {
    this.src = "";
    this.tokenizer = new Tokenizer(config);
    this.current = this.tokenizer.next();

    this.config = config;
  }

  private eat(type: TokenType) {
    const token = this.current;

    if (token.type === TokenType.EOF) {
      const info = this.tokenizer.getCurrentCursorInfo();
      throw new ParserError(`Unexpected end of input`, info.line, info.column);
    }

    if (token.type !== type) {
      const info = this.tokenizer.getCurrentCursorInfo();
      throw new ParserError(
        `Unexpected token "${token.value}" Expected type "${TokenType[type]}"`,
        info.line,
        info.column
      );
    }

    this.current = this.tokenizer.next();

    return token;
  }

  parse(src: string): Program {
    this.src = src;
    this.tokenizer.init(this.src);
    this.current = this.tokenizer.next();

    return this.program();
  }

  private program(): Program {
    const program: Program = {
      type: "Program",
      body: [],
    };

    while (this.current.type !== TokenType.EOF) {
      program.body.push(this.statement());
    }

    return program;
  }

  private statement(): Node {
    switch (this.current.type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.variableStatement();
      case TokenType.Semicolon:
        return this.emptyStatement();
      case TokenType.OpenCurly:
        return this.blockStatement();
      case TokenType.Function:
        return this.functionDeclaration();
      case TokenType.If:
        return this.ifStatement();
      case TokenType.While:
        return this.whileStatement();
      case TokenType.Return:
        return this.returnStatement();
      case TokenType.Try:
        return this.tryCatchStatement();
      case TokenType.Throw:
        return this.throwStatement();
      case TokenType.Break:
        return this.breakStatement();
      case TokenType.Continue:
        return this.continueStatement();
      default:
        return this.expressionStatement();
    }
  }

  private throwStatement(): Node {
    this.eat(TokenType.Throw);
    const argument = this.expression();
    this.eat(TokenType.Semicolon);

    return {
      type: "ThrowStatement",
      argument,
    } as ThrowStatement;
  }

  private tryCatchStatement(): Node {
    this.eat(TokenType.Try);
    const body = this.blockStatement();
    this.eat(TokenType.Catch);

    this.eat(TokenType.OpenParen);
    const param = this.eat(TokenType.Identifier).value;
    this.eat(TokenType.CloseParen);

    const handler = this.blockStatement();

    return {
      type: "TryCatchStatement",
      body,
      handler,
      param: { type: "Identifier", name: param } as Identier,
    } as TryCatchStatement;
  }

  private returnStatement(): Node {
    this.eat(TokenType.Return);

    let argument: Node | null = null;

    if (this.current.type !== TokenType.Semicolon) {
      argument = this.expression();
    }

    this.eat(TokenType.Semicolon);

    return {
      type: "ReturnStatement",
      argument,
    } as ReturnStatement;
  }

  private breakStatement(): Node {
    this.eat(TokenType.Break);
    this.eat(TokenType.Semicolon);
    return { type: "BreakStatement" } as BreakStatement;
  }

  private continueStatement(): Node {
    this.eat(TokenType.Continue);
    this.eat(TokenType.Semicolon);
    return { type: "ContinueStatement" } as ContinueStatement;
  }

  private whileStatement(): Node {
    this.eat(TokenType.While);

    let hasOpeningParen = false;
    if (this.current.type === TokenType.OpenParen) {
      hasOpeningParen = true;
      this.eat(TokenType.OpenParen);
    }

    const condition = this.expression();

    if (hasOpeningParen) this.eat(TokenType.CloseParen);

    const body = this.statement();

    return {
      type: "WhileStatement",
      body,
      condition,
    } as WhileStatement;
  }

  private ifStatement(): Node {
    this.eat(TokenType.If);

    let hasOpeningParen = false;
    if (this.current.type === TokenType.OpenParen) {
      hasOpeningParen = true;
      this.eat(TokenType.OpenParen);
    }

    const condition = this.expression();

    if (hasOpeningParen) this.eat(TokenType.CloseParen);

    const body = this.statement();

    let alternate: Node | null = null;
    if (this.current.type === TokenType.Else) {
      this.eat(TokenType.Else);
      alternate = this.statement();
    }

    return {
      type: "IfStatement",
      condition,
      body,
      alternate,
    } as IfStatement;
  }

  private functionDeclaration(): Node {
    this.eat(TokenType.Function);

    const name = this.eat(TokenType.Identifier).value;

    this.eat(TokenType.OpenParen);

    let params: string[] = [];

    if (this.current.type !== TokenType.CloseParen) {
      params = this.parameterList();
    }

    this.eat(TokenType.CloseParen);

    const body = this.blockStatement();

    return {
      type: "FunctionDeclaration",
      name,
      params,
      body,
    } as FunctionDeclaration;
  }

  private parameterList(): string[] {
    let params: string[] = [];

    do {
      params.push(this.eat(TokenType.Identifier).value);
    } while (
      this.current.type === TokenType.Comma &&
      this.eat(TokenType.Comma)
    );

    return params;
  }

  private blockStatement(): Node {
    let body: Node[] = [];

    this.eat(TokenType.OpenCurly);

    while (
      this.current.type !== TokenType.EOF &&
      this.current.type !== TokenType.CloseCurly
    ) {
      body.push(this.statement());
    }

    this.eat(TokenType.CloseCurly);

    return {
      type: "BlockStatement",
      body,
    } as BlockStatement;
  }

  private emptyStatement(): Node {
    this.eat(TokenType.Semicolon);
    return {
      type: "EmptyStatement",
    } as EmptyStatement;
  }

  private variableStatement(): Node {
    let isConstant = false;
    if (this.current.type === TokenType.Const) {
      isConstant = true;
      this.eat(TokenType.Const);
    } else {
      this.eat(TokenType.Let);
    }

    const identifier = this.eat(TokenType.Identifier);

    if (this.current.type === TokenType.Semicolon && isConstant) {
      const info = this.tokenizer.getCurrentCursorInfo();
      throw new ParserError(
        `Missing initializer to const declaration`,
        info.line,
        info.column
      );
    }

    let value: Node | null = null;
    if (this.current.type !== TokenType.Semicolon) {
      this.eat(TokenType.SimpleAssignmentOperator);
      value = this.expression();
    }

    this.eat(TokenType.Semicolon);

    return {
      type: "VariableDeclaration",
      identifier: identifier.value,
      isConstant,
      value,
    } as VariableDeclaration;
  }

  private expressionStatement(): Node {
    const expression = this.expression();

    this.eat(TokenType.Semicolon);
    return {
      type: "ExpressionStatement",
      expression,
    } as ExpressionStatement;
  }

  private expression(): Node {
    return this.assignmentExpression();
  }

  private assignmentExpression(): Node {
    const left = this.logicalOrExpression();

    const isAssignmentOperator =
      this.current.type === TokenType.SimpleAssignmentOperator ||
      this.current.type === TokenType.ComplexAssignmentOperator;

    if (!isAssignmentOperator) return left;

    const isComplex = this.current.type === TokenType.ComplexAssignmentOperator;

    const operator = this.eat(this.current.type).value;

    return {
      type: "AssignmentExpression",
      left,
      right: this.assignmentExpression(),
      operator,
      isComplex,
    } as AssignmentExpression;
  }

  private logicalOrExpression(): Node {
    let left = this.logicalAndExpression();

    while (this.current.type === TokenType.LogicalOr) {
      const operator = this.eat(TokenType.LogicalOr).value;

      left = {
        type: "LogicalExpression",
        operator,
        left,
        right: this.logicalAndExpression(),
      } as LogicalExpression;
    }

    return left;
  }

  private logicalAndExpression(): Node {
    let left = this.binaryEqualityExpression();

    while (this.current.type === TokenType.LogicalAnd) {
      const operator = this.eat(TokenType.LogicalAnd).value;

      left = {
        type: "LogicalExpression",
        operator,
        left,
        right: this.binaryEqualityExpression(),
      } as LogicalExpression;
    }

    return left;
  }

  private binaryEqualityExpression(): Node {
    let left = this.binaryRelationalExpression();

    while (this.current.type === TokenType.EqualityOperator) {
      const operator = this.eat(TokenType.EqualityOperator).value;

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right: this.binaryRelationalExpression(),
      } as BinaryExpression;
    }

    return left;
  }

  private binaryRelationalExpression(): Node {
    let left = this.binaryAdditiveExpression();

    while (this.current.type === TokenType.RelationalOperator) {
      const operator = this.eat(TokenType.RelationalOperator).value;

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right: this.binaryAdditiveExpression(),
      } as BinaryExpression;
    }

    return left;
  }

  private binaryAdditiveExpression(): Node {
    let left = this.binaryMultiplicativeExpression();

    while (this.current.type === TokenType.AdditiveOperator) {
      const operator = this.eat(TokenType.AdditiveOperator).value;

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right: this.binaryMultiplicativeExpression(),
      } as BinaryExpression;
    }

    return left;
  }

  private binaryMultiplicativeExpression(): Node {
    let left = this.unaryExpression();

    while (this.current.type === TokenType.MultiplicativeOperator) {
      const operator = this.eat(TokenType.MultiplicativeOperator).value;

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right: this.unaryExpression(),
      } as BinaryExpression;
    }

    return left;
  }

  private unaryExpression(): Node {
    if (
      this.current.type === TokenType.AdditiveOperator ||
      this.current.type === TokenType.LogicalNot
    ) {
      const operator = this.eat(this.current.type).value;
      return {
        type: "UnaryExpression",
        operator,
        value: this.unaryExpression(),
      } as UnaryExpression;
    }

    return this.callMemberExpression();
  }

  private callMemberExpression(): Node {
    const member = this.memberExpression();

    if (this.current.type === TokenType.OpenParen) {
      return this.callExpression(member);
    }

    return member;
  }

  private callExpression(callee: Node) {
    let callExp = {
      type: "CallExpression",
      callee,
      args: this.arguments(),
    } as Node;

    if (this.current.type === TokenType.OpenParen) {
      callExp = this.callExpression(callExp);
    }

    if (this.current.type === TokenType.Dot) {
      callExp = this.memberExpression(callExp);
    }

    if (this.current.type === TokenType.OpenParen) {
      callExp = this.callExpression(callExp);
    }

    return callExp;
  }

  private memberExpression(obj?: Node): Node {
    obj = obj ? obj : this.primaryExpression();

    while (
      this.current.type === TokenType.Dot ||
      this.current.type === TokenType.OpenSquare
    ) {
      if (this.current.type === TokenType.Dot) {
        this.eat(TokenType.Dot);

        const identifier = this.eat(TokenType.Identifier);

        obj = {
          type: "MemberExpression",
          computed: false,
          object: obj,
          prop: { type: "Identifier", name: identifier.value } as Identier,
        } as MemberExpression;
      } else {
        this.eat(TokenType.OpenSquare);
        const prop = this.expression();
        this.eat(TokenType.CloseSquare);
        obj = {
          type: "MemberExpression",
          computed: true,
          object: obj,
          prop: prop,
        } as MemberExpression;
      }
    }

    return obj;
  }

  private arguments(): Node[] {
    this.eat(TokenType.OpenParen);

    const args: Node[] = [];

    if (this.current.type !== TokenType.CloseParen) {
      do {
        args.push(this.assignmentExpression());
      } while (
        this.current.type === TokenType.Comma &&
        this.eat(TokenType.Comma)
      );
    }

    this.eat(TokenType.CloseParen);

    return args;
  }

  private primaryExpression(): Node {
    switch (this.current.type) {
      case TokenType.Identifier:
        const ident = {
          type: "Identifier",
          name: this.eat(TokenType.Identifier).value,
        } as Identier;

        return ident;

      case TokenType.Number:
        return {
          type: "NumericLiteral",
          value: Number(this.eat(TokenType.Number).value),
        } as NumericLiteral;

      case TokenType.String:
        return {
          type: "StringLiteral",
          value: this.eat(TokenType.String).value,
        } as StringLiteral;

      case TokenType.Boolean:
        const val = this.eat(TokenType.Boolean).value;
        return {
          type: "BooleanLiteral",
          value: val === this.config.keywordConfig.true ? true : false,
        } as BooleanLiteral;

      case TokenType.Null:
        this.eat(TokenType.Null);
        return {
          type: "NullLiteral",
          value: null,
        } as NullLiteral;

      case TokenType.OpenParen:
        this.eat(TokenType.OpenParen);
        const expression = this.expression();
        this.eat(TokenType.CloseParen);
        return expression;

      case TokenType.OpenCurly:
        return this.objectLiteral();

      default:
        const info = this.tokenizer.getCurrentCursorInfo();
        throw new ParserError(
          `Unexpected primary expression`,
          info.line,
          info.column
        );
    }
  }

  private objectLiteral(): Node {
    this.eat(TokenType.OpenCurly);

    const props: Property[] = [];

    while (
      this.current.type !== TokenType.EOF &&
      this.current.type !== TokenType.CloseCurly
    ) {
      const key = this.eat(TokenType.Identifier).value;

      const nullL = { type: "NullLiteral", value: null } as NullLiteral;

      if (this.current.type === TokenType.Comma) {
        this.eat(TokenType.Comma);
        props.push({ key, type: "Property", value: nullL, shorthand: true });
        continue;
      }

      if (this.current.type === (TokenType.CloseCurly as any)) {
        props.push({ key, type: "Property", value: nullL, shorthand: true });
        continue;
      }

      this.eat(TokenType.Colon);
      const value = this.expression();

      if (this.current.type === (TokenType.Comma as any)) {
        this.eat(TokenType.Comma);
      }

      props.push({ key, value, type: "Property", shorthand: false });
    }

    this.eat(TokenType.CloseCurly);

    return { value: props, type: "ObjectLiteral" } as ObjectLiteral;
  }
}

export default Parser;
