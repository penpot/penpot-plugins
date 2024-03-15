const closeSvg = `
<svg width="16"  height="16"xmlns="http://www.w3.org/2000/svg" fill="none"><g class="fills"><rect rx="0" ry="0" width="16" height="16" class="frame-background"/></g><g class="frame-children"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" class="fills"/><g class="strokes"><path d="M11.997 3.997 8 8l-3.997 4.003m-.006-8L8 8l4.003 3.997" style="fill: none; stroke-width: 1; stroke: rgb(143, 157, 163); stroke-opacity: 1; stroke-linecap: round;" class="stroke-shape"/></g></g></svg>`;

export class PluginModalElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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

    this.shadowRoot.appendChild(header);
    this.shadowRoot.appendChild(iframe);

    const style = document.createElement('style');
    style.textContent = `
        :host {
          display: flex;
          flex-direction: column;
          position: fixed;
          inset-block-end: 10px;
          inset-inline-start: 10px;
          z-index: 1000;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          inline-size: ${width}px;
          block-size: ${height}px;
        }

        :host([data-theme="dark"]) {
          background: #2e3434;
          border: 1px solid #2e3434;
          color: #ffffff;
        }

        :host([data-theme="light"]) {
          background: #ffffff;
          border: 1px solid #eef0f2;
          color: #18181a;
        }

        .header {
          display: flex;
          justify-content: space-between;
        }

        button {
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        h1 {
          font-family: Arial, sans-serif;
          margin: 0;
          margin-block-end: 10px;
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
