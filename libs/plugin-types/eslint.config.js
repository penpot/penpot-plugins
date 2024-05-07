import baseConfig from '../../eslint.config.js';
import jsoncParser from 'jsonc-eslint-parser';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
    languageOptions: {
      globals: {
        fetch: 'readonly',
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
  {
    files: ['*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            'libs/plugin-types/vite.config.ts',
            'libs/plugin-types/eslint.config.js',
            'libs/plugin-types/**/*.spec.ts',
          ],
        },
      ],
    },
  },
];

