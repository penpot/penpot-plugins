Every time a project or library is created the `typescript-eslint/parser` must be added.

```json
  "ignorePatterns": ["!**/*", "vite.config.ts"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./apps/app-name/tsconfig.app.json"
  },
```
