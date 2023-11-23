export enum TokenType {
  Comma,
  Semicolon,
  Dot,
  Colon,

  OpenParen,
  CloseParen,
  OpenCurly,
  CloseCurly,
  OpenSquare,
  CloseSquare,

  Number,
  Identifier,
  String,
  Boolean,
  Null,

  SimpleAssignmentOperator,
  ComplexAssignmentOperator,
  AdditiveOperator,
  MultiplicativeOperator,
  EqualityOperator,
  RelationalOperator,

  LogicalAnd,
  LogicalOr,
  LogicalNot,

  Let,
  Const,
  If,
  Else,
  Function,
  While,
  Return,
  EOF,
  Try,
  Catch,
  Throw,
  Break,
}

export interface Token {
  type: TokenType;
  value: string;
}
