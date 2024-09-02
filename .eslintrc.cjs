/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-floating-promises": "off",
    // indent: ["error", 2], // タブサイズを2スペースに設定
  },
};
module.exports = config;
