import 'plugins-styles/lib/styles.css';
import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  refreshPageName(name: string) {
    const projectName = document.getElementById('project-name');

    if (projectName) {
      projectName.innerText = name;
    }
  }

  refreshSelectionId(selection: string) {
    const selectionId = document.getElementById('selection-id');

    if (selectionId) {
      selectionId.innerText = selection;
    }
  }

  connectedCallback() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'pingpong') {
        console.log('iframe', event.data.content);
      } else if (event.data.type === 'page') {
        this.refreshPageName(event.data.content);
      } else if (event.data.type === 'selection') {
        this.refreshSelectionId(event.data.content);
      } else if (event.data.type === 'init') {
        this.refreshPageName(event.data.content.name);
        this.refreshSelectionId(event.data.content.selection);
      }
    });

    this.innerHTML = `
    <div class="wrapper" data-theme="light">
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

    parent.postMessage({ content: 'ready' }, '*');
  }
}
customElements.define('app-root', AppElement);
