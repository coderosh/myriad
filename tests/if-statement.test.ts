import { describe, expect, test } from "vitest";

import { getRunner } from "../src";
import Environment from "../src/Interpreter/Environment";

describe("myriad", () => {
  const run = getRunner();

  test("if statement should work", () => {
    const val = run(
      `
        let works = false;
        if(true){
            works = true;
        }
    `,
      true
    ) as Environment;

    expect(val.variables.get("works")?.value).toBe(true);
  });

  test("if else statement should work", () => {
    const val = run(
      `
       let x = false;
       let y;

       if(x){
          y = true;
       }else {
          y = false;
       }
    `,
      true
    ) as Environment;

    expect(val.variables.get("y")?.value).toBe(false);
  });

  test("if else statement should work without curly braces for a single statement", () => {
    const val = run(
      `
       let a = false;
       let b;

       if(a)
          b = true;
       else
          b = false;
    `,
      true
    ) as Environment;

    expect(val.variables.get("b")?.value).toBe(false);
  });

  test("if else statement should work without parenthesis braces in test condition", () => {
    const val = run(
      `
       let c = false;
       let d;

       if c
          d = true;
       else
          d = false;
    `,
      true
    ) as Environment;

    expect(val.variables.get("d")?.value).toBe(false);
  });
});
