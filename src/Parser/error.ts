export default class ParserError {
  constructor(
    public message: string,
    public line: number,
    public column: number
  ) {}
}
