import { describe, expect, test } from "vitest";

import { getRunner } from "../src";
import { Value } from "../src/Interpreter/types";

describe("myriad", () => {
  const run = getRunner();

  test("function declaration and call should work", () => {
    expect(() =>
      run(`func add(x, y){ x + y; } add(2, 3);`, false, true)
    ).not.toThrowError();
  });

  test("return from function should work", () => {
    const val = run(`func sub(x, y) { return x - y; } sub(10, 5);`) as Value;
    expect(val.value).toBe(5);
  });

  test("last expression of function should be returned by default", () => {
    const val = run(`func mul(x, y) { x * y; } mul(4, 5);`) as Value;
    expect(val.value).toBe(20);
  });

  test("");
});
