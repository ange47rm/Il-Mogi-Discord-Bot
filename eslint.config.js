import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],
            "no-console": "off",
            "indent": ["error", 4],
            "semi": ["error", "always"],
        }
    }
];
