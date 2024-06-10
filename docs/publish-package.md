# Publishing Packages

## Introduction

This guide details the process of publishing `plugin-types` and `plugins-styles` packages, which are essential for plugin development. To facilitate testing and distribution, we leverage npm for publishing and Verdaccio for setting up a local registry. Below is a walkthrough for publishing these packages, setting up a local registry, and managing releases.

## Setting Up a Local Registry with Verdaccio

Setting up a local registry is for testing plugins in isolation from the monorepo. We utilize Verdaccio, a npm proxy registry, for this purpose.

**Launch the Registry**: Initiate the Verdaccio registry by executing the command:

```shell
npm run registry
```

## Publishing Libraries

Publishing packages allows you to distribute your libraries to other developers and environments. Follow the steps below for both automated and manual publishing processes.

### Automated Publishing:

To publish the libraries automatically, use the command:

```shell
npm run publish -- --version 0.1.0 --tag 0.1.0 --registry http://localhost:4873
```

### Manual Publishing:

For manual publication, navigate to the library directory and execute:

```shell
npm publish --registry http://localhost:4873
```

### Independent Publishing:

To publish libraries independently, specify the package name along with version and tag:

```shell
npx nx publish plugin-types -- --version 0.1.0 --tag 0.1.0
npx nx publish plugins-styles -- --version 0.1.0 --tag 0.1.0
```

### Create the tag in git

```shell
git tag -a 0.1.0
git push origin 0.1.0
```

### Installing Libraries:

When installing the library, ensure to specify the registry:

```shell
npm i --registry http://localhost:4873
```

**Note**: For direct npm publication, omit the `--registry` flag.

## Managing Releases

### Generating a Release:

For regular releases, execute:

```shell
npx nx release
```

For the initial release, use the `--first-release` flag:

```shell
npx nx release --first-release
```

Refer to the [Nx Release Documentation](https://nx.dev/recipes/nx-release/publish-in-ci-cd) for detailed information.

## Important Reminders

Ensure to update the [penpot-plugin-starter-template](https://github.com/penpot/penpot-plugin-starter-template) with every release to provide developers with the latest configuration and features.

## Relevant Files and Scripts

- **Verdaccio Configuration**: `./project.json`
- **CSS Build Script**: `./tools/scripts/build-css.mjs`
- **Types Build Script**: `./tools/scripts/build-types.mjs`
- **Publish Script**: `./tools/scripts/publish.mjs`

This improved documentation aims to streamline the package publishing process, making it more accessible and understandable for developers.
