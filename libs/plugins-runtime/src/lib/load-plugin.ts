import type { PenpotContext } from '@penpot/plugin-types';

import { createApi } from './api/index.js';
import { loadManifest, loadManifestCode } from './parse-manifest.js';
import { Manifest } from './models/manifest.model.js';

let isLockedDown = false;
let createdApis: ReturnType<typeof createApi>[] = [];
const multiPlugin = false;

let pluginContext: PenpotContext | null = null;

export function setContext(context: PenpotContext) {
  pluginContext = context;
}

export const ɵloadPlugin = async function (manifest: Manifest) {
  try {
    const code = await loadManifestCode(manifest);

    if (!isLockedDown) {
      isLockedDown = true;
      hardenIntrinsics();
    }

    if (createdApis && !multiPlugin) {
      createdApis.forEach((pluginApi) => {
        pluginApi.closePlugin();
      });
    }

    if (pluginContext) {
      const pluginApi = createApi(pluginContext, manifest);
      createdApis.push(pluginApi);

      const c = new Compartment({
        penpot: harden(pluginApi),
        fetch: window.fetch.bind(window),
        console: harden(window.console),
        Math: harden(Math),
        setTimeout: harden(
          (...[handler, timeout]: Parameters<typeof setTimeout>) => {
            return setTimeout(() => {
              handler();
            }, timeout);
          }
        ),
        clearTimeout: harden((id: Parameters<typeof clearTimeout>[0]) => {
          clearTimeout(id);
        }),
      });

      c.evaluate(code);

      const listenerId: symbol = pluginContext.addListener('finish', () => {
        createdApis.forEach((pluginApi) => {
          pluginApi.closePlugin();
        });

        pluginContext?.removeListener(listenerId);
      });
    } else {
      console.error('Cannot find Penpot Context');
    }
  } catch (error) {
    console.error(error);
  }
};

export const ɵloadPluginByUrl = async function (manifestUrl: string) {
  const manifest = await loadManifest(manifestUrl);

  ɵloadPlugin(manifest);
};
