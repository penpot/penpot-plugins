import 'plugins-styles/lib/styles.css';
import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  calculateContrast(firstColor: string, secondColor: string) {
    const luminosityFirstColor = this.getLuminosity(firstColor);
    const luminositySecondColor = this.getLuminosity(secondColor);

    const result = (luminosityFirstColor + 0.05) / (luminositySecondColor + 0.05);
    this.setColors(firstColor, secondColor);
    this.setResult(result.toFixed(2).toString());
    this.setA11yTags(result);
  }

  getLuminosity(color: string) {
    const rgb = this.hexToRgb(color);
      return 0.2126 * (rgb[0]/255) + 0.7152 * (rgb[1]/255) + 0.0722 * (rgb[2]/255);
  }

  hexToRgb(hex: string) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [ r, g, b ];
  }

  setResult(text: string) {
    const selector = document.getElementById('result');

    if (selector) {
      selector.innerText = `${text} : 1`;
    }
  }

  setColors(firstColor: string | null, secondColor: string | null) {
    const color1 = document.getElementById('first-color');
    const color2 = document.getElementById('second-color');
    const code1 = document.getElementById('first-color-code');
    const code2 = document.getElementById('second-color-code');
    const contrastPreview = document.getElementById('contrast-preview');
    const smallText = document.getElementById('small-text');
    const largeText = document.getElementById('large-text');
    const circle = document.getElementById('circle');
    const square = document.getElementById('square');
    const triangle = document.getElementById('triangle');

    if (color1 && code1) {
      color1.style.background = firstColor ? firstColor : 'transparent';
      code1.innerText = firstColor ? firstColor : '';
    }

    if (color2 && code2) {
      color2.style.background = secondColor ? secondColor : 'transparent';
      code2.innerText = secondColor ? secondColor : '';
    }

    if (contrastPreview && smallText && largeText && circle && square && triangle) {
      contrastPreview.style.background = secondColor ? secondColor : 'transparent';
      smallText.style.color = firstColor ? firstColor : 'transparent';
      largeText.style.color = firstColor ? firstColor : 'transparent';
      circle.style.background = firstColor ? firstColor : 'transparent';
      square.style.background = firstColor ? firstColor : 'transparent';
      triangle.style.borderBottom = firstColor ? `var(--spacing-24) solid ${firstColor}` : 'var(--spacing-24) solid transparent';
    }

    const emptyPreview = document.getElementById('empty-preview');
    if (!firstColor && !secondColor && emptyPreview) {
      emptyPreview.style.display = 'block';
    } else if (emptyPreview) {
      emptyPreview.style.display = 'none';
    }
  }

  setA11yTags(result: number) {
    const selectors = {
        aa: document.getElementById('aa'),
        aaa: document.getElementById('aaa'),
        aaLg: document.getElementById('aa-lg'),
        aaaLg: document.getElementById('aaa-lg'),
        graphics: document.getElementById('graphics')
    };
    const fail = 'tag fail';
    const good = 'tag good';

    function setClass(selector: HTMLElement | null, className: string) {
        if (selector) {
            selector.className = className;
        }
    }

    if (result > 7) {
        setClass(selectors.aa, good);
        setClass(selectors.aaa, good);
        setClass(selectors.aaLg, good);
        setClass(selectors.aaaLg, good);
        setClass(selectors.graphics, good);
    } else if (result > 4.5) {
        setClass(selectors.aa, good);
        setClass(selectors.aaa, fail);
        setClass(selectors.aaLg, good);
        setClass(selectors.aaaLg, good);
        setClass(selectors.graphics, good);
    } else if (result > 3) {
        setClass(selectors.aa, fail);
        setClass(selectors.aaa, fail);
        setClass(selectors.aaLg, good);
        setClass(selectors.aaaLg, fail);
        setClass(selectors.graphics, good);
    } else {
        setClass(selectors.aa, fail);
        setClass(selectors.aaa, fail);
        setClass(selectors.aaLg, fail);
        setClass(selectors.aaaLg, fail);
        setClass(selectors.graphics, fail);
    }
  }

  connectedCallback() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'selection') {
        if (event.data.content.length === 2) {
          this.calculateContrast('#d5d1d1', '#000410');
        } else  {
          this.setColors(null, null);
          this.setResult('0');
          this.setA11yTags(0);
        }
      } else if (event.data.type === 'page') {
        console.log('refrespage', event.data);
      } else if (event.data.type === 'init') {
        if (event.data.content.selection.length === 2) {
          //TODO get real colors from selection
          this.calculateContrast('#d5d1d1', '#000410');
        }
      }
    });

    this.innerHTML = `
    <div class="wrapper">
      <div id="contrast-preview" class="contrast-preview">
        <p id="empty-preview" class="empty-preview">Select two colors to calculate contrast</p>
        <p id="small-text" data-color="text" data-second class="text small">SMALL sample text</p>
        <p id="large-text" data-color="text" data-second class="text large">LARGE sample text</p>
        <ul class="icons-list">
          <span id="circle" class="shape circle"></span>
          <span id="square" class="shape square"></span>
          <span id="triangle" class="triangle"></span>
        </ul>
      </div>
      <p class="title body-l">Selected colors:</p>
      <ul class="list">
        <li class="color">
          <span id="first-color" data-first class="color-preview"></span>
          <code id="first-color-code"></code>
        </li>
        <li class="color">
          <span id="second-color" data-second class="color-preview"></span>
          <code id="second-color-code"></code>
        </li>
      </ul>
      <p class="title body-l">Contrast ratio: <span id="result">0 : 1</span></p>
      <p class="title body-l">Normal text:</p>
      <ul class="list">
        <li id="aa" class="tag fail">AA</li>
        <li id="aaa" class="tag fail">AAA</li>
      </ul>
      <p class="title body-l">Large text (24px or 19px + bold):</p>
      <ul class="list">
        <li id="aa-lg" class="tag fail">AA</li>
        <li id="aaa-lg" class="tag fail">AAA</li>
      </ul>
      <p class="title body-l">Graphics (such as form input borders):</p>
      <ul class="list">
        <li id="graphics" class="tag fail">AA</li>
      </ul>
    </div>
      `;

    parent.postMessage({ content: 'ready' }, '*');
  }
}
customElements.define('app-root', AppElement);
