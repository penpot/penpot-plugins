import type { PenpotContext } from '@penpot/plugin-types';
import type { Manifest } from './models/manifest.model.js';
import { createPluginManager } from './plugin-manager.js';
import { createSandbox } from './create-sandbox.js';

export async function createPlugin(
  context: PenpotContext,
  manifest: Manifest,
  onCloseCallback: () => void
) {
  const plugin = await createPluginManager(
    context,
    manifest,
    function onClose() {
      sandbox.cleanGlobalThis();
      onCloseCallback();
    },
    function onReloadModal() {
      sandbox.evaluate();
    }
  );

  const sandbox = createSandbox(plugin);
  sandbox.evaluate();

  return {
    plugin,
    compartment: sandbox,
  };
}
