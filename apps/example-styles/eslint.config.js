import baseConfig from '../../eslint.config.js';
import typescriptEslintParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: { project: './apps/example-styles/tsconfig.app.json' },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
  { ignores: ['vite.config.ts'] },
];
