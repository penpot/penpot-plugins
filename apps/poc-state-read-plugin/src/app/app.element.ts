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
  #createRectBtn = null;
  #moveXBtn = null;
  #moveYBtn = null;
  #resizeWBtn = null;
  #resizeHBtn = null;
  #loremIpsumBtn = null;

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

  <div class="actions-wrap">
    <button id="create-rect" type="button">+Rect</button>
    <button id="move-x" type="button">Move X</button>
    <button id="move-y" type="button">Move Y</button>
    <button id="resize-w" type="button">Resize W</button>
    <button id="resize-h" type="button">Resize H</button>
    <button id="lorem-ipsum" type="button">Lorem Ipsum</button>
  </div>
  
  <p>
    <button type="button" data-appearance="primary" data-variant="destructive" class="act-close-plugin">Close plugin</button>
  </p>
</div>
    `;

    this.#nameSubmit = document.getElementById<HTMLElement>('name-submit');
    this.#nameInput = document.getElementById<HTMLElement>('name-input');

    this.#createRectBtn = document.getElementById<HTMLElement>('create-rect');
    this.#moveXBtn = document.getElementById<HTMLElement>('move-x');
    this.#moveYBtn = document.getElementById<HTMLElement>('move-y');
    this.#resizeWBtn = document.getElementById<HTMLElement>('resize-w');
    this.#resizeHBtn = document.getElementById<HTMLElement>('resize-h');
    this.#loremIpsumBtn = document.getElementById<HTMLElement>('lorem-ipsum');
    console.log(this.#loremIpsumBtn);

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

    this.#nameSubmit?.addEventListener('click', (e) => {
      const id = this.#selection[0].id;
      const name = this.#nameInput.value;
      parent.postMessage({ content: 'change-name', data: { id, name } }, '*');
    });

    this.#createRectBtn?.addEventListener('click', (e) => {
      parent.postMessage({ content: 'create-rect' }, '*');
    });

    this.#moveXBtn?.addEventListener('click', (e) => {
      const id = this.#selection[0].id;
      parent.postMessage({ content: 'move-x', data: { id } }, '*');
    });

    this.#moveYBtn?.addEventListener('click', (e) => {
      const id = this.#selection[0].id;
      parent.postMessage({ content: 'move-y', data: { id } }, '*');
    });

    this.#resizeWBtn?.addEventListener('click', (e) => {
      const id = this.#selection[0].id;
      parent.postMessage({ content: 'resize-w', data: { id } }, '*');
    });

    this.#resizeHBtn?.addEventListener('click', (e) => {
      const id = this.#selection[0].id;
      parent.postMessage({ content: 'resize-h', data: { id } }, '*');
    });

    this.#loremIpsumBtn?.addEventListener('click', (e) => {
      console.log(">>");
      parent.postMessage({ content: 'lorem-ipsum' }, '*');
    });

  }
}
customElements.define('app-root', AppElement);
