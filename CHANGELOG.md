# 1.0.0 (2024-10-25)


### 🚀 Features

- **plugins-runtime:** add close callback to load api ([aeddab7](https://github.com/penpot/penpot-plugins/commit/aeddab7))
- **runtime:** unload plugin ([b4d0463](https://github.com/penpot/penpot-plugins/commit/b4d0463))

### 🩹 Fixes

- search in icons plugin ([b4664a2](https://github.com/penpot/penpot-plugins/commit/b4664a2))
- **table-plugin:** i#8965 empty cell values when importing csv files ([#8965](https://github.com/penpot/penpot-plugins/issues/8965))

### ❤️  Thank You

- alonso.torres
- Juanfran @juanfran
- María Valderrama @mavalroot
- Marina López @cocotime

## 0.12.0 (2024-10-04)


### 🚀 Features

- e2e tests ([1371af9](https://github.com/penpot/penpot-plugins/commit/1371af9))
- add build to CI ([a434209](https://github.com/penpot/penpot-plugins/commit/a434209))
- **api-doc:** update readme ([99ff81d](https://github.com/penpot/penpot-plugins/commit/99ff81d))
- **docs:** add examples for new permissions ([2f0f7a6](https://github.com/penpot/penpot-plugins/commit/2f0f7a6))
- **e2e:** add screenshots ENV variable ([9292bf2](https://github.com/penpot/penpot-plugins/commit/9292bf2))
- **plugin-types:** add ruler guides and new zoom methods ([c8066be](https://github.com/penpot/penpot-plugins/commit/c8066be))
- **plugin-types:** add apis for comments ([e34e56c](https://github.com/penpot/penpot-plugins/commit/e34e56c))
- **plugin-types:** update comment related methods ([50bc7ba](https://github.com/penpot/penpot-plugins/commit/50bc7ba))
- **plugin-types:** removed old method and replaced with attributes ([1866299](https://github.com/penpot/penpot-plugins/commit/1866299))
- **plugins-runtime:** plugin live reload ([bbc77e4](https://github.com/penpot/penpot-plugins/commit/bbc77e4))
- **plugins-runtime:** adds new permissions `comment:read`, `comment:write` and `allow:downloads` ([5adbee2](https://github.com/penpot/penpot-plugins/commit/5adbee2))
- **plugins-runtime:** expose some public JS APIs to the plugins code ([22dfa92](https://github.com/penpot/penpot-plugins/commit/22dfa92))
- **poc-state-plugin:** add new functions to the plugin to test comments and rulers ([6adee11](https://github.com/penpot/penpot-plugins/commit/6adee11))
- **rename-layers:** final review - undo group ([2909bcc](https://github.com/penpot/penpot-plugins/commit/2909bcc))
- **runtime:** refactor plugin state ([16595c2](https://github.com/penpot/penpot-plugins/commit/16595c2))
- **runtime:** remove deprecated  method ([ccc5f78](https://github.com/penpot/penpot-plugins/commit/ccc5f78))
- **table-plugin:** enhancement save config ([07af57d](https://github.com/penpot/penpot-plugins/commit/07af57d))

### 🩹 Fixes

- **e2e:** update dump params to shape model ([ade39ee](https://github.com/penpot/penpot-plugins/commit/ade39ee))
- **plugin-types:** optional path curves ([0ea57f1](https://github.com/penpot/penpot-plugins/commit/0ea57f1))
- **plugins-runtime:** clean pending timeouts ([8870dda](https://github.com/penpot/penpot-plugins/commit/8870dda))
- **plugins-runtime:** prevent plugin execution after close ([b65492a](https://github.com/penpot/penpot-plugins/commit/b65492a))
- **plugins-styles:** import svg inline ([567b0b5](https://github.com/penpot/penpot-plugins/commit/567b0b5))
- **runtime:** ses errorTrapping interferes with penpot error handler ([8c0e36d](https://github.com/penpot/penpot-plugins/commit/8c0e36d))
- **runtime:** prevent override Penpot objects ([120e9e5](https://github.com/penpot/penpot-plugins/commit/120e9e5))

### ❤️  Thank You

- alonso.torres
- Juanfran @juanfran
- María Valderrama @mavalroot

## 0.10.0 (2024-07-31)


### 🚀 Features

- change permissions names ([99126f8](https://github.com/penpot/penpot-plugins/commit/99126f8))
- stop offering icons in the style library ([5a219e9](https://github.com/penpot/penpot-plugins/commit/5a219e9))
- new publish script ([5114e78](https://github.com/penpot/penpot-plugins/commit/5114e78))
- init e2e test ([b0af705](https://github.com/penpot/penpot-plugins/commit/b0af705))
- **docs:** how api docs are generated ([e047977](https://github.com/penpot/penpot-plugins/commit/e047977))
- **docs:** basic css theme for typedoc ([0eac44d](https://github.com/penpot/penpot-plugins/commit/0eac44d))
- **plugin-types:** update API types ([bffa467](https://github.com/penpot/penpot-plugins/commit/bffa467))
- **plugin-types:** add pages info to the file ([b54edb3](https://github.com/penpot/penpot-plugins/commit/b54edb3))
- **plugin-types:** add parent reference to the shape ([2588778](https://github.com/penpot/penpot-plugins/commit/2588778))
- **plugin-types:** add root shape reference to the pages ([c712759](https://github.com/penpot/penpot-plugins/commit/c712759))
- **plugin-types:** add undo block operations to api ([1d3ad89](https://github.com/penpot/penpot-plugins/commit/1d3ad89))
- **plugins-runtime:** update selection ([f36fa23](https://github.com/penpot/penpot-plugins/commit/f36fa23))
- **plugins-runtime:** add new events 'contentsave' and 'shapechange', changed on/off signatures ([2b8a76b](https://github.com/penpot/penpot-plugins/commit/2b8a76b))
- **plugins-runtime:** add detach shape from component method ([ff488d4](https://github.com/penpot/penpot-plugins/commit/ff488d4))
- **plugins-runtime:** add API to access to prototypes ([a554775](https://github.com/penpot/penpot-plugins/commit/a554775))
- **plugins-runtime:** add method for pages ([9a9b33a](https://github.com/penpot/penpot-plugins/commit/9a9b33a))
- **plugins-types:** expose new attributes ([9ce45a2](https://github.com/penpot/penpot-plugins/commit/9ce45a2))

### 🩹 Fixes

- typo checkox > checkbox ([877a3f2](https://github.com/penpot/penpot-plugins/commit/877a3f2))
- avoid plugin location question ([b4c6165](https://github.com/penpot/penpot-plugins/commit/b4c6165))
- add files so no unexpected when creating new plugin ([ef5629a](https://github.com/penpot/penpot-plugins/commit/ef5629a))
- eslint migration to ESM docs ([249ea62](https://github.com/penpot/penpot-plugins/commit/249ea62))
- fix runtime version ([95afbf3](https://github.com/penpot/penpot-plugins/commit/95afbf3))
- horizontal scroll height on plugins modal ([08f989a](https://github.com/penpot/penpot-plugins/commit/08f989a))
- **contrast-plugin:** update colors when shape change ([8ce04d3](https://github.com/penpot/penpot-plugins/commit/8ce04d3))
- **docs:** add missing variant on destructive button ([9fa96e9](https://github.com/penpot/penpot-plugins/commit/9fa96e9))
- **plugin-types:** readonly PenpotShapeBase width & height ([415284f](https://github.com/penpot/penpot-plugins/commit/415284f))
- **plugins-runtime:** remove plugin event listener on close ([2138985](https://github.com/penpot/penpot-plugins/commit/2138985))
- **plugins-runtime:** fix problem with types in test ([17db173](https://github.com/penpot/penpot-plugins/commit/17db173))
- **styles:** input, button & select worksans font family ([1b9d3b2](https://github.com/penpot/penpot-plugins/commit/1b9d3b2))

### ❤️  Thank You

- alonso.torres
- Juanfran @juanfran
- María Valderrama @mavalroot
- Marina López @cocotime
- Xaviju

## 0.9.0 (2024-07-10)

### 🚀 Features

- change permissions names ([99126f8](https://github.com/penpot/penpot-plugins/commit/99126f8))
- stop offering icons in the style library ([5a219e9](https://github.com/penpot/penpot-plugins/commit/5a219e9))
- new publish script ([5114e78](https://github.com/penpot/penpot-plugins/commit/5114e78))
- **plugin-types:** update API types ([bffa467](https://github.com/penpot/penpot-plugins/commit/bffa467))
- **plugins-runtime:** update selection ([f36fa23](https://github.com/penpot/penpot-plugins/commit/f36fa23))
- **plugins-types:** expose new attributes ([9ce45a2](https://github.com/penpot/penpot-plugins/commit/9ce45a2))

### 🩹 Fixes

- typo checkox > checkbox ([877a3f2](https://github.com/penpot/penpot-plugins/commit/877a3f2))
- avoid plugin location question ([b4c6165](https://github.com/penpot/penpot-plugins/commit/b4c6165))
- fix runtime version ([2401a77](https://github.com/penpot/penpot-plugins/commit/2401a77))
- **styles:** input, button & select worksans font family ([1b9d3b2](https://github.com/penpot/penpot-plugins/commit/1b9d3b2))

### ❤️ Thank You

- alonso.torres
- Juanfran @juanfran
- Marina López @cocotime
- Xaviju @xaviju
