export interface PenpotPage {
  name: string;
  id: string;

  findShapes(): PenpotShape[];
}

export interface PenpotFile {
  name: string;
  id: string;
  revn: number;
}

export interface EventsMap {
  pagechange: PenpotPage;
  filechange: PenpotFile;
  selectionchange: string[];
  themechange: PenpotTheme;
}

export type PenpotTheme = 'light' | 'dark';

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
  getFile: () => PenpotFile | null;
  getPage: () => PenpotPage | null;
  getCurrentPage: () => PenpotPage | null;
  getSelected: () => string[];
  getTheme: () => PenpotTheme;
  fetch: typeof fetch;
}

declare global {
  const penpot: Penpot;
}
