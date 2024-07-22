import type { PenpotContext, PenpotTheme } from '@penpot/plugin-types';

import { createApi } from './api/index.js';
import { loadManifest, loadManifestCode } from './parse-manifest.js';
import { Manifest } from './models/manifest.model.js';
import * as api from './api/index.js';

let isLockedDown = false;
let createdApis: ReturnType<typeof createApi>[] = [];
const multiPlugin = false;

export type ContextBuilder = (id: string) => PenpotContext;

let contextBuilder: ContextBuilder | null = null;

export function setContextBuilder(builder: ContextBuilder) {
  contextBuilder = builder;
}

export const ɵloadPlugin = async function (manifest: Manifest) {
  try {
    const closeAllPlugins = () => {
      createdApis.forEach((pluginApi) => {
        pluginApi.closePlugin();
      });

      createdApis = [];
    };

    const context = contextBuilder && contextBuilder(manifest.pluginId);

    if (!context) {
      return;
    }

    context.addListener('themechange', (e: PenpotTheme) => api.themeChange(e));

    const code = await loadManifestCode(manifest);

    if (!isLockedDown) {
      isLockedDown = true;
      hardenIntrinsics();
    }

    if (createdApis && !multiPlugin) {
      closeAllPlugins();
    }

    const pluginApi = createApi(context, manifest);
    createdApis.push(pluginApi);

    const c = new Compartment({
      penpot: harden(pluginApi),
      fetch: harden((...args: Parameters<typeof fetch>) => {
        const requestArgs: RequestInit = {
          ...args[1],
          credentials: 'omit',
        };

        return fetch(args[0], requestArgs);
      }),
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

    const listenerId: symbol = context.addListener('finish', () => {
      closeAllPlugins();

      context?.removeListener(listenerId);
    });
  } catch (error) {
    console.error(error);
  }
};

export const ɵloadPluginByUrl = async function (manifestUrl: string) {
  const manifest = await loadManifest(manifestUrl);
  ɵloadPlugin(manifest);
};
