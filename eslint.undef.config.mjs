// Single purpose: find identifiers that do not exist. Not a style pass.
// This is the class of bug that took down three pages while every build
// stayed green — Vite only fails on a module it cannot resolve, never on a
// symbol that simply is not there.
import globals from "globals";

// The globals package ships at least one key with trailing whitespace, which
// ESLint 10 rejects outright.
const clean = (source) =>
  Object.fromEntries(Object.entries(source).map(([k, v]) => [k.trim(), v]));

export default [
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...clean(globals.browser), ...clean(globals.es2017), React: "readonly" },
    },
    rules: { "no-undef": "error" },
  },
];
