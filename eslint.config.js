import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
      "no-console": "off",
      indent: ["error", 2],
      semi: ["error", "always"],
      "prettier/prettier": ["error", { tabWidth: 2 }],
    },
  },
];
