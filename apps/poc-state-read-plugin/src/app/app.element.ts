/* eslint-disable */
import 'plugins-styles/lib/styles.css';
import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];
  #selection = [];
  #pageId = null;
  #fileId = null;
  #revn = 0;

  #nameSubmit = null;
  #nameInput = null;

  refreshPage(pageId: string, name: string) {
    const projectName = document.getElementById('project-name');
    this.#pageId = pageId;

    if (projectName) {
      projectName.innerText = name;
    }
  }

  refreshSelection(selection: PenpotShape[]) {
    this.#selection = selection;
    if (selection && selection.length > 0) {
      this.#nameInput.value = this.#selection[0].name;
    } else {
      this.#nameInput.value = "";
    }
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="wrapper">
      <h1>Test area!</h1>

      <p>Current project name: <span id="project-name">Unknown</span></p>

      <div class="name-wrap">
         <label>Selected Shape: </label>
         <input id="name-input" type="text"></input>
         <button id="name-submit" type="button">Update</button>
      </div>
      <p>
        <button type="button" data-appearance="primary" data-variant="destructive" class="act-close-plugin">Close plugin</button>
      </p>
    </div>
      `;

    this.#nameSubmit = document.getElementById<HTMLElement>('name-submit');
    this.#nameInput = document.getElementById<HTMLElement>('name-input');

    window.addEventListener('message', (event) => {
      if (event.data.type === 'file') {
        this.#fileId = event.data.content.id;
        this.#revn = event.data.content.revn;
      } else if (event.data.type === 'page') {
        this.refreshPage(event.data.content.page.id, event.data.content.page.name);
      } else if (event.data.type === 'selection') {
        this.refreshSelection(event.data.content.selection);
      } else if (event.data.type === 'init') {
        this.#fileId = event.data.content.fileId;
        this.#revn = event.data.content.revn;
        this.refreshPage(event.data.content.pageId, event.data.content.name);
        this.refreshSelection(event.data.content.selection);
        this.setAttribute('data-theme', event.data.content.theme);
      } else if (event.data.type === 'theme') {
        this.setAttribute('data-theme', event.data.content);
      }
    });

    const closeAction = this.querySelector<HTMLElement>('.act-close-plugin');
    closeAction?.addEventListener('click', () => {
      parent.postMessage({ content: 'close' }, '*');
    });

    parent.postMessage({ content: 'ready' }, '*');

    console.log(this.#nameSubmit);
    this.#nameSubmit?.addEventListener('click', (e) => {
      const id = this.#selection[0].id;
      const name = this.#nameInput.value;
      parent.postMessage({ content: 'change-name', data: { id, name } }, '*');
    });
  }
}
customElements.define('app-root', AppElement);
