import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["components/chess/engine/**/*.test.ts"],
  },
});
