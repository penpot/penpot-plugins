# Penpot Plugins

## What can you find here?

We've been working in an MVP to allow users to develop their own plugins and use the existing ones.

There are 2 important folders to keep an eye on: `apps` and `libs`.

In the `libs` folder you'll find:

- plugins-data-parser: useful functions to parse the data we get from penpot.
  It has its own [README](libs/plugins-data-parser/README.md).
- plugins-runtime: here you'll find the code that initializes the plugin and sets a few listeners to know when the penpot page/file/selection changes.
  It has its own [README](libs/plugins-runtime/README.md).
- plugins-styles: basic css library with penpot styles in case you need help for styling your plugins.

In the `apps` folder you'll find some examples that use the libraries mentioned above.

- example-plugin or contrast-plugin: to run this example check <a href="#create-a-plugin-from-scratch-or-run-the-examples-from-the-apps-folder">Create a plugin from scratch</a>

- example-styles: to run this example you should run

```
npm run start:styles-example
```

Open in your browser: `http://localhost:4202/`

## Create a plugin from scratch or run the examples from the apps folder

First of all it's necessary to have penpot running locally, you can check the steps [here](https://help.penpot.app/technical-guide/developer/devenv/)

Once you've done the previous step, you'll need to move to the following [branch](https://github.com/penpot/penpot/tree/niwinz-poc-plugins) as we still have the penpot part WIP
Remember to run penpot:

```
./manage.sh pull-devenv
./manage.sh run-devenv
```

Then, you need to run `npm start` in the penpot-plugins repository.

At this point, you have 2 choices:

- if you want to run the examples you should run:

```
// for the example plugin
npm run start:example

or

npx nx run example-plugin:build --watch & npx nx run example-plugin:preview
```

or

```
// for the contrast plugin
npx nx run contrast-plugin:build --watch & npx nx run contrast-plugin:preview
```

Open in your browser: `http://localhost:4210/`

- if you want to create a new plugin, read the following [README](docs/create-plugin.md)

## License

```
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) KALEIDOS INC
```

Penpot is a Kaleidos’ [open source project](https://kaleidos.net/)
