/* eslint-disable */
import 'plugins-styles/lib/styles.css';
import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];
  #selection = '';
  #pageId = '';
  #fileId = '';
  #revn = 0;

  refreshPage(pageId: string, name: string) {
    console.log('refreshPage', pageId, name);

    const projectName = document.getElementById('project-name');
    this.#pageId = pageId;

    if (projectName) {
      projectName.innerText = name;
    }
  }

  refreshSelectionId(selection: string[]) {
    this.#selection = selection;

    const selectionId = document.getElementById('selection-id');

    if (selectionId) {
      console.log(this.#selection);
      selectionId.innerText = [...this.#selection].join(",");
    }
  }

  connectedCallback() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'file') {
        this.#fileId = event.data.content.id;
        this.#revn = event.data.content.revn;
      } else if (event.data.type === 'page') {
        this.refreshPage(event.data.content.id, event.data.content.name);
      } else if (event.data.type === 'selection') {
        this.refreshSelectionId(event.data.content);
      } else if (event.data.type === 'init') {
        this.#fileId = event.data.content.fileId;
        this.#revn = event.data.content.revn;
        this.refreshPage(event.data.content.pageId, event.data.content.name);
        this.refreshSelectionId(event.data.content.selection);
        this.setAttribute('data-theme', event.data.content.theme);
      } else if (event.data.type === 'theme') {
        this.setAttribute('data-theme', event.data.content);
      }
    });

    this.innerHTML = `
    <div class="wrapper">
      <h1>Test area!</h1>

      <p>Current project name: <span id="project-name">Unknown</span></p>
      <p>Selection id: <span id="selection-id">Unknown</span></p>

      <p>
        <button type="button" data-appearance="primary" data-variant="destructive" class="act-close-plugin">Close plugin</button>
      </p>
    </div>
      `;

    const closeAction = this.querySelector<HTMLElement>('.act-close-plugin');
    closeAction?.addEventListener('click', () => {
      parent.postMessage({ content: 'close' }, '*');
    });

    parent.postMessage({ content: 'ready' }, '*');
  }
}
customElements.define('app-root', AppElement);
