/* eslint-disable @typescript-eslint/no-explicit-any */

interface EventsMap {
  pagechange: { name: string };
  filechange: any;
  selectionchange: string;
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
  log: (message: string) => void;
  setTimeout: (callback: () => void, time: number) => void;
  closePlugin: () => void;
  on: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;
  off: (type: string, callback: () => void) => void;
  getFileState: () => any;
  getPageState: () => any;
  getSelection: () => any;
}

declare namespace globalThis {
  const penpot: Penpot;
}
