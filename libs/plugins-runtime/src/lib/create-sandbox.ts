import type { Penpot } from '@penpot/plugin-types';
import type { createPluginManager } from './plugin-manager';
import { createApi } from './api';
import { ses } from './ses.js';
export function createSandbox(
  plugin: Awaited<ReturnType<typeof createPluginManager>>
) {
  ses.hardenIntrinsics();

  const pluginApi = createApi(plugin);

  const safeHandler = {
    get(target: Penpot, prop: string, receiver: unknown) {
      const originalValue = Reflect.get(target, prop, receiver);

      if (typeof originalValue === 'function') {
        return function (...args: unknown[]) {
          const result = originalValue.apply(target, args);

          return ses.safeReturn(result);
        };
      }

      return ses.safeReturn(originalValue);
    },
  };

  const proxyApi = new Proxy(pluginApi.penpot, safeHandler);

  const safeFetch = (url: string, options: RequestInit) => {
    const sanitizedOptions: RequestInit = {
      ...options,
      credentials: 'omit',
      headers: {
        ...options?.headers,
        Authorization: '',
      },
    };

    return fetch(url, sanitizedOptions).then((response) => {
      const safeResponse = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        text: response.text.bind(response),
        json: response.json.bind(response),
      };

      return ses.safeReturn(safeResponse);
    });
  };

  const publicPluginApi = {
    penpot: proxyApi,
    fetch: ses.harden(safeFetch),
    console: ses.harden(window.console),
    Math: ses.harden(Math),
    setTimeout: ses.harden(
      (...[handler, timeout]: Parameters<typeof setTimeout>) => {
        const timeoutId = setTimeout(() => {
          handler();
        }, timeout);

        plugin.timeouts.add(timeoutId);

        return ses.safeReturn(timeoutId);
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
