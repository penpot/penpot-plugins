import type {
  PenpotContext,
  Penpot,
  EventsMap,
  PenpotPage,
  PenpotShape,
  PenpotRectangle,
  PenpotFrame,
  PenpotGroup,
  PenpotViewport,
  PenpotText,
  PenpotFile,
  PenpotTheme,
  PenpotLibraryContext,
} from '@penpot/plugin-types';

import { Manifest, Permissions } from '../models/manifest.model.js';
import { OpenUIOptions } from '../models/open-ui-options.model.js';
import openUIApi from './openUI.api.js';
import { z } from 'zod';
import type { PluginModalElement } from '../modal/plugin-modal.js';
import { getValidUrl } from '../parse-manifest.js';

type Callback<T> = (message: T) => void;

export const validEvents = [
  'pagechange',
  'filechange',
  'selectionchange',
  'themechange',
] as const;

export let uiMessagesCallbacks: Callback<unknown>[] = [];

let modal: PluginModalElement | null = null;

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
    modal.setTheme(message as PenpotTheme);
  }
  const listeners = eventListeners.get(type) || [];
  listeners.forEach((listener) => listener(message));
}

export function createApi(context: PenpotContext, manifest: Manifest): Penpot {
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

        modal = openUIApi(
          name,
          getValidUrl(manifest.host, url),
          theme,
          options
        );

        modal.setTheme(theme);

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

    utils: {
      types: {
        isText(shape: PenpotShape): shape is PenpotText {
          return shape.type === 'text';
        },
        isRectangle(shape: PenpotShape): shape is PenpotRectangle {
          return shape.type === 'rect';
        },
        isFrame(shape: PenpotShape): shape is PenpotFrame {
          return shape.type === 'frame';
        },
      },
    },

    setTimeout: z
      .function()
      .args(z.function(), z.number())
      .implement((callback: Callback<unknown>, time: number) => {
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

    get root(): PenpotShape {
      checkPermission('page:read');
      return context.root;
    },

    get currentPage(): PenpotPage {
      checkPermission('page:read');
      return context.currentPage;
    },

    get selection(): PenpotShape[] {
      checkPermission('selection:read');
      return context.selection;
    },

    get viewport(): PenpotViewport {
      // checkPermission('viewport:read');
      return context.viewport;
    },

    get library(): PenpotLibraryContext {
      // checkPermission('library:read');
      return context.library;
    },

    getFile(): PenpotFile | null {
      checkPermission('file:read');
      return context.getFile();
    },

    getPage(): PenpotPage | null {
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

    createFrame(): PenpotFrame {
      // checkPermission('page:write');
      return context.createFrame();
    },

    createRectangle(): PenpotRectangle {
      // checkPermission('page:write');
      return context.createRectangle();
    },

    createText(text: string): PenpotText {
      // checkPermission('page:write');
      return context.createText(text);
    },

    createShapeFromSvg(svgString: string): PenpotGroup {
      // checkPermission('page:write');
      return context.createShapeFromSvg(svgString);
    },

    uploadMediaUrl(name: string, url: string) {
      return context.uploadMediaUrl(name, url);
    },
  };

  return penpot;
}
