export interface InitPluginEvent {
  type: 'init';
  content: {
    theme: string;
  };
}
export interface ThemePluginEvent {
  type: 'theme';
  content: string;
}

export interface ReplaceTextPluginEvent {
  type: 'replace-text';
  content: ReplaceText;
}

export type PluginMessageEvent =
  | InitPluginEvent
  | ThemePluginEvent
  | ReplaceTextPluginEvent;

export interface ReplaceText {
  current: string;
  new: string;
}
