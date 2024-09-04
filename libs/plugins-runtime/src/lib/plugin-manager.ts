import type { Context, Theme } from '@penpot/plugin-types';

import { getValidUrl, loadManifestCode } from './parse-manifest.js';
import { Manifest } from './models/manifest.model.js';
import { PluginModalElement } from './modal/plugin-modal.js';
import { openUIApi } from './api/openUI.api.js';
import { OpenUIOptions } from './models/open-ui-options.model.js';
import { RegisterListener, DestroyListener } from './models/plugin.model.js';

export async function createPluginManager(
  context: Context,
  manifest: Manifest,
  onCloseCallback: () => void,
  onReloadModal: (code: string) => void
) {
  let code = await loadManifestCode(manifest);

  let loaded = false;
  let destroyed = false;
  let modal: PluginModalElement | null = null;
  let uiMessagesCallbacks: ((message: unknown) => void)[] = [];
  const timeouts = new Set<ReturnType<typeof setTimeout>>();

  const themeChangeId = context.addListener('themechange', (theme: Theme) => {
    modal?.setTheme(theme);
  });

  const listenerId: symbol = context.addListener('finish', () => {
    closePlugin();

    context?.removeListener(listenerId);
  });

  // TODO: Remove when deprecating method `off`
  let listeners: { [key: string]: Map<object, symbol> } = {};

  const removeAllEventListeners = () => {
    context.removeListener(themeChangeId);

    Object.entries(listeners).forEach(([, map]) => {
      map.forEach((id) => {
        destroyListener(id);
      });
    });

    uiMessagesCallbacks = [];
    listeners = {};
  };

  const closePlugin = () => {
    removeAllEventListeners();

    timeouts.forEach(clearTimeout);
    timeouts.clear();

    if (modal) {
      modal.removeEventListener('close', closePlugin);
      modal.remove();
      modal = null;
    }

    destroyed = true;

    onCloseCallback();
  };

  const onLoadModal = async () => {
    if (!loaded) {
      loaded = true;
      return;
    }

    removeAllEventListeners();

    code = await loadManifestCode(manifest);

    onReloadModal(code);
  };

  const openModal = (name: string, url: string, options?: OpenUIOptions) => {
    const theme = context.getTheme() as 'light' | 'dark';

    const modalUrl = getValidUrl(manifest.host, url);

    if (modal?.getAttribute('iframe-src') === modalUrl) {
      return;
    }

    modal = openUIApi(name, modalUrl, theme, options);

    modal.setTheme(theme);

    modal.addEventListener('close', closePlugin, {
      once: true,
    });

    modal.addEventListener('load', onLoadModal);
  };

  const registerMessageCallback = (callback: (message: unknown) => void) => {
    uiMessagesCallbacks.push(callback);
  };

  const registerListener: RegisterListener = (type, callback, props) => {
    const id = context.addListener(
      type,
      (...params) => {
        // penpot has a debounce to run the events, so some events can be triggered after the plugin is closed
        if (destroyed) {
          return;
        }

        callback(...params);
      },
      props
    );

    if (!listeners[type]) {
      listeners[type] = new Map<object, symbol>();
    }
    listeners[type].set(callback, id);
    return id;
  };

  const destroyListener: DestroyListener = (idtype, callback) => {
    let listenerId: symbol | undefined;

    if (typeof idtype === 'symbol') {
      listenerId = idtype;
    } else if (callback) {
      listenerId = listeners[idtype].get(callback);
    }

    if (listenerId) {
      context.removeListener(listenerId);
    }
  };

  return {
    close: closePlugin,
    destroyListener,
    openModal,
    getModal: () => modal,
    registerListener,
    registerMessageCallback,
    sendMessage: (message: unknown) => {
      uiMessagesCallbacks.forEach((callback) => callback(message));
    },
    get manifest() {
      return manifest;
    },
    get context() {
      return context;
    },
    get timeouts() {
      return timeouts;
    },
    get code() {
      return code;
    },
  };
}
