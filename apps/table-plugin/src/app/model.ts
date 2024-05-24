export interface InitPluginEvent {
  type: 'init';
  content: {
    theme: string;
  };
}

export interface TablePluginEvent {
  type: 'table';
  content: {
    import?: string[][];
    new?: Cell;
    type: 'new' | 'import';
    options: TableOptions;
  };
}

export interface ThemePluginEvent {
  type: 'theme';
  content: string;
}

export type PluginMessageEvent =
  | InitPluginEvent
  | TablePluginEvent
  | ThemePluginEvent;

export type Cell = { column: number; row: number };

export type TableOptions = {
  filledHeaderRow: boolean;
  filledHeaderColumn: boolean;
  borders: boolean;
  alternateRows: boolean;
};
