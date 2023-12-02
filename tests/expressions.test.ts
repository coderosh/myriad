import { describe, expect, test } from "vitest";

import { getRunner } from "../src";
import { Value } from "../src/Interpreter/types";
import Environment from "../src/Interpreter/Environment";

describe("myriad", () => {
  const run = getRunner();

  test("member expression should work", () => {
    let result = run(
      `let obj = { name: "Myriad", age: 100 }; obj.name;`
    ) as Value;
    expect(result.value).toBe("Myriad");

    result = run(`obj["name"];`) as Value;
    expect(result.value).toBe("Myriad");

    result = run(`obj["a" + "g" + "e"];`) as Value;
    expect(result.value).toBe(100);
  });

  test("member expression assignment should work", () => {
    expect(() => run(`obj.age = 200;`, false, true)).not.toThrowError();
    expect((run("obj.age;") as Value).value).toBe(200);
  });

  test("array expressions should work", () => {
    const result = run(`[1, 2, 3];`) as Value;
    expect(result.value.map((a: Value) => a.value)).toEqual([1, 2, 3]);
  });

  test("array expressions assignment should work", () => {
    const result = run(
      `let arr = [1, 2, 3]; arr[0] = 20;`,
      true,
      true
    ) as Environment;

    expect(
      result.variables.get("arr")?.value.map((a: Value) => a.value)
    ).toEqual([20, 2, 3]);
  });

  test("object expressions should work", () => {
    const result = run(`{ name: "Myriad", age: 100 };`) as Value;

    expect(result.value.get("name").value).toBe("Myriad");
    expect(result.value.get("age").value).toBe(100);
  });

  test("binary additive/multiplicative expressions should work", () => {
    const result = run("5 + 3 * 12 / 6;") as Value;
    expect(result.value).toBe(11);
  });

  test("binary comparison expressions should work", () => {
    let result = run("2 == 3;") as Value;
    expect(result.value).toBe(false);

    result = run("2 != 3;") as Value;
    expect(result.value).toBe(true);

    result = run("2 > 2;") as Value;
    expect(result.value).toBe(false);

    result = run("2 < 3;") as Value;
    expect(result.value).toBe(true);

    result = run("2 >= 2;") as Value;
    expect(result.value).toBe(true);

    result = run("2 <= 2;") as Value;
    expect(result.value).toBe(true);
  });

  test("logical expressions should work", () => {
    let result = run("false || true;") as Value;
    expect(result.value).toBe(true);

    result = run("false || false;") as Value;
    expect(result.value).toBe(false);

    result = run("true && false;") as Value;
    expect(result.value).toBe(false);
  });

  test("string concatenation should work", () => {
    const result = run(`"My" + "riad";`) as Value;
    expect(result.value).toBe("Myriad");
  });
});
