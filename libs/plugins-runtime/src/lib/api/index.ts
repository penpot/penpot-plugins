import type { Penpot, EventsMap } from '@penpot/plugin-types';

import { Manifest, Permissions } from '../models/manifest.model';
import { OpenUIOptions } from '../models/open-ui-options.model';
import { setModalTheme } from '../create-modal';
import openUIApi from './openUI.api';
import z from 'zod';

type Callback<T> = (message: T) => void;

export const validEvents = [
  'pagechange',
  'filechange',
  'selectionchange',
  'themechange',
] as const;

export let uiMessagesCallbacks: Callback<unknown>[] = [];

let modal: HTMLElement | null = null;

const eventListeners: Map<string, Callback<unknown>[]> = new Map();

window.addEventListener('message', (event) => {
  for (const callback of uiMessagesCallbacks) {
    callback(event.data);
  }
});

export function triggerEvent(
  type: keyof EventsMap,
  message: EventsMap[keyof EventsMap]
) {
  if (type === 'themechange' && modal) {
    setModalTheme(modal, message);
  }
  const listeners = eventListeners.get(type) || [];
  listeners.forEach((listener) => listener(message));
}

export function createApi(context: PenpotContext, manifest: Manifest) {
  const closePlugin = () => {
    modal?.removeEventListener('close', closePlugin);
    if (modal) {
      modal.remove();
    }
    uiMessagesCallbacks = [];
    modal = null;
  };

  const checkPermission = (permission: Permissions) => {
    if (!manifest.permissions.includes(permission)) {
      throw new Error(`Permission ${permission} is not granted`);
    }
  };

  const penpot: Penpot = {
    ui: {
      open: (name: string, url: string, options: OpenUIOptions) => {
        const theme = context.getTheme() as 'light' | 'dark';
        modal = openUIApi(name, url, theme, options);
        setModalTheme(modal, theme);

        modal.addEventListener('close', closePlugin, {
          once: true,
        });
      },

      sendMessage(message: unknown) {
        const event = new CustomEvent('message', {
          detail: message,
        });

        modal?.dispatchEvent(event);
      },

      onMessage: <T>(callback: (message: T) => void) => {
        z.function().parse(callback);
        uiMessagesCallbacks.push(callback as Callback<unknown>);
      },
    },

    log: console.log,

    setTimeout: z
      .function()
      .args(z.function(), z.number())
      .implement((callback, time) => {
        setTimeout(callback, time);
      }),

    closePlugin,

    on<T extends keyof EventsMap>(
      type: T,
      callback: (event: EventsMap[T]) => void
    ): void {
      // z.function alter fn, so can't use it here
      z.enum(validEvents).parse(type);
      z.function().parse(callback);

      if (type === 'pagechange') {
        checkPermission('page:read');
      } else if (type === 'filechange') {
        checkPermission('file:read');
      } else if (type === 'selectionchange') {
        checkPermission('selection:read');
      }

      const listeners = eventListeners.get(type) || [];
      listeners.push(callback as Callback<unknown>);
      eventListeners.set(type, listeners);
    },

    off<T extends keyof EventsMap>(
      type: T,
      callback: (event: EventsMap[T]) => void
    ): void {
      z.enum(validEvents).parse(type);
      z.function().parse(callback);

      const listeners = eventListeners.get(type) || [];

      eventListeners.set(
        type,
        listeners.filter((listener) => listener !== callback)
      );
    },

    // Penpot State API
    getFile(): PenpotFile {
      checkPermission('file:read');
      return context.getFile();
    },

    getCurrentPage(): PenpotPage {
      checkPermission('page:read');
      return context.getCurrentPage();
    },

    getPage(): PenpotPage {
      checkPermission('page:read');
      return context.getPage();
    },

    getSelected(): string[] {
      checkPermission('selection:read');
      return context.getSelected();
    },

    getSelectedShapes(): PenpotShape[] {
      checkPermission('selection:read');
      return context.getSelectedShapes();
    },

    getTheme(): PenpotTheme {
      return context.getTheme();
    },

    fetch,
  };

  return penpot;
}
