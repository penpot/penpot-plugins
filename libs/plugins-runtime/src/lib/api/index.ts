import { OpenUIOptions } from '../models/open-ui-options.model';
import openUIApi from './openUI.api';
import z from 'zod';

type Callback<T> = (message: T) => void;

const validEvents = ['pagechange', 'filechange', 'selectionchange'] as const;

let uiMessagesCallbacks: Callback<unknown>[] = [];

let modal: HTMLElement | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pageState = {} as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fileState = {} as any;

let selection: null | string = null;

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

export function setPageState(page: Page) {
  pageState = page;

  triggerEvent('pagechange', page);
}

export function setFileState(file: File) {
  fileState = file;

  triggerEvent('filechange', file);
}

export function setSelection(selectionId: string) {
  if (selectionId === selection) {
    return;
  }

  selection = selectionId;

  triggerEvent('selectionchange', selectionId);
}

export function createApi() {
  const closePlugin = () => {
    if (modal) {
      modal.remove();
    }

    uiMessagesCallbacks = [];
    modal = null;
  };

  const penpot: Penpot = {
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
      return fileState;
    },
    getPageState: () => {
      return pageState;
    },
    getSelection: () => {
      return selection;
    },
  } as const;

  return penpot;
}
