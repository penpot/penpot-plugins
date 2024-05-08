# Creating a Plugin

This guide walks you through the steps to create an Angular plugin.

### Step 1: Initialize the Plugin

First, you need to create the scaffolding for your plugin. Use the following command, replacing `example-plugin` with the name of your plugin:

```sh
npx nx g @nx/angular:app example-plugin --directory=apps/example-plugin --bundler=esbuild
```

### Step 2: Configure the Manifest

Next, create a `manifest.json` file inside the `/src/assets` directory. This file is crucial as it defines key properties of your plugin, including permissions and the entry point script.

```json
{
  "name": "Example plugin",
  "code": "http://localhost:4200/assets/plugin.js",
  "permissions": ["page:read", "file:read", "selection:read"]
}
```

### Step 3: Update Project Configuration

Now, add the following configuration to your `project.json` to compile the `plugin.ts` file:

```typescript
"tags": ["type:plugin"],
"targets": {
  "buildPlugin": {
    "executor": "@nx/esbuild:esbuild",
    "outputs": [
      "{options.outputPath}"
    ],
    "options": {
      "minify": true,
      "outputPath": "apps/example-plugin/src/assets/",
      "main": "apps/example-plugin/src/plugin.ts",
      "tsConfig": "apps/example-plugin/tsconfig.plugin.json",
      "generatePackageJson": false,
      "format": [
        "esm"
      ],
      "deleteOutputPath": false
    }
  },
}
```

Also, update `targets.build` with the following code to allow the use of Penpot styles.

```json
"styles": [
  "libs/plugins-styles/src/lib/styles.css",
  "apps/example-plugin/src/styles.css"
],
"optimization": {
  "scripts": true,
  "styles": true,
  "fonts": false
}
```

### Step 4: Modify TypeScript Configuration

Create ``tsconfig.plugin.json` next to the `tsconfig.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": []
  },
  "files": ["src/plugin.ts"],
  "include": ["../../libs/plugin-types/index.d.ts"]
}
```

Add the reference to the main tsconfig.json:

```json
"references": [
  {
    "path": "./tsconfig.plugin.json"
  }
],
```

### Strep 5: Hello world plugin code

Create the file `apps/example-plugin/src/plugin.ts` with the following code:

```ts
console.log('Hello Plugin');
```

### Step 6: Run the plugin

Run this command:

```sh
npx nx run-many --targets=buildPlugin,serve --projects=example-plugin --watch
```

This will run two tasks: `serve`, the usual Angular server, and `buildPlugin`, which will compile the `plugin.ts` file.

### Step 6: Load the Plugin in Penpot

Finally, to load your plugin into Penpot, execute the following command in the browser's console devtools:

```typescript
ɵloadPluginByUrl('http://localhost:4201/assets/manifest.json');
```

### Learn More About Plugin Development

For more detailed information on plugin development, check out our guides:

- [Plugin Usage Documentation](docs/plugin-usage.md)
- [Create API Documentation](docs/create-api.md)

### Using a Starter Template

If you prefer to kickstart your plugin development, consider using the [Penpot Plugin Starter Template](https://github.com/penpot/penpot-plugin-starter-template). It's a template designed to streamline the creation process for Penpot plugins.
