import { setModalTheme } from '../create-modal';
import { Manifest, Permissions } from '../models/manifest.model';
import { OpenUIOptions } from '../models/open-ui-options.model';
import type {
  Penpot,
  EventsMap,
  FileState,
  PageState,
  Theme,
} from '@penpot/plugin-types';
import openUIApi from './openUI.api';
import z from 'zod';

type Callback<T> = (message: T) => void;

const validEvents = [
  'pagechange',
  'filechange',
  'selectionchange',
  'themechange',
] as const;

export let uiMessagesCallbacks: Callback<unknown>[] = [];

let modal: HTMLElement | null = null;

let pageState: PageState | null = null;
let fileState: FileState | null = null;
let selection: string[] = [];
let themeState: Theme = 'dark';

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
  const listeners = eventListeners.get(type) || [];
  listeners.forEach((listener) => listener(message));
}

export function setPageState(page: PageState) {
  pageState = page;

  triggerEvent('pagechange', page);
}

export function setFileState(file: FileState) {
  fileState = file;

  triggerEvent('filechange', file);
}

export function setSelection(selectionId: string[]) {
  if (JSON.stringify(selectionId) === JSON.stringify(selection)) {
    return;
  }

  selection = selectionId;

  triggerEvent('selectionchange', selectionId);
}

export function setTheme(theme: Theme) {
  if (themeState === theme) {
    return;
  }

  themeState = theme;

  if (modal) {
    setModalTheme(modal, themeState);
  }

  triggerEvent('themechange', theme);
}

export function createApi(manifest: Manifest) {
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
        modal = openUIApi(name, url, themeState, options);

        modal.addEventListener('close', closePlugin, {
          once: true,
        });
      },
      sendMessage: (message: unknown) => {
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
    getFileState: () => {
      checkPermission('file:read');

      return fileState;
    },
    getPageState: () => {
      checkPermission('page:read');

      return pageState;
    },
    getSelection: () => {
      checkPermission('selection:read');

      return selection;
    },
    getTheme: () => {
      return themeState;
    },
    fetch,
  };

  return penpot;
}
