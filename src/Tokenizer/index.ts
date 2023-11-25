import ParserError from "../Parser/error";
import { LangConfig } from "../configs";
import { Token, TokenType } from "./types";
import { getKeywordsFromConfig, getSpSymbolsFromConfig } from "./utils";

class Tokenizer {
  public cursor: number;

  private src: string;
  private SYMBOLS: { [key: string]: TokenType };
  private KEYWORDS: { [key: string]: TokenType };

  constructor(config: LangConfig) {
    this.src = "";
    this.cursor = 0;
    this.KEYWORDS = getKeywordsFromConfig(config.keywordConfig);
    this.SYMBOLS = getSpSymbolsFromConfig(
      config.spSymbolConfig,
      config.bracketConfig,
      config.opConfig
    );
  }

  init(src: string) {
    this.src = src;
    this.cursor = 0;
    return this;
  }

  public getCurrentCursorInfo() {
    const lines = this.src.split("\n");
    let lineNo = 0;
    let column = 0;

    let i = 0;
    for (const line of lines) {
      i += line.length + 1;

      if (this.cursor <= i) {
        column = this.cursor - (i - line.length - 1);
        break;
      }

      lineNo++;
    }

    return {
      line: lineNo + 1,
      column,
    };
  }

  private isEOF() {
    return this.cursor < this.src.length;
  }

  private token(type: TokenType, value: string): Token {
    return { type, value };
  }

  private match(str: string, regex: RegExp, inc = true) {
    const matched = str.match(regex);

    if (matched === null) return null;

    if (inc) this.cursor += matched[0].length;

    return matched[0];
  }

  private shouldSkip(str: string): boolean {
    const val =
      this.match(str, /^\s+/) ||
      this.match(str, /^\/\/.*/) ||
      this.match(str, /^\/\*[\s\S]*?\*\//);

    if (val === null) return false;

    return true;
  }

  next(): Token {
    if (!this.isEOF()) return this.token(TokenType.EOF, "EOF");

    const src = this.src.slice(this.cursor);

    if (this.shouldSkip(src)) {
      return this.next();
    }

    const token =
      this.symbols(src) ||
      this.number(src) ||
      this.keywordAndIdentifier(src) ||
      this.string(src);

    if (!token) {
      const info = this.getCurrentCursorInfo();
      throw new ParserError(
        `Unexpected token: "${src[0]}"`,
        info.line,
        info.column + 1
      );
    }

    return token;
  }

  private isAlpha(char: string) {
    const code = char.codePointAt(0)!;
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
  }

  private symbols(src: string): Token | null {
    const syms = Object.entries(this.SYMBOLS);

    for (const [symbol, type] of syms) {
      const isWord = this.isAlpha(symbol[0]);

      const srcOp = isWord
        ? this.match(src, /^\w+/, false)
        : src.slice(0, symbol.length);

      if (srcOp === symbol) {
        this.cursor += srcOp.length;
        return this.token(type, srcOp);
      }
    }

    return null;
  }

  private number(src: string): Token | null {
    const num = this.match(src, /^\d+/);
    if (!num) return null;

    return this.token(TokenType.Number, num);
  }

  private keywordAndIdentifier(src: string): Token | null {
    const ident = this.match(src, /^\w+/);

    if (ident == null) return null;

    const keyword = this.KEYWORDS[ident as keyof typeof this.KEYWORDS];

    if (keyword) return this.token(keyword, ident);

    return this.token(TokenType.Identifier, ident);
  }

  private string(src: string): Token | null {
    let str = this.match(src, /^"[^"]*"/);
    if (!str) str = this.match(src, /^'[^']*'/);
    if (!str) str = this.match(src, /^`[^`]*`/);

    if (str) return this.token(TokenType.String, str.slice(1, -1));

    return null;
  }
}

export default Tokenizer;
