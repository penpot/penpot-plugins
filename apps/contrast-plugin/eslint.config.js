import baseConfig from '../../eslint.config.js';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  ...baseConfig,
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: { project: './apps/contrast-plugin/tsconfig.app.json' },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
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
