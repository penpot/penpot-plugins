npx nx g @nx/web:application example-plugin --directory=apps/example-plugin

Create a manifes.json in /public

```json
{
  "name": "Example plugin",
  "code": "http://localhost:4201/plugin.js"
}
```

Add to the example vite.config.ts

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

Run static server `npx nx run example-plugin:serve-static --port 4201`

Go to penpot and load the plugin.

```ts
ɵloadPlugin({ manifest: 'http://localhost:4201/manifest.json' });
```
