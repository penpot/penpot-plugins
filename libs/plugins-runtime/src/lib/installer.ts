import { loadManifest } from './parse-manifest';
import { ɵloadPlugin } from './load-plugin';

const closeSvg = `
<svg width="16"  height="16"xmlns="http://www.w3.org/2000/svg" fill="none"><g class="fills"><rect rx="0" ry="0" width="16" height="16" class="frame-background"/></g><g class="frame-children"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" class="fills"/><g class="strokes"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" style="fill: none; stroke-width: 1; stroke: rgb(143, 157, 163); stroke-opacity: 1; stroke-linecap: round;" class="stroke-shape"/></g></g></svg>`;

const pasteEventHandler = (event: ClipboardEvent) => {
  const tagName = (event.target as HTMLElement).tagName;

  if (tagName === 'INSTALLER-MODAL') {
    event.stopImmediatePropagation();
  }
};

export class InstallerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  dialog: HTMLDialogElement | null = null;

  createPlugin(pluginName: string, pluginUrl: string) {
    const plugin = document.createElement('li');
    plugin.classList.add('plugin');
    plugin.textContent = pluginName;

    const actions = document.createElement('div');
    actions.classList.add('actions');

    const openButton = document.createElement('button');
    openButton.classList.add('button');
    openButton.textContent = 'Open';
    openButton.type = 'button';
    openButton.addEventListener('click', () => {
      this.closeModal();

      void ɵloadPlugin({
        manifest: pluginUrl,
      });
    });

    actions.appendChild(openButton);

    const removeButton = document.createElement('button');
    removeButton.classList.add('button', 'remove');
    removeButton.textContent = 'Remove';
    removeButton.type = 'button';
    removeButton.addEventListener('click', () => {
      plugin.remove();

      const plugins = this.getPlugins();

      const newPlugins = plugins.filter((p) => p.url !== pluginUrl);

      this.savePlugins(newPlugins);
    });

    actions.appendChild(removeButton);

    plugin.appendChild(actions);

    this.dialog?.querySelector<HTMLElement>('.plugins-list')?.prepend(plugin);
  }

  loadPluginList() {
    const plugins = this.getPlugins();

    for (const plugin of plugins) {
      this.createPlugin(plugin.name, plugin.url);
    }
  }

  getPlugins() {
    const pluginsStorage = localStorage.getItem('plugins');

    if (!pluginsStorage) {
      return [];
    }

    return JSON.parse(pluginsStorage) as {
      name: string;
      url: string;
    }[];
  }

  savePlugins(plugins: { name: string; url: string }[]) {
    localStorage.setItem('plugins', JSON.stringify(plugins));
  }

  submitNewPlugin(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;

    if (!input) {
      return;
    }

    const url = input.value;

    input.value = '';

    void loadManifest(url)
      .then((manifest) => {
        this.createPlugin(manifest.name, url);

        const pluginsStorage = localStorage.getItem('plugins');

        if (!pluginsStorage) {
          localStorage.setItem(
            'plugins',
            JSON.stringify([{ name: manifest.name, url }])
          );
        } else {
          const plugins = this.getPlugins();
          plugins.push({ name: manifest.name, url });

          this.savePlugins(plugins);
        }

        this.error(false);
      })
      .catch((error) => {
        console.error(error);
        this.error(true);
      });
  }

  error(show: boolean) {
    this.dialog?.querySelector('.error')?.classList.toggle('show', show);
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      throw new Error('Error creating shadow root');
    }

    this.dialog = document.createElement('dialog');

    this.dialog.innerHTML = `
      <div class="header">
        <h1>Plugins</h1>
        <button type="button" class="close">${closeSvg}</button>
      </div>
      <form>
        <input class="input url-input" placeholder="Plugin url" autofocus type="url" />
        <button class="button" type="submit">Install</button>
      </form>
      <div class="error">
        Error instaling plugin
      </div>

      <ul class="plugins-list"></ul>
    `;

    this.dialog.querySelector('.close')?.addEventListener('click', () => {
      this.closeModal();
    });

    this.shadowRoot.appendChild(this.dialog);

    this.dialog.addEventListener('submit', (event: Event) => {
      this.submitNewPlugin(event);
    });

    this.loadPluginList();

    const style = document.createElement('style');
    style.textContent = `
    * {
      font-family worksans, sans-serif
    }

    ::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }

    dialog {
      border: 0;
      width: 700px;
      height: 500px;
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      flex-direction: column;
      display: none;
    }

    dialog[open] {
      display: flex;
    }

    .header {
      display: flex;
      justify-content: space-between;
    }

    h1 {
      margin: 0;
      margin-block-end: 10px;
    }

    ul {
      padding: 0;
    }

    li {
      list-style: none;
    }

    .input {
      display: flex;
      border: 1px solid;
      border-radius: calc( 0.25rem * 2);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.4;
      outline: none;
      padding-block: calc( 0.25rem * 2);
      padding-inline: calc( 0.25rem * 2);
      background-color: #f3f4f6;
      border-color: #f3f4f6;
      color: #000;

      &:hover {
        background-color: #eef0f2;
        border-color: #eef0f2;
      }

      &:focus {
        background-color: #ffffff
        border-color: ##6911d4;
      }
    }

    button {
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    .button {
      border: 1px solid transparent;
      font-weight: 500;
      font-size: 12px;
      border-radius: 8px;
      line-height: 1.2;
      padding: 8px 24px 8px 24px;
      text-transform: uppercase;
      background-color: #7EFFF5;
      border: 1px solid 7EFFF5;
      outline: 2px solid transparent;

      &:hover:not(:disabled) {
          cursor: pointer;
      }

      &:focus-visible {
          outline: none;
      }
    }

    .remove {
      background-color: #ff3277;
      border: 1px solid #ff3277;
      outline: 2px solid transparent;
    }

    form {
      display: flex;
      gap: 10px;
      margin-block-end: 20px;
    }

    .url-input {
      inline-size: 400px;
    }

    .plugins-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .plugin {
      display: flex;
      justify-content: space-between;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    .error {
      display: none;
      color: red;

      &.show {
        display: block;
      }
    }
    `;

    this.shadowRoot.appendChild(style);
  }

  closeModal() {
    this.shadowRoot?.querySelector('dialog')?.close();

    window.removeEventListener('paste', pasteEventHandler, true);
  }

  openModal() {
    this.shadowRoot?.querySelector('dialog')?.showModal();

    // prevent paste event in penpot workspace
    window.addEventListener('paste', pasteEventHandler, true);
  }
}

export function initInstaller() {
  customElements.define('installer-modal', InstallerElement);

  const modal = document.createElement('installer-modal');

  document.body.appendChild(modal);

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key.toUpperCase() === 'I' && event.ctrlKey) {
      document.querySelector<InstallerElement>('installer-modal')?.openModal();
    }
  });
}
