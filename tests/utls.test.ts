import { test, expect, describe, afterAll } from "vitest";
import { LangType, getLangTypeFromExt, getRunner } from "../src";
import { vi } from "vitest";
import print, { preserveEscapeSequence } from "../src/Interpreter/print";
import {
  mkArray,
  mkBoolean,
  mkNull,
  mkNumber,
  mkObject,
  mkString,
} from "../src/Interpreter/utils";
import { colors } from "../src/utils";
import { FunctionValue, NativeFunctionValue } from "../src/Interpreter/types";

describe("getRunner", () => {
  test("should return respective run funcion based on parameter", () => {
    const run = getRunner("genz");
    expect(() =>
      run(`lit name be "Roshan Acharya" rn`, false, true)
    ).not.toThrowError();
  });

  test("should return a myriad run function on empty parameter", () => {
    const run = getRunner();
    expect(() =>
      run(`let name = "Roshan Acharya";`, false, true)
    ).not.toThrowError();
  });

  test("should return a myriad run function on wrong parameter", () => {
    const run = getRunner("somerandomvalue" as LangType);

    expect(() =>
      run(`let name = "Roshan Acharya";`, false, true)
    ).not.toThrowError();
  });

  test("run should throw error if throwError is passed as true", () => {
    const run = getRunner();

    expect(() => run("let const;", false, true)).toThrowError();
  });

  test("run should not throw error if throwError is passed as false", () => {
    const consoleMock = vi
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    const run = getRunner();

    expect(() => run("let const;", false, false)).not.toThrowError();
    expect(consoleMock).toHaveBeenCalled();
    consoleMock.mockRestore();
  });
});

describe("getLangTypeFromExt", () => {
  test("return language type from file extension", () => {
    expect(getLangTypeFromExt(".genzl")).toBe("genz");
    expect(getLangTypeFromExt(".piratel")).toBe("pirate");
    expect(getLangTypeFromExt(".uwul")).toBe("uwu");
    expect(getLangTypeFromExt(".nepalil")).toBe("nepali");
    expect(getLangTypeFromExt(".myriad")).toBe("myriad");
  });
});

describe("print", () => {
  const consoleMock = vi
    .spyOn(console, "log")
    .mockImplementation(() => undefined);

  afterAll(() => {
    consoleMock.mockRestore();
  });

  describe("should print the values is correct color", () => {
    test("string", () => {
      print([mkString("Myriad")], true, true);
      expect(consoleMock).toHaveBeenCalledWith(colors.green("'Myriad'"));

      print([mkString("Myriad")], true, false);
      expect(consoleMock).toHaveBeenCalledWith("Myriad");
    });

    test("number", () => {
      print([mkNumber(10)]);
      expect(consoleMock).toHaveBeenCalledWith(colors.yellow(`10`));
    });

    test("boolean", () => {
      print([mkBoolean(false)]);
      expect(consoleMock).toHaveBeenCalledWith(colors.yellow(`false`));
    });

    test("null", () => {
      print([mkNull()]);
      expect(consoleMock).toHaveBeenCalledWith(colors.magenta(`null`));
    });

    test("array", () => {
      print([mkArray([mkString("Myriad"), mkNumber(10)])]);
      expect(consoleMock).toHaveBeenLastCalledWith(
        `[ ${colors.green("'Myriad'")}, ${colors.yellow("10")} ]`
      );
    });

    test("object", () => {
      print([mkObject([["name", mkString("Myriad")]])]);

      const name = colors.green("'Myriad'");

      expect(consoleMock).toHaveBeenCalledWith(`{ name: ${name} }`);

      const age = colors.yellow("100");
      const username = colors.green("'coderosh'");
      const lang = colors.yellow("true");

      print([
        mkObject([
          ["name", mkString("Myriad")],
          ["age", mkNumber(100)],
          ["username", mkString("coderosh")],
          ["lang", mkBoolean(true)],
        ]),
      ]);

      expect(consoleMock).toHaveBeenCalledWith(
        `{\n  name: ${name},\n  age: ${age},\n  username: ${username},\n  lang: ${lang}\n}`
      );
    });

    test("function", () => {
      print([
        { type: "function", name: "add", params: ["x", "y"] } as FunctionValue,
      ]);
      expect(consoleMock).toHaveBeenLastCalledWith(
        colors.blue(`[Function:add](x, y)`)
      );

      print([{ type: "function", params: ["x", "y"] } as FunctionValue]);
      expect(consoleMock).toHaveBeenLastCalledWith(
        colors.blue(`[AnonymousFunction](x, y)`)
      );
    });

    test("native function", () => {
      print([
        { type: "native-function", value: () => {} } as NativeFunctionValue,
      ]);
      expect(consoleMock).toHaveBeenLastCalledWith(
        colors.blue(`[NativeFunction]`)
      );
    });
  });

  describe("string should be printed properly", () => {
    test("should have propert quotation based on provided input", () => {
      print([mkString("Myriad'")], false, true);
      expect(consoleMock).toHaveBeenLastCalledWith(colors.green(`"Myriad'"`));
    });

    test("should have proper quotation based on provided input", () => {
      print([mkString("Myriad'\"")], false, true);
      expect(consoleMock).toHaveBeenLastCalledWith(colors.green("`Myriad'\"`"));
    });
  });
});

test("preserveEscapeSequence", () => {
  expect(preserveEscapeSequence("a\\n")).toBe("a\n");
  expect(preserveEscapeSequence("a\\t")).toBe("a\t");
  expect(preserveEscapeSequence("a\\r")).toBe("a\r");
  expect(preserveEscapeSequence("\\\\")).toBe("\\");
  expect(preserveEscapeSequence("\\'")).toBe("'");
  expect(preserveEscapeSequence('\\"')).toBe('"');
});
