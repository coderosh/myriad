import { describe, expect, test } from "vitest";

import { getRunner } from "../src";
import Environment from "../src/Interpreter/Environment";
import { FunctionValue, Value } from "../src/Interpreter/types";

describe("myriad", () => {
  const run = getRunner();

  describe("(const) variable declaration should work", () => {
    test("declaration should work", () => {
      const env = run(`const username = "coderosh";`, true) as Environment;

      const val = env.variables.get("username")!;

      expect(val.type).toBe("string");
      expect(val.value).toBe("coderosh");
    });

    test("declaration without initializer should throw error", () => {
      expect(() => run(`const github;`, true, true)).toThrowError(
        /missing initializer/i
      );
    });

    test("redeclaration should throw error", () => {
      expect(() =>
        run(`const username = "coderosh";`, true, true)
      ).toThrowError();
    });

    test("assignment should throw error", () => {
      expect(() => run(`username = "coderosh";`, true, true)).toThrowError();
    });
  });

  describe("(let) variable declaration should work", () => {
    test("should work for string", () => {
      const env = run(`let name = "Myriad";`, true) as Environment;

      const val = env.variables.get("name")!;

      expect(val.type).toBe("string");
      expect(val.value).toBe("Myriad");
    });

    test("should work for number", () => {
      const env = run(`let age = 100;`, true) as Environment;

      const val = env.variables.get("age")!;

      expect(val.type).toBe("number");
      expect(val.value).toBe(100);
    });

    test("should work for boolean", () => {
      const env = run(`let isAwesome = true;`, true) as Environment;

      const val = env.variables.get("isAwesome")!;

      expect(val.type).toBe("boolean");
      expect(val.value).toBe(true);
    });

    test("should work for objects", () => {
      const env = run(
        `let data = { name: "Myriad", age };`,
        true
      ) as Environment;

      const val = env.variables.get("data")!;

      expect(val.type).toBe("object");
      expect(val.value.get("name").value).toBe("Myriad");
      expect(val.value.get("age").value).toBe(100);
    });

    test("should work for function expression", () => {
      const env = run(
        `let add = func (x, y) { return x + y; };`,
        true
      ) as Environment;

      const val = env.variables.get("add")! as FunctionValue;

      expect(val.type).toBe("function");
      expect(val.params).toEqual(["x", "y"]);

      const sum = (run(`add(4, 5);`) as Value).value;
      expect(sum).toBe(9);
    });

    test("variable should be reassignable", () => {
      expect(() => run(`name = 456; `, false, true)).not.toThrowError();
    });

    test("redeclaration of a variable should throw error", () => {
      expect(() => run(`let name = "Pirate"; `, false, true)).toThrowError();
    });
  });
});
