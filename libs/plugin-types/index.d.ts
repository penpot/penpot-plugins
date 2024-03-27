export interface PageState {
  name: string;
  id: string;
}

export interface FileState {
  name: string;
  id: string;
  revn: number;
}

export interface EventsMap {
  pagechange: PageState;
  filechange: FileState;
  selectionchange: string[];
  themechange: Theme;
}

export type Theme = 'light' | 'dark';

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
  getFileState: () => FileState | null;
  getPageState: () => PageState | null;
  getSelection: () => string[];
  getTheme: () => Theme;
  fetch: typeof fetch;
}

declare global {
  const penpot: Penpot;
}
