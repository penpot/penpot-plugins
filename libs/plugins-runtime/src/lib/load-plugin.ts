import { PluginConfig } from './models/plugin-config.model';
import { createApi } from './api';
import { parseManifest } from './parse-manifest';

let isLockedDown = false;
let lastApi: ReturnType<typeof createApi> | undefined;

export const ɵloadPlugin = async function (config: PluginConfig) {
  const { code } = await parseManifest(config);

  try {
    if (!isLockedDown) {
      isLockedDown = true;
      hardenIntrinsics();
    }

    if (lastApi) {
      lastApi.closePlugin();
    }

    lastApi = createApi();

    const c = new Compartment({
      penpot: harden(lastApi),
    });

    c.evaluate(code);
  } catch (error) {
    console.error(error);
  }
};
