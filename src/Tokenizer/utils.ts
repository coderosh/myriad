import { LangConfig } from "../configs";
import { TokenType } from "./types";

export const getKeywordsFromConfig = (
  keywordConfig: LangConfig["keywordConfig"]
) => {
  return {
    [keywordConfig.let]: TokenType.Let,
    [keywordConfig.const]: TokenType.Const,
    [keywordConfig.if]: TokenType.If,
    [keywordConfig.else]: TokenType.Else,
    [keywordConfig.fun]: TokenType.Function,
    [keywordConfig.true]: TokenType.Boolean,
    [keywordConfig.false]: TokenType.Boolean,
    [keywordConfig.null]: TokenType.Null,
    [keywordConfig.while]: TokenType.While,
    [keywordConfig.return]: TokenType.Return,
    [keywordConfig.try]: TokenType.Try,
    [keywordConfig.catch]: TokenType.Catch,
    [keywordConfig.throw]: TokenType.Throw,
    [keywordConfig.break]: TokenType.Break,
    [keywordConfig.continue]: TokenType.Continue,
  } as const;
};

export const getSpSymbolsFromConfig = (
  spSymbolConfig: LangConfig["spSymbolConfig"],
  bracketConfig: LangConfig["bracketConfig"],
  opConfig: LangConfig["opConfig"]
) => {
  return {
    // Specials
    [spSymbolConfig.comma]: TokenType.Comma,
    [spSymbolConfig.semiColon]: TokenType.Semicolon,
    [spSymbolConfig.colon]: TokenType.Colon,
    [spSymbolConfig.dot]: TokenType.Dot,

    // BRACKETS
    [bracketConfig.parenOpen]: TokenType.OpenParen,
    [bracketConfig.parenClose]: TokenType.CloseParen,
    [bracketConfig.curlyOpen]: TokenType.OpenCurly,
    [bracketConfig.curlyClose]: TokenType.CloseCurly,
    [bracketConfig.sqrOpen]: TokenType.OpenSquare,
    [bracketConfig.sqrClose]: TokenType.CloseSquare,

    // OPERATORS
    [opConfig.equalEqual]: TokenType.EqualityOperator,
    [opConfig.notEqual]: TokenType.EqualityOperator,

    [opConfig.equal]: TokenType.SimpleAssignmentOperator,

    [opConfig.plusEqual]: TokenType.ComplexAssignmentOperator,
    [opConfig.minusEqual]: TokenType.ComplexAssignmentOperator,
    [opConfig.mulEqual]: TokenType.ComplexAssignmentOperator,
    [opConfig.divEqual]: TokenType.ComplexAssignmentOperator,

    [opConfig.plus]: TokenType.AdditiveOperator,
    [opConfig.minus]: TokenType.AdditiveOperator,
    [opConfig.mul]: TokenType.MultiplicativeOperator,
    [opConfig.div]: TokenType.MultiplicativeOperator,

    [opConfig.andAnd]: TokenType.LogicalAnd,
    [opConfig.orOr]: TokenType.LogicalOr,
    [opConfig.not]: TokenType.LogicalNot,

    [opConfig.lessOrEqual]: TokenType.RelationalOperator,
    [opConfig.greatOrEqual]: TokenType.RelationalOperator,
    [opConfig.less]: TokenType.RelationalOperator,
    [opConfig.great]: TokenType.RelationalOperator,
  } as const;
};
