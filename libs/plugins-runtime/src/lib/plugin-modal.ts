const closeSvg = `
<svg width="16"  height="16"xmlns="http://www.w3.org/2000/svg" fill="none"><g class="fills"><rect rx="0" ry="0" width="16" height="16" class="frame-background"/></g><g class="frame-children"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" class="fills"/><g class="strokes"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" style="fill: none; stroke-width: 1; stroke: rgb(143, 157, 163); stroke-opacity: 1; stroke-linecap: round;" class="stroke-shape"/></g></g></svg>`;

import type { PenpotTheme } from '@penpot/plugin-types';
import { dragHandler } from './drag-handler.js';

export class PluginModalElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  #wrapper: HTMLElement | null = null;
  #dragEvents: ReturnType<typeof dragHandler> | null = null;

  setTheme(theme: PenpotTheme) {
    if (this.#wrapper) {
      this.#wrapper.setAttribute('data-theme', theme);
    }
  }

  disconnectedCallback() {
    this.#dragEvents?.();
  }

  connectedCallback() {
    const title = this.getAttribute('title');
    const iframeSrc = this.getAttribute('iframe-src');
    const width = Number(this.getAttribute('width') || '300');
    const height = Number(this.getAttribute('height') || '400');

    if (!title || !iframeSrc) {
      throw new Error('title and iframe-src attributes are required');
    }

    if (!this.shadowRoot) {
      throw new Error('Error creating shadow root');
    }

    this.#wrapper = document.createElement('div');
    this.#wrapper.classList.add('wrapper');
    this.#dragEvents = dragHandler(this.#wrapper);

    const header = document.createElement('div');
    header.classList.add('header');

    const h1 = document.createElement('h1');
    h1.textContent = title;

    header.appendChild(h1);

    const closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.innerHTML = `<div class="close">${closeSvg}</div>`;
    closeButton.addEventListener('click', () => {
      if (!this.shadowRoot) {
        return;
      }

      this.shadowRoot.dispatchEvent(
        new CustomEvent('close', {
          composed: true,
          bubbles: true,
        })
      );
    });

    header.appendChild(closeButton);

    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.allow = '';
    iframe.sandbox.add(
      'allow-scripts',
      'allow-forms',
      'allow-modals',
      'allow-popups',
      'allow-popups-to-escape-sandbox',
      'allow-storage-access-by-user-activation'
    );

    this.addEventListener('message', (e: Event) => {
      if (!iframe.contentWindow) {
        return;
      }

      iframe.contentWindow.postMessage((e as CustomEvent).detail, '*');
    });

    this.shadowRoot.appendChild(this.#wrapper);

    this.#wrapper.appendChild(header);
    this.#wrapper.appendChild(iframe);

    const style = document.createElement('style');
    style.textContent = `
        :host {
          --spacing-4: 0.25rem;
          --spacing-8: calc(var(--spacing-4) * 2);
          --spacing-12: calc(var(--spacing-4) * 3);
          --spacing-16: calc(var(--spacing-4) * 4);
          --spacing-20: calc(var(--spacing-4) * 5);
          --spacing-24: calc(var(--spacing-4) * 6);
          --spacing-28: calc(var(--spacing-4) * 7);
          --spacing-32: calc(var(--spacing-4) * 8);
          --spacing-36: calc(var(--spacing-4) * 9);
          --spacing-40: calc(var(--spacing-4) * 10);

          --font-weight-regular: 400;
          --font-weight-bold: 500;
          --font-line-height-s: 1.2;
          --font-line-height-m: 1.4;
          --font-line-height-l: 1.5;
          --font-size-s: 12px;
          --font-size-m: 14px;
          --font-size-l: 16px;
        }

        [data-theme] {
          background-color: var(--color-background-primary);
          color: var(--color-foreground-secondary);
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          position: fixed;
          inset-block-end: 10px;
          inset-inline-start: 10px;
          z-index: 1000;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
          inline-size: ${width}px;
          block-size: ${height}px;
        }

        .header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          border-block-end: 2px solid var(--color-background-quaternary);
          padding-block-end: var(--spacing-4);
          margin-block-end: var(--spacing-20);
        }

        button {
          background: transparent;
          border: 0;
          cursor: pointer;
          padding: 0;
        }

        h1 {
          font-size: var(--font-size-s);
          font-weight: var(--font-weight-bold);
          margin: 0;
          margin-inline-end: var(--spacing-4);
          user-select: none;
        }

        iframe {
          border: none;
          inline-size: 100%;
          block-size: 100%;
        }
    `;

    this.shadowRoot.appendChild(style);
  }
}

customElements.define('plugin-modal', PluginModalElement);
