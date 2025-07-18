import js from '@eslint/js';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';

export default [
    {
        files: ['**/*.vue', '**/*.js', '**/*.ts'],
        ignores: ['node_modules/', 'dist/'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                process: 'readonly'
            },
            parser: vueParser,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.vue']
            }
        },
        plugins: {
            vue: vuePlugin
        },
        rules: {
            ...js.configs.recommended.rules,
            'vue/multi-word-component-names': 'off',
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'quotes': ['error', 'single'],
            'semi': ['error', 'always']
        }
    }
];
