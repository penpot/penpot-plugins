import type { Penpot } from '@penpot/plugin-types';
import type { createPluginManager } from './plugin-manager';
import { createApi } from './api';
import { ses } from './ses.js';

export function createSandbox(
  plugin: Awaited<ReturnType<typeof createPluginManager>>
) {
  ses.hardenIntrinsics();

  const pluginApi = createApi(plugin);

  const publicPluginApi = {
    penpot: ses.harden(pluginApi.penpot) as Penpot,
    fetch: ses.harden((...args: Parameters<typeof fetch>) => {
      const requestArgs: RequestInit = {
        ...args[1],
        credentials: 'omit',
      };

      return fetch(args[0], requestArgs);
    }),
    console: ses.harden(window.console),
    Math: ses.harden(Math),
    setTimeout: ses.harden(
      (...[handler, timeout]: Parameters<typeof setTimeout>) => {
        const timeoutId = setTimeout(() => {
          handler();
        }, timeout);

        plugin.timeouts.add(timeoutId);

        return timeoutId;
      }
    ) as typeof setTimeout,
    clearTimeout: ses.harden((id: ReturnType<typeof setTimeout>) => {
      clearTimeout(id);

      plugin.timeouts.delete(id);
    }),
  };

  const compartment = ses.createCompartment(publicPluginApi);

  return {
    evaluate: () => {
      compartment.evaluate(plugin.code);
    },
    cleanGlobalThis: () => {
      Object.keys(publicPluginApi).forEach((key) => {
        delete compartment.globalThis[key];
      });
    },
    compartment,
  };
}
