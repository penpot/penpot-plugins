/* eslint-disable @typescript-eslint/no-explicit-any */

interface Page {
  name: string;
  id: string;
}

interface File {
  name: string;
  id: string;
  revn: number;
}

interface EventsMap {
  pagechange: Page;
  filechange: File;
  selectionchange: string[];
}

interface Penpot {
  ui: {
    open: (
      name: string,
      url: string,
      options: { width: number; height: number }
    ) => void;
    sendMessage: (message: unknown) => void;
    onMessage: <T>(callback: (message: T) => void) => void;
  };
  log: (...data: any[]) => void;
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
  getFileState: () => File | null;
  getPageState: () => Page | null;
  getSelection: () => string | null;
  fetch: typeof fetch;
}

declare namespace globalThis {
  const penpot: Penpot;
}
