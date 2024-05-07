import type { PenpotContext } from '@penpot/plugin-types';

import { PluginConfig } from './models/plugin-config.model.js';
import { createApi } from './api/index.js';
import { parseManifest } from './parse-manifest.js';

let isLockedDown = false;
let lastApi: ReturnType<typeof createApi> | undefined;

let pluginContext: PenpotContext | null = null;

export function setContext(context: PenpotContext) {
  pluginContext = context;
}

export const ɵloadPlugin = async function (config: PluginConfig) {
  const { code, manifest } = await parseManifest(config);

  try {
    if (!isLockedDown) {
      isLockedDown = true;
      hardenIntrinsics();
    }

    if (lastApi) {
      lastApi.closePlugin();
    }

    if (pluginContext) {
      lastApi = createApi(pluginContext, manifest);

      const c = new Compartment({
        penpot: harden(lastApi),
      });

      c.evaluate(code);
    } else {
      console.error('Cannot find Penpot Context');
    }
  } catch (error) {
    console.error(error);
  }
};
