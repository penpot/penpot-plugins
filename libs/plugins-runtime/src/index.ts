import 'ses';
import './lib/plugin-modal';
import { initInstaller } from './lib/installer';

import { ɵloadPlugin, setContext } from './lib/load-plugin';
import * as api from './lib/api';

console.log('%c[PLUGINS] Loading plugin system', 'color: #008d7c');

repairIntrinsics({
  evalTaming: 'unsafeEval',
  consoleTaming: import.meta.env.MODE === 'development' ? 'unsafe' : 'safe',
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
