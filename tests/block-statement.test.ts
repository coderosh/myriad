import { describe, expect, test } from "vitest";

import { getRunner } from "../src";
import Environment from "../src/Interpreter/Environment";
import { Value } from "../src/Interpreter/types";

describe("myriad", () => {
  const run = getRunner();

  test("block statement should work", () => {
    const val = run(`{ let name = "Roshan Acharya"; }`, true) as Environment;

    expect(val.variables.get("name")?.value).toBe("Roshan Acharya");
  });

  test("empty statements should work", () => {
    const val = run(";;;;") as Value;
    expect(val.value).toBe(undefined);
  });
});
