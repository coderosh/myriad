import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/**.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["html"],
      reportsDirectory: "./coverage",
    },
  },
});
