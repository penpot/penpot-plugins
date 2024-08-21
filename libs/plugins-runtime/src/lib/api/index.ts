import type {
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
  PenpotEllipse,
  PenpotPath,
  PenpotBoolType,
  PenpotBool,
  PenpotUser,
  PenpotActiveUser,
  PenpotFontsContext,
  PenpotSvgRaw,
  PenpotColor,
  PenpotColorShapeInfo,
  PenpotHistoryContext,
} from '@penpot/plugin-types';

import { Permissions } from '../models/manifest.model.js';
import { OpenUIOptions } from '../models/open-ui-options.model.js';
import { z } from 'zod';
import { createPluginManager } from '../plugin-manager.js';

export const validEvents = [
  'finish',
  'pagechange',
  'filechange',
  'selectionchange',
  'themechange',
  'shapechange',
  'contentsave',
] as const;

export function createApi(
  plugin: Awaited<ReturnType<typeof createPluginManager>>
) {
  const checkPermission = (permission: Permissions) => {
    if (!plugin.manifest.permissions.includes(permission)) {
      throw new Error(`Permission ${permission} is not granted`);
    }
  };

  const penpot: Penpot = {
    ui: {
      open: (name: string, url: string, options?: OpenUIOptions) => {
        plugin.openModal(name, url, options);
      },

      sendMessage(message: unknown) {
        const event = new CustomEvent('message', {
          detail: message,
        });

        plugin.getModal()?.dispatchEvent(event);
      },

      onMessage: <T>(callback: (message: T) => void) => {
        z.function().parse(callback);

        plugin.registerMessageCallback(callback as (message: unknown) => void);
      },
    },

    utils: {
      geometry: {
        center(shapes: PenpotShape[]) {
          return (window as any).app.plugins.public_utils.centerShapes(shapes);
        },
      },
      types: {
        isFrame(shape: PenpotShape): shape is PenpotFrame {
          return shape.type === 'frame';
        },
        isGroup(shape: PenpotShape): shape is PenpotGroup {
          return shape.type === 'group';
        },
        isMask(shape: PenpotShape): shape is PenpotGroup {
          return shape.type === 'group' && shape.isMask();
        },
        isBool(shape: PenpotShape): shape is PenpotBool {
          return shape.type === 'bool';
        },
        isRectangle(shape: PenpotShape): shape is PenpotRectangle {
          return shape.type === 'rect';
        },
        isPath(shape: PenpotShape): shape is PenpotPath {
          return shape.type === 'path';
        },
        isText(shape: PenpotShape): shape is PenpotText {
          return shape.type === 'text';
        },
        isEllipse(shape: PenpotShape): shape is PenpotEllipse {
          return shape.type === 'circle';
        },
        isSVG(shape: PenpotShape): shape is PenpotSvgRaw {
          return shape.type === 'svg-raw';
        },
      },
    },

    closePlugin: () => {
      plugin.close();
    },
    on<T extends keyof EventsMap>(
      type: T,
      callback: (event: EventsMap[T]) => void,
      props?: { [key: string]: unknown }
    ): symbol {
      // z.function alter fn, so can't use it here
      z.enum(validEvents).parse(type);
      z.function().parse(callback);

      // To suscribe to events needs the read permission
      checkPermission('content:read');

      return plugin.registerListener(type, callback, props);
    },

    off<T extends keyof EventsMap>(
      idtype: symbol | T,
      callback?: (event: EventsMap[T]) => void
    ): void {
      plugin.destroyListener(idtype, callback);
    },

    // Penpot State API

    get root(): PenpotShape {
      checkPermission('content:read');
      return plugin.context.root;
    },

    get currentPage(): PenpotPage {
      checkPermission('content:read');
      return plugin.context.currentPage;
    },

    get selection(): PenpotShape[] {
      checkPermission('content:read');
      return plugin.context.selection;
    },

    set selection(value: PenpotShape[]) {
      checkPermission('content:read');
      plugin.context.selection = value;
    },

    get viewport(): PenpotViewport {
      return plugin.context.viewport;
    },

    get history(): PenpotHistoryContext {
      return plugin.context.history;
    },

    get library(): PenpotLibraryContext {
      checkPermission('library:read');
      return plugin.context.library;
    },

    get fonts(): PenpotFontsContext {
      checkPermission('content:read');
      return plugin.context.fonts;
    },

    get currentUser(): PenpotUser {
      checkPermission('user:read');
      return plugin.context.currentUser;
    },

    get activeUsers(): PenpotActiveUser[] {
      checkPermission('user:read');
      return plugin.context.activeUsers;
    },

    getFile(): PenpotFile | null {
      checkPermission('content:read');
      return plugin.context.getFile();
    },

    getPage(): PenpotPage | null {
      checkPermission('content:read');
      return plugin.context.getPage();
    },

    getSelected(): string[] {
      checkPermission('content:read');
      return plugin.context.getSelected();
    },

    getSelectedShapes(): PenpotShape[] {
      checkPermission('content:read');
      return plugin.context.getSelectedShapes();
    },

    shapesColors(
      shapes: PenpotShape[]
    ): (PenpotColor & PenpotColorShapeInfo)[] {
      checkPermission('content:read');
      return plugin.context.shapesColors(shapes);
    },

    replaceColor(
      shapes: PenpotShape[],
      oldColor: PenpotColor,
      newColor: PenpotColor
    ) {
      checkPermission('content:write');
      return plugin.context.replaceColor(shapes, oldColor, newColor);
    },

    getTheme(): PenpotTheme {
      return plugin.context.getTheme();
    },

    createFrame(): PenpotFrame {
      checkPermission('content:write');
      return plugin.context.createFrame();
    },

    createRectangle(): PenpotRectangle {
      checkPermission('content:write');
      return plugin.context.createRectangle();
    },

    createEllipse(): PenpotEllipse {
      checkPermission('content:write');
      return plugin.context.createEllipse();
    },

    createText(text: string): PenpotText | null {
      checkPermission('content:write');
      return plugin.context.createText(text);
    },

    createPath(): PenpotPath {
      checkPermission('content:write');
      return plugin.context.createPath();
    },

    createBoolean(
      boolType: PenpotBoolType,
      shapes: PenpotShape[]
    ): PenpotBool | null {
      checkPermission('content:write');
      return plugin.context.createBoolean(boolType, shapes);
    },

    createShapeFromSvg(svgString: string): PenpotGroup | null {
      checkPermission('content:write');
      return plugin.context.createShapeFromSvg(svgString);
    },

    group(shapes: PenpotShape[]): PenpotGroup | null {
      checkPermission('content:write');
      return plugin.context.group(shapes);
    },

    ungroup(group: PenpotGroup, ...other: PenpotGroup[]): void {
      checkPermission('content:write');
      plugin.context.ungroup(group, ...other);
    },

    uploadMediaUrl(name: string, url: string) {
      checkPermission('content:write');
      return plugin.context.uploadMediaUrl(name, url);
    },

    uploadMediaData(name: string, data: Uint8Array, mimeType: string) {
      checkPermission('content:write');
      return plugin.context.uploadMediaData(name, data, mimeType);
    },

    generateMarkup(
      shapes: PenpotShape[],
      options?: { type?: 'html' | 'svg' }
    ): string {
      checkPermission('content:read');
      return plugin.context.generateMarkup(shapes, options);
    },

    generateStyle(
      shapes: PenpotShape[],
      options?: {
        type?: 'css';
        withPrelude?: boolean;
        includeChildren?: boolean;
      }
    ): string {
      checkPermission('content:read');
      return plugin.context.generateStyle(shapes, options);
    },

    openViewer(): void {
      checkPermission('content:read');
      plugin.context.openViewer();
    },

    createPage(): PenpotPage {
      checkPermission('content:write');
      return plugin.context.createPage();
    },

    openPage(page: PenpotPage): void {
      checkPermission('content:read');
      plugin.context.openPage(page);
    },
  };

  return {
    penpot,
  };
}
