import 'ses';
import './lib/plugin-modal';
import { initInstaller } from './lib/installer.js';

import { ɵloadPlugin, setContext } from './lib/load-plugin.js';
import * as api from './lib/api/index.js';
import type { PenpotContext } from '@penpot/plugin-types';

console.log('%c[PLUGINS] Loading plugin system', 'color: #008d7c');

repairIntrinsics({
  evalTaming: 'unsafeEval',
  stackFiltering: 'verbose',
  errorTaming: 'unsafe',
  consoleTaming: 'unsafe',
});

globalThis.initPluginsRuntime = (context: PenpotContext) => {
  if (context) {
    console.log('%c[PLUGINS] Initialize context', 'color: #008d7c');

    /* eslint-disable */
    globalThis.ɵcontext = context;
    globalThis.ɵloadPlugin = ɵloadPlugin;
    initInstaller();

    setContext(context);

    for (const event of api.validEvents) {
      context.addListener(event, api.triggerEvent.bind(null, event));
    }

    /* eslint-enable */
  }
};
