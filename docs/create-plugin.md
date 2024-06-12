# Creating a Plugin

This guide walks you through the steps to create a plugin for our platform. You'll start by setting up the basic structure, configuring necessary files, and then running a local server to preview your plugin. Let's dive in.

### Step 1: Initialize the Plugin

First, you need to create the scaffolding for your plugin. Use the following command, replacing `example-plugin` with the name of your plugin:

```sh
npx nx g @nx/web:application example-plugin --directory=apps/example-plugin
```

### Step 2: Configure the Manifest

Next, create a `manifest.json` file inside the `/public` directory. This file is crucial as it defines key properties of your plugin, including permissions and the entry point script.

```json
{
  "name": "Example Plugin",
  "host": "http://localhost:4201",
  "code": "/plugin.js",
  "icon": "/icon.png",
  "permissions": ["page:read", "file:read", "selection:read"]
}
```

### Step 3: Update Vite Configuration

Now, add the following configuration to your `vite.config.ts` to specify the entry points for the build process:

```typescript
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

### Step 4: Modify TypeScript Configuration

Update your `tsconfig.app.json` to include the necessary TypeScript files for your plugin:

```json
{
  "include": ["src/**/*.ts", "../../libs/plugin-types/index.d.ts"]
}
```

### Step 5: Run a Static Server

To preview your plugin, start a static server by running:

```sh
npx nx run example-plugin:build --watch & npx nx run example-plugin:preview
```

### Step 6: Add TS parser to eslint

Add these options to the end of the `eslint.config.js` file to allow linting with type information:

```js
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.*?.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
```

### Step 7: Load the Plugin in Penpot

Finally, to load your plugin into Penpot, execute the following command in the browser's console devtools:

```typescript
ɵloadPluginByUrl('http://localhost:4201/manifest.json');
```

### Learn More About Plugin Development

For more detailed information on plugin development, check out our guides:

- [Plugin Usage Documentation](docs/plugin-usage.md)
- [Create API Documentation](docs/create-api.md)

### Using a Starter Template

If you prefer to kickstart your plugin development, consider using the [Penpot Plugin Starter Template](https://github.com/penpot/penpot-plugin-starter-template). It's a template designed to streamline the creation process for Penpot plugins.
