import type { Context } from '@penpot/plugin-types';

import { loadManifest } from './parse-manifest.js';
import { Manifest } from './models/manifest.model.js';
import { createPlugin } from './create-plugin.js';

let plugins: Awaited<ReturnType<typeof createPlugin>>[] = [];

export type ContextBuilder = (id: string) => Context;

let contextBuilder: ContextBuilder | null = null;

export function setContextBuilder(builder: ContextBuilder) {
  contextBuilder = builder;
}

export const getPlugins = () => plugins;

const closeAllPlugins = () => {
  plugins.forEach((pluginApi) => {
    pluginApi.plugin.close();
  });

  plugins = [];
};

window.addEventListener('message', (event) => {
  try {
    for (const it of plugins) {
      it.plugin.sendMessage(event.data);
    }
  } catch (err) {
    console.error(err);
  }
});

export const loadPlugin = async function (manifest: Manifest) {
  try {
    const context = contextBuilder && contextBuilder(manifest.pluginId);

    if (!context) {
      return;
    }

    closeAllPlugins();

    const plugin = await createPlugin(context, manifest, () => {
      plugins = plugins.filter((api) => api !== plugin);
    });

    plugins.push(plugin);
  } catch (error) {
    closeAllPlugins();
    console.error(error);
  }
};

export const ɵloadPlugin = async function (manifest: Manifest) {
  loadPlugin(manifest);
};

export const ɵloadPluginByUrl = async function (manifestUrl: string) {
  const manifest = await loadManifest(manifestUrl);
  ɵloadPlugin(manifest);
};
