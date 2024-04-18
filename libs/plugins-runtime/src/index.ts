import 'ses';
import './lib/plugin-modal';
import { initInstaller } from './lib/installer';

import { ɵloadPlugin, setContext } from './lib/load-plugin';
import * as api from './lib/api';

console.log('Loading plugin system');

repairIntrinsics({
  evalTaming: 'unsafeEval',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.initPluginsRuntime = (context: PenpotContext) => {
  if (context) {
    console.log('Initialize context');

    globalThis.ɵcontext = context;
    globalThis.ɵloadPlugin = ɵloadPlugin;
    initInstaller();

    /* eslint-disable */
    setContext(context);

    for (const event of api.validEvents) {
      context.addListener(event, api.triggerEvent.bind(null, event));
    }

    /* eslint-enable */
  }
}
