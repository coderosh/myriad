import ParserError from "./error";
import Tokenizer from "../Tokenizer";
import { LangConfig } from "../configs";
import { Token, TokenType } from "../Tokenizer/types";
import {
  ArrayExpression,
  AssignmentExpression,
  BinaryExpression,
  BlockStatement,
  BooleanLiteral,
  BreakStatement,
  ContinueStatement,
  EmptyStatement,
  ExportStatement,
  ExpressionStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identier,
  IfStatement,
  ImportStatement,
  LogicalExpression,
  MemberExpression,
  Node,
  NullLiteral,
  NumericLiteral,
  ObjectExpression,
  Program,
  Property,
  ReturnStatement,
  StringLiteral,
  ThrowStatement,
  TryCatchStatement,
  UnaryExpression,
  UpdateExpression,
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

  private checkPoint() {
    const cursor = this.tokenizer.cursor;
    const current = this.current;

    return () => {
      this.current = current;
      this.tokenizer.cursor = cursor;
    };
  }

  private eat(type: TokenType) {
    const token = this.current;

    if (token.type === TokenType.EOF) {
      const info = this.tokenizer.getCurrentCursorInfo();
      throw new ParserError(
        `Unexpected end of inputm, Expected type \`${TokenType[type]}\``,
        info.line,
        info.column
      );
    }

    if (token.type !== type) {
      const info = this.tokenizer.getCurrentCursorInfo();
      throw new ParserError(
        `Unexpected token "${token.value}", Expected type "${TokenType[type]}"`,
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
        return this.blockStatementOrObjectExpression();
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
      case TokenType.Import:
        return this.importStatement();
      case TokenType.Export:
        return this.exportStatement();
      case TokenType.For:
        return this.forStatement();
      default:
        return this.expressionStatement();
    }
  }

  private forStatement(): Node {
    this.eat(TokenType.For);
    this.eat(TokenType.OpenParen);

    let init: Node | null = null;
    let condition: Node | null = null;
    let update: Node | null = null;

    if (
      this.current.type === TokenType.Let ||
      this.current.type === TokenType.Const
    ) {
      init = this.variableStatement();
    } else {
      if (this.current.type !== TokenType.Semicolon) init = this.expression();
      this.eat(TokenType.Semicolon);
    }

    if (this.current.type !== TokenType.Semicolon) {
      condition = this.expression();
    }

    this.eat(TokenType.Semicolon);

    if (this.current.type !== TokenType.CloseParen) {
      update = this.expression();
    }

    this.eat(TokenType.CloseParen);

    const body = this.statement();

    return {
      type: "ForStatement",
      body,
      condition,
      init,
      update,
    } as ForStatement;
  }

  private exportStatement(): Node {
    this.eat(TokenType.Export);

    this.eat(TokenType.OpenCurly);

    const args = this.parameterList();

    this.eat(TokenType.CloseCurly);

    this.eat(TokenType.Semicolon);

    return {
      type: "ExportStatement",
      args,
    } as ExportStatement;
  }

  private importStatement(): Node {
    this.eat(TokenType.Import);
    const arg = this.eat(TokenType.String).value;
    const name = this.eat(TokenType.Identifier).value;
    this.eat(TokenType.Semicolon);

    return {
      type: "ImportStatement",
      arg,
      name,
    } as ImportStatement;
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
    const tk = this.functionHelper(true);

    return {
      type: "FunctionDeclaration",
      name: tk.name as string,
      params: tk.params,
      body: tk.body,
    } as FunctionDeclaration;
  }

  private functionHelper(hasIdentifier: boolean) {
    this.eat(TokenType.Function);

    const name = hasIdentifier ? this.eat(TokenType.Identifier).value : null;

    this.eat(TokenType.OpenParen);

    let params: string[] = [];

    if (this.current.type !== TokenType.CloseParen) {
      params = this.parameterList();
    }

    this.eat(TokenType.CloseParen);

    const body = this.blockStatement();

    return {
      name,
      params,
      body,
    };
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

  private blockStatementOrObjectExpression() {
    const goBackToCheckPoint = this.checkPoint();

    this.eat(TokenType.OpenCurly);

    // { name, } or { name:  } is a object expression
    if (this.current.type === TokenType.Identifier) {
      this.eat(TokenType.Identifier);
      const type = this.current.type as any;
      if (
        type === TokenType.Comma ||
        type === TokenType.Colon ||
        type === TokenType.CloseCurly
      ) {
        goBackToCheckPoint();
        const objectExpression = this.objectExpression();
        this.eat(TokenType.Semicolon);
        return objectExpression;
      }
    }

    goBackToCheckPoint();
    return this.blockStatement();
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

    if (this.current.type === TokenType.AdditiveOneOperator) {
      return this.updateExpression();
    }

    return this.callMemberExpression();
  }

  private updateExpression(id?: string): Node {
    let operator: string;
    let prefix = false;

    if (typeof id === "undefined") {
      operator = this.eat(TokenType.AdditiveOneOperator).value;
      id = this.eat(TokenType.Identifier).value;
      prefix = true;
    } else {
      operator = this.eat(TokenType.AdditiveOneOperator).value;
      prefix = false;
    }

    const arg = { name: id, type: "Identifier" } as Identier;

    return {
      arg,
      prefix,
      operator,
      type: "UpdateExpression",
    } as UpdateExpression;
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

        let prop: Node;
        if (this.current.type === (TokenType as any).Number) {
          prop = {
            type: "NumericLiteral",
            value: +this.eat(TokenType.Number).value,
          } as NumericLiteral;
        } else {
          prop = {
            type: "Identifier",
            name: this.eat(TokenType.Identifier).value,
          } as Identier;
        }

        obj = {
          type: "MemberExpression",
          computed: false,
          object: obj,
          prop,
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

        if (this.current.type === (TokenType as any).AdditiveOneOperator)
          return this.updateExpression(ident.name);

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

      case TokenType.Function:
        return this.functionExpression();

      case TokenType.OpenCurly:
        return this.objectExpression();

      case TokenType.OpenSquare:
        return this.arrayExpression();

      default:
        const info = this.tokenizer.getCurrentCursorInfo();

        throw new ParserError(
          `Unexpected primary expression "${this.current.value}"`,
          info.line,
          info.column
        );
    }
  }

  private functionExpression(): Node {
    const tk = this.functionHelper(false);

    return {
      type: "FunctionExpression",
      params: tk.params,
      body: tk.body,
    } as FunctionExpression;
  }

  private arrayExpression(): Node {
    this.eat(TokenType.OpenSquare);

    const elements: Node[] = [];

    let isFirst = true;
    while (
      this.current.type !== TokenType.EOF &&
      this.current.type !== TokenType.CloseSquare
    ) {
      if (isFirst) {
        isFirst = false;
      } else {
        this.eat(TokenType.Comma);
      }

      // allow for ending , in arrays [1, 2, 3, ]
      if (this.current.type === (TokenType as any).CloseSquare) break;

      elements.push(this.expression());
    }

    this.eat(TokenType.CloseSquare);

    return { type: "ArrayExpression", value: elements } as ArrayExpression;
  }

  private objectExpression(): Node {
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

    return { value: props, type: "ObjectExpression" } as ObjectExpression;
  }
}

export default Parser;
