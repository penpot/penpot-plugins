import { PenpotShape } from '@penpot/plugin-types';

export interface InitPluginUIEvent {
  type: 'ready';
}

export type PluginUIEvent = InitPluginUIEvent;

export interface InitPluginEvent {
  type: 'init';
  content: {
    theme: string;
    selection: PenpotShape[];
  };
}
export interface SelectionPluginEvent {
  type: 'selection';
  content: PenpotShape[];
}

export interface ThemePluginEvent {
  type: 'theme';
  content: string;
}

export type PluginMessageEvent =
  | InitPluginEvent
  | SelectionPluginEvent
  | ThemePluginEvent;
