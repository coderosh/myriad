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
});
