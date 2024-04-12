export declare global {
  declare namespace globalThis {
    function ɵloadPlugin(cofig: PluginConfig): Promise<void>;
  }

  interface PenpotContext {
    getFile(): PenpotFile;
    getCurrentPage(): PenpotPage;
    getPage(): PenpotPage;
    getSelected(): string[];
    getTheme(): PenpotTheme;
  }
}
