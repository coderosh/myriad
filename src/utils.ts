import c from "ansi-colors";

export const colors = {
  red: (str: string) => c.red(str),
  yellow: (str: string) => c.yellow(str),
  blue: (str: string) => c.blue(str),
  green: (str: string) => c.green(str),
  magenta: (str: string) => c.magenta(str),
  strip: (str: string) => c.strip(str),
};
