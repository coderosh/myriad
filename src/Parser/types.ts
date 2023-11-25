export type NodeType =
  | "Program"
  | "EmptyStatement"
  | "BlockStatement"
  | "FunctionDeclaration"
  | "IfStatement"
  | "WhileStatement"
  | "ForStatement"
  | "BreakStatement"
  | "ContinueStatement"
  | "ReturnStatement"
  | "ThrowStatement"
  | "ImportStatement"
  | "ExportStatement"
  | "TryCatchStatement"
  | "ExpressionStatement"
  | "VariableDeclaration"
  | "AssignmentExpression"
  | "UpdateExpression"
  | "BinaryExpression"
  | "LogicalExpression"
  | "MemberExpression"
  | "CallExpression"
  | "ObjectExpression"
  | "ArrayExpression"
  | "UnaryExpression"
  | "FunctionExpression"
  | "Identifier"
  | "NumericLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "NullLiteral"
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

export interface ForStatement extends Node {
  type: "ForStatement";
  init: Node | null;
  condition: Node | null;
  update: Node | null;
  body: Node;
}

export interface BreakStatement extends Node {
  type: "BreakStatement";
}

export interface ContinueStatement extends Node {
  type: "ContinueStatement";
}

export interface ReturnStatement extends Node {
  type: "ReturnStatement";
  argument: Node | null;
}

export interface ImportStatement extends Node {
  type: "ImportStatement";
  arg: string;
  name: string;
}

export interface ExportStatement extends Node {
  type: "ExportStatement";
  args: string[];
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

export interface UpdateExpression extends Node {
  type: "UpdateExpression";
  operator: string;
  arg: Node;
  prefix: boolean;
}

export interface MemberExpression extends Node {
  type: "MemberExpression";
  object: Node;
  prop: Node;
  computed: boolean;
}

export interface FunctionExpression extends Node {
  type: "FunctionExpression";
  params: string[];
  body: Node;
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

export interface ObjectExpression extends Node {
  type: "ObjectExpression";
  value: Property[];
}

export interface ArrayExpression extends Node {
  type: "ArrayExpression";
  value: Node[];
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
  | BooleanLiteral;
