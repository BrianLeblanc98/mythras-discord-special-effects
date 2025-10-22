// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always']
    }
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  globalIgnores(['dist/', 'deploy-commands.js', 'clear-commands.js'])
]);