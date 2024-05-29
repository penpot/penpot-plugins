import html from './app.element.html?raw';
import 'plugins-styles/lib/styles.css';
import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    this.innerHTML = html;
  }
}
customElements.define('app-root', AppElement);
