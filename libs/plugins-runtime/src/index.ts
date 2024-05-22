import 'ses';
import './lib/modal/plugin-modal';

import {
  ɵloadPlugin,
  setContext,
  ɵloadPluginByUrl,
} from './lib/load-plugin.js';
import * as api from './lib/api/index.js';
import type { PenpotContext } from '@penpot/plugin-types';

console.log('%c[PLUGINS] Loading plugin system', 'color: #008d7c');

repairIntrinsics({
  evalTaming: 'unsafeEval',
  stackFiltering: 'verbose',
  errorTaming: 'unsafe',
  consoleTaming: 'unsafe',
});

const globalThisAny$ = globalThis as any;

globalThisAny$.initPluginsRuntime = (context: PenpotContext) => {
  if (context) {
    console.log('%c[PLUGINS] Initialize context', 'color: #008d7c');

    globalThisAny$.ɵcontext = context;
    globalThis.ɵloadPlugin = ɵloadPlugin;
    globalThis.ɵloadPluginByUrl = ɵloadPluginByUrl;

    setContext(context);

    for (const event of api.validEvents) {
      context.addListener(event, api.triggerEvent.bind(null, event));
    }
  }
};
