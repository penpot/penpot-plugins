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
    closeButton.textContent = '❌';
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
          background: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          inline-size: ${width}px;
          block-size: ${height}px;
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
          color: #000;
          font-family: Arial, sans-serif;
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
