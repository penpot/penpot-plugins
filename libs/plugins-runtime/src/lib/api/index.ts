import { OpenUIOptions } from '../models/open-ui-options.model';
import openUIApi from './openUI.api';
import z from 'zod';

type Callback<T> = (message: T) => void;

const validEvents = ['pagechange', 'filechange'] as const;

let uiMessagesCallbacks: Callback<unknown>[] = [];

let modal: HTMLElement | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pageState = {} as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fileState = {} as any;

const eventListeners: Map<string, Callback<unknown>[]> = new Map();

window.addEventListener('message', (event) => {
  for (const callback of uiMessagesCallbacks) {
    callback(event.data);
  }
});

export function triggerEvent<T>(type: string, message: T) {
  const listeners = eventListeners.get(type) || [];
  listeners.forEach((listener) => listener(message));
}

export function setPageState(page: unknown) {
  pageState = page;

  triggerEvent('pagechange', page);
}

export function setFileState(file: unknown) {
  fileState = file;

  triggerEvent('filechange', file);
}

export function createApi() {
  const closePlugin = () => {
    if (modal) {
      modal.remove();
    }

    uiMessagesCallbacks = [];
    modal = null;
  };

  const penpot = {
    ui: {
      open: (name: string, url: string, options: OpenUIOptions) => {
        modal = openUIApi(name, url, options);

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
      onMessage: z
        .function()
        .args(z.function())
        .implement((callback) => {
          uiMessagesCallbacks.push(callback);
        }),
    },
    log: console.log,
    setTimeout: z
      .function()
      .args(z.function(), z.number())
      .implement((callback, time) => {
        setTimeout(callback, time);
      }),
    closePlugin,
    on: (type: string, fn: Callback<unknown>) => {
      // z.function alter fn, so can't use it here
      z.enum(validEvents).parse(type);
      z.function().parse(fn);

      const listeners = eventListeners.get(type) || [];

      listeners.push(fn);
      eventListeners.set(type, listeners);
    },
    off: (type: string, fn: () => void) => {
      z.enum(validEvents).parse(type);
      z.function().parse(fn);

      const listeners = eventListeners.get(type) || [];

      eventListeners.set(
        type,
        listeners.filter((listener) => listener !== fn)
      );
    },
    getFileState: () => {
      return fileState;
    },
    getPageState: () => {
      return pageState;
    },
  };

  return penpot;
}
