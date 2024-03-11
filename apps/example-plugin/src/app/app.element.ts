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

  refreshSelectionId(selection: string) {
    this.#selection = selection;

    const selectionId = document.getElementById('selection-id');

    if (selectionId) {
      selectionId.innerText = this.#selection;
    }
  }

  connectedCallback() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'pingpong') {
        console.log('iframe', event.data.content);
      } else if (event.data.type === 'file') {
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
      <h1>Test area</h1>

      <p>Current project name: <span id="project-name">Unknown</span></p>
      <p>Selection id: <span id="selection-id">Unknown</span></p>
      <div class="profile"></div>

      <p>
        <button type="button" data-appearance="primary" class="act-ping-pong">Ping Pong message</button>
      </p>

      <p>
        <button type="button" data-appearance="primary" class="get-profile">API get profile</button>
        <span class="help">Need the .env file and run "start:rpc-api"</span>
      </p>

      <p>
        <button type="button" data-appearance="primary" class="remove-obj">Remove obj</button>
        <span class="help">Need the .env file and run "start:rpc-api"</span>
      </p>

      <p>
        <button type="button" data-appearance="primary" data-variant="destructive" class="act-close-plugin">Close plugin</button>
      </p>
    </div>
      `;

    const pingPongAction = this.querySelector<HTMLElement>('.act-ping-pong');

    pingPongAction?.addEventListener('click', () => {
      parent.postMessage({ content: 'ping' }, '*');
    });

    const closeAction = this.querySelector<HTMLElement>('.act-close-plugin');

    closeAction?.addEventListener('click', () => {
      parent.postMessage({ content: 'close' }, '*');
    });

    const getProfileAction = this.querySelector<HTMLElement>('.get-profile');

    getProfileAction?.addEventListener('click', () => {
      fetch('http://localhost:3000/get-profile')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const profile = document.querySelector('.profile');

          if (profile) {
            profile.innerHTML = '<p>' + JSON.stringify(data) + '</p>';
          }
        });
    });

    const removeAction = this.querySelector<HTMLElement>('.remove-obj');

    removeAction?.addEventListener('click', () => {
      fetch('http://localhost:3000/delete-object', {
        method: 'DELETE',
        body: JSON.stringify({
          fileId: this.#fileId,
          revn: this.#revn,
          pageId: this.#pageId,
          objectId: this.#selection,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    });

    parent.postMessage({ content: 'ready' }, '*');
  }
}
customElements.define('app-root', AppElement);
