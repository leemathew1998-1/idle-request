import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2015",
    outDir: "dist",
    lib: {
      entry: "src/main.ts",
      formats: ["es", "cjs"],
    },
  },
});
