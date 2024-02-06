import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    window.addEventListener('message', function (event) {
      if (event.data.type === 'pingpong') {
        console.log('iframe', event.data.content);
      } else if (event.data.type === 'page') {
        console.log('iframe', event.data);
        const projectName = document.getElementById('project-name');

        if (projectName) {
          projectName.innerText = event.data.content;
        }
      } else if (event.data.type === 'init') {
        const projectName = document.getElementById('project-name');

        if (projectName) {
          projectName.innerText = event.data.content.name;
        }
      }
    });

    this.innerHTML = `
    <div class="wrapper">
      <h1>Test area</h1>

      <p>Current project name: <span id="project-name">Unknown</span></p>

      <p>
        <button type="button" class="act-ping-pong">Ping Pong message</button>
      </p>

      <p>
        <button type="button" class="act-close-plugin">Close plugin</button>
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

    parent.postMessage({ content: 'ready' }, '*');
  }
}
customElements.define('app-root', AppElement);
