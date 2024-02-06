import { Manifest } from './models/manifest.model';
import { manifestSchema } from './models/manifest.schema';
import { PluginConfig } from './models/plugin-config.model';

function loadManifest(url: string): Promise<Manifest> {
  return fetch(url)
    .then((response) => response.json())
    .then((manifest: Manifest) => {
      const parseResult = manifestSchema.safeParse(manifest);

      if (!parseResult.success) {
        throw new Error('Invalid plugin manifest');
      }

      return manifest;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

function loadCode(url: string): Promise<string> {
  return fetch(url).then((response) => response.text());
}

export async function parseManifest(config: PluginConfig) {
  const manifest = await loadManifest(config.manifest);
  const code = await loadCode(manifest.code);

  return {
    manifest,
    code,
  };
}
