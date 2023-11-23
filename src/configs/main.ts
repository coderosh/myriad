export const opConfig = {
  lessOrEqual: "<=",
  greatOrEqual: ">=",
  great: ">",
  less: "<",
  plus: "+",
  minus: "-",
  mul: "*",
  div: "/",
  equal: "=",
  equalEqual: "==",
  notEqual: "!=",
  plusEqual: "+=",
  minusEqual: "-=",
  mulEqual: "*=",
  divEqual: "/=",
  andAnd: "&&",
  orOr: "||",
  not: "!",
} as const;

export const keywordConfig = {
  let: "let",
  const: "const",
  if: "if",
  else: "else",
  fun: "func",
  true: "true",
  false: "false",
  null: "null",
  while: "while",
  return: "return",
  try: "try",
  catch: "catch",
  throw: "throw",
  break: "break",
};

export const bracketConfig = {
  sqrOpen: "[",
  sqrClose: "]",
  curlyOpen: "{",
  curlyClose: "}",
  parenOpen: "(",
  parenClose: ")",
};

export const spSymbolConfig = {
  comma: ",",
  colon: ":",
  dot: ".",
  semiColon: ";",
};

export const globalEnvConfig = {
  print: "print",
  input: "input",
  len: "len",
};
