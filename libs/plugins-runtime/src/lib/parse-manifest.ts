import { Manifest } from './models/manifest.model.js';
import { manifestSchema } from './models/manifest.schema.js';
import { PluginConfig } from './models/plugin-config.model.js';

export function loadManifest(url: string): Promise<Manifest> {
  return fetch(url)
    .then((response) => response.json())
    .then((manifest: Manifest): Manifest => {
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

export async function parseManifest(config: PluginConfig): Promise<{
  manifest: Manifest;
  code: string;
}> {
  const manifest = await loadManifest(config.manifest);
  const code = await loadCode(manifest.code);

  return {
    manifest,
    code,
  };
}
