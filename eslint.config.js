import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
    globalIgnores(["**/node_modules/**", "**/dist/**", "database/**"]),

    // Base
    eslint.configs.recommended,
    tseslint.configs.recommended,
    prettierConfig,

    // Backend (Express + Node)
    {
        files: ["src/**/*.{ts,js}"],
        languageOptions: {},
        rules: {
            "@typescript-eslint/no-unused-vars": "warn"
        }
    }
]);
