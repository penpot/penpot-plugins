import type { PenpotContext, PenpotTheme } from '@penpot/plugin-types';

import { createApi } from './api/index.js';
import { loadManifest, loadManifestCode } from './parse-manifest.js';
import { Manifest } from './models/manifest.model.js';
import * as api from './api/index.js';
import { ses } from './ses.js';

let createdApis: ReturnType<typeof createApi>[] = [];
const multiPlugin = false;

export type ContextBuilder = (id: string) => PenpotContext;

let contextBuilder: ContextBuilder | null = null;

export function setContextBuilder(builder: ContextBuilder) {
  contextBuilder = builder;
}

const closeAllPlugins = () => {
  createdApis.forEach((pluginApi) => {
    pluginApi.closePlugin();
  });

  createdApis = [];
};

export const loadPlugin = async function (manifest: Manifest) {
  try {
    const context = contextBuilder && contextBuilder(manifest.pluginId);

    if (!context) {
      return;
    }

    context.addListener('themechange', (e: PenpotTheme) => api.themeChange(e));

    const code = await loadManifestCode(manifest);

    ses.hardenIntrinsics();

    if (createdApis && !multiPlugin) {
      closeAllPlugins();
    }

    const pluginApi = createApi(context, manifest, () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    });

    createdApis.push(pluginApi);

    const timeouts = new Set<ReturnType<typeof setTimeout>>();

    const publicPluginApi = {
      penpot: ses.harden(pluginApi),
      fetch: ses.harden((...args: Parameters<typeof fetch>) => {
        const requestArgs: RequestInit = {
          ...args[1],
          credentials: 'omit',
        };

        return fetch(args[0], requestArgs);
      }),
      console: ses.harden(window.console),
      Math: ses.harden(Math),
      setTimeout: ses.harden(
        (...[handler, timeout]: Parameters<typeof setTimeout>) => {
          const timeoutId = setTimeout(() => {
            handler();
          }, timeout);

          timeouts.add(timeoutId);

          return timeoutId;
        }
      ) as typeof setTimeout,
      clearTimeout: ses.harden((id: ReturnType<typeof setTimeout>) => {
        clearTimeout(id);

        timeouts.delete(id);
      }),
    };

    const c = ses.createCompartment(publicPluginApi);

    c.evaluate(code);

    const listenerId: symbol = context.addListener('finish', () => {
      closeAllPlugins();

      context?.removeListener(listenerId);
    });

    return {
      compartment: c,
      publicPluginApi,
      timeouts,
      context,
    };
  } catch (error) {
    closeAllPlugins();
    console.error(error);
  }

  return;
};

export const ɵloadPlugin = async function (manifest: Manifest) {
  loadPlugin(manifest);
};

export const ɵloadPluginByUrl = async function (manifestUrl: string) {
  const manifest = await loadManifest(manifestUrl);
  ɵloadPlugin(manifest);
};
