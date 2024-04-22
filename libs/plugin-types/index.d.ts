export interface PenpotFile {
  id: string;
  name: string;
  revn: number;
}

export interface PenpotPage {
  id: string;
  name: string;
  getShapeById(id: string): PenpotShape | null;
  findShapes(): PenpotShape[];
}

export interface PenpotFill {
  fillColor: string;
  fillOpacity: number;
}

export interface PenpotShape {
  id: string;
  name: string;
  type: 'frame' | 'group' | 'bool' | 'rect' | 'path' | 'text' | 'circle' | 'svg-raw' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  children: PenpotShape[];
  fills: PenpotFill[];
  strokes: PenpotStroke[];
  resize(width: number, height: number);
}

export interface PenpotText extends PenpotShape {
  type: 'text';
  characters: string;
}

export interface EventsMap {
  pagechange: PenpotPage;
  filechange: PenpotFile;
  selectionchange: string[];
  themechange: PenpotTheme;
}

export type PenpotTheme = 'light' | 'dark';

export interface PenpotContext {
  root: PenpotShape;
  currentPage: PenpotPage;
  selection: PenpotShape[];

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  getFile(): PenpotFile | null;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  getPage(): PenpotPage | null;
  getSelected(): string[];
  getSelectedShapes(): PenpotShape[];
  getTheme(): PenpotTheme;

  createRectangle(): PenpotShape;
}

export interface Penpot {
  ui: {
    open: (
      name: string,
      url: string,
      options: { width: number; height: number }
    ) => void;
    sendMessage: (message: unknown) => void;
    onMessage: <T>(callback: (message: T) => void) => void;
  };
  log: (...data: unknown[]) => void;
  setTimeout: (callback: () => void, time: number) => void;
  closePlugin: () => void;
  on: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;
  off: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;

  fetch: typeof fetch;

  // Exposes Penpot Context
  root: PenpotShape;
  currentPage: PenpotPage;
  selection: PenpotShape[];

  getFile(): PenpotFile | null;
  getPage(): PenpotPage | null;
  getSelected(): string[];
  getSelectedShapes(): PenpotShape[];
  getTheme(): PenpotTheme;

  createRectangle(): PenpotShape;
}

declare global {
  const penpot: Penpot;
}
