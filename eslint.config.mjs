import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Vendored shadcn/registry components are kept close to their upstream
    // source. The wave background drives an imperative rAF loop over refs,
    // which the React Compiler immutability rule flags but which is safe:
    // every helper only runs from effects and event handlers, never render.
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
