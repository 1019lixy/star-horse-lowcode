import js from "@eslint/js";
import globals from "globals";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

export default [
    {
        ignores: ["**/dist/**", "**/node_modules/**"],
    },
    {
        files: ["**/*.vue", "**/*.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                process: "readonly",
                $: "readonly",
                jQuery: "readonly"
            },
            parser: vueParser,
            parserOptions: {
                parser: "@typescript-eslint/parser",
                extraFileExtensions: [".vue"]
            }
        },
        plugins: {
            vue: vuePlugin
        },
        rules: {
            ...js.configs.recommended.rules,
            "vue/multi-word-component-names": "off",
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "quotes": ["error", "double", {"avoidEscape": true}],
            "semi": ["error", "always"]
        }
    }
];