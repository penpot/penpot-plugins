const closeSvg = `
<svg width="16"  height="16"xmlns="http://www.w3.org/2000/svg" fill="none"><g class="fills"><rect rx="0" ry="0" width="16" height="16" class="frame-background"/></g><g class="frame-children"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" class="fills"/><g class="strokes"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" style="fill: none; stroke-width: 1; stroke: rgb(143, 157, 163); stroke-opacity: 1; stroke-linecap: round;" class="stroke-shape"/></g></g></svg>`;

import type { Theme } from '@penpot/plugin-types';
import { dragHandler } from '../drag-handler.js';
import modalCss from './plugin.modal.css?inline';

export class PluginModalElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  #wrapper: HTMLElement | null = null;
  #dragEvents: ReturnType<typeof dragHandler> | null = null;

  setTheme(theme: Theme) {
    if (this.#wrapper) {
      this.#wrapper.setAttribute('data-theme', theme);
    }
  }

  disconnectedCallback() {
    this.#dragEvents?.();
  }

  calculateZIndex() {
    const modals = document.querySelectorAll<HTMLElement>('plugin-modal');

    const zIndexModals = Array.from(modals)
      .filter((modal) => modal !== this)
      .map((modal) => {
        return Number(modal.style.zIndex);
      });

    const maxZIndex = Math.max(...zIndexModals, 0);

    this.style.zIndex = (maxZIndex + 1).toString();
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
    this.#wrapper.style.inlineSize = `${width}px`;
    this.#wrapper.style.blockSize = `${height}px`;

    // move modal to the top
    this.#dragEvents = dragHandler(this.#wrapper, () => {
      this.calculateZIndex();
    });

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

    iframe.addEventListener('load', () => {
      this.shadowRoot?.dispatchEvent(
        new CustomEvent('load', {
          composed: true,
          bubbles: true,
        })
      );
    });

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
    style.textContent = modalCss;

    this.shadowRoot.appendChild(style);

    this.calculateZIndex();
  }
}

customElements.define('plugin-modal', PluginModalElement);
