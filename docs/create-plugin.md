# Create plugin

To create the basic scaffolding run the following command. Remember to replace `example-plugin` with your own.

```
npx nx g @nx/web:application example-plugin --directory=apps/example-plugin
```

Create a `manifes.json` in `/public`.

```json
{
  "name": "Example plugin",
  "code": "http://localhost:4201/plugin.js",
  "permissions": ["page:read", "file:read", "selection:read"]
}
```

Add to the example `vite.config.ts`

```json
build: {
  rollupOptions: {
    input: {
      plugin: 'src/plugin.ts',
      index: './index.html',
    },
    output: {
      entryFileNames: '[name].js',
    },
  },
}
```

Add to `tsconfig.app.json`

```json
  "include": ["src/**/*.ts", "../../libs/plugins-runtime/src/lib/index.d.ts"]
```

Then, run the static server

```
npx nx run example-plugin:serve-static --port 4201
```

Finally, go to penpot and load the plugin. Run the command in the console devtools from your browser.

```ts
ɵloadPlugin({ manifest: 'http://localhost:4201/manifest.json' });
```

### More about plugin development

Check the [plugin usage](docs/plugin-usage.md) and the [create API](docs/create-api.md) documentation.
