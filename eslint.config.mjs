import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: ["node_modules/", "dist/"],
  }
];