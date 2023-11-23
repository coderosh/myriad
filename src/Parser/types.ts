export type NodeType =
  | "Program"
  | "EmptyStatement"
  | "BlockStatement"
  | "FunctionDeclaration"
  | "IfStatement"
  | "WhileStatement"
  | "BreakStatement"
  | "ReturnStatement"
  | "ThrowStatement"
  | "TryCatchStatement"
  | "ExpressionStatement"
  | "VariableDeclaration"
  | "AssignmentExpression"
  | "BinaryExpression"
  | "LogicalExpression"
  | "MemberExpression"
  | "CallExpression"
  | "UnaryExpression"
  | "Identifier"
  | "NumericLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "NullLiteral"
  | "ObjectLiteral"
  | "Property";

export interface Node {
  type: NodeType;
}

export interface Program extends Node {
  type: "Program";
  body: Node[];
}

export interface EmptyStatement extends Node {
  type: "EmptyStatement";
}

export interface BlockStatement extends Node {
  type: "BlockStatement";
  body: Node[];
}

export interface IfStatement extends Node {
  type: "IfStatement";
  condition: Node;
  body: Node;
  alternate: Node | null;
}

export interface WhileStatement extends Node {
  type: "WhileStatement";
  condition: Node;
  body: Node;
}

export interface BreakStatement extends Node {
  type: "BreakStatement";
}

export interface ReturnStatement extends Node {
  type: "ReturnStatement";
  argument: Node | null;
}

export interface TryCatchStatement extends Node {
  type: "TryCatchStatement";
  body: Node;
  handler: Node;
  param: Identier;
}

export interface ThrowStatement extends Node {
  type: "ThrowStatement";
  argument: Node;
}

export interface FunctionDeclaration extends Node {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
  body: Node;
}

export interface ExpressionStatement extends Node {
  type: "ExpressionStatement";
  expression: Node;
}

export interface VariableDeclaration extends Node {
  type: "VariableDeclaration";
  identifier: string;
  isConstant: boolean;
  value: Node | null;
}

export interface AssignmentExpression extends Node {
  type: "AssignmentExpression";
  left: Node;
  right: Node;
  isComplex: boolean;
  operator: string;
}

export interface LogicalExpression extends Node {
  type: "LogicalExpression";
  left: Node;
  right: Node;
  operator: string;
}

export interface BinaryExpression extends Node {
  type: "BinaryExpression";
  left: Node;
  right: Node;
  operator: string;
}

export interface UnaryExpression extends Node {
  type: "UnaryExpression";
  operator: string;
  value: Node;
}

export interface CallExpression extends Node {
  type: "CallExpression";
  callee: Node;
  args: Node[];
}

export interface MemberExpression extends Node {
  type: "MemberExpression";
  object: Node;
  prop: Node;
  computed: boolean;
}

export interface Identier extends Node {
  type: "Identifier";
  name: string;
}

export interface NumericLiteral extends Node {
  type: "NumericLiteral";
  value: number;
}

export interface StringLiteral extends Node {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteral extends Node {
  type: "BooleanLiteral";
  value: boolean;
}

export interface NullLiteral extends Node {
  type: "NullLiteral";
  value: null;
}

export interface ObjectLiteral extends Node {
  type: "ObjectLiteral";
  value: Property[];
}

export interface Property extends Node {
  type: "Property";
  key: string;
  value: Node;
  shorthand: boolean;
}

export type Literal =
  | StringLiteral
  | NumericLiteral
  | NullLiteral
  | BooleanLiteral
  | ObjectLiteral;
