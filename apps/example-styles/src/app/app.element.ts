import 'plugins-styles/lib/styles.css';
import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    this.innerHTML = `
      <h1 class="display">Plugins styles</h1>
      <main>
        <section aria-label="colors">
          <h2 class="title-large title-margin">Colors</h2>
          <ul class="color-section">
            <li>
              <h4 class="title-medium title-margin">Background</h4>
              <ul class="theme-group" data-theme="dark">
                <li class="color">
                  <code class="color-label">--db-primary</code>
                  <span class="color-preview" style="background-color: var(--db-primary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--db-secondary</code>
                  <span class="color-preview" style="background-color: var(--db-secondary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--db-tertiary</code>
                  <span class="color-preview" style="background-color: var(--db-tertiary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--db-quaternary</code>
                  <span class="color-preview" style="background-color: var(--db-quaternary);"></span></button>
                </li>
              </ul>
              <ul class="theme-group" data-theme="light">
                <li class="color">
                  <code class="color-label">--lb-primary</code>
                  <span class="color-preview" style="background-color: var(--lb-primary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--lb-secondary</code>
                  <span class="color-preview" style="background-color: var(--lb-secondary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--lb-tertiary</code>
                  <span class="color-preview" style="background-color: var(--lb-tertiary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--lb-quaternary</code>
                  <span class="color-preview" style="background-color: var(--lb-quaternary);"></span></button>
                </li>
              </ul>
            </li>
            <li>
              <h4 class="title-medium title-margin">Foreground</h4>
              <ul class="theme-group" data-theme="dark">
                <li class="color">
                  <code class="color-label">--df-primary</code>
                  <span class="color-preview" style="background-color: var(--df-primary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--df-secondary</code>
                  <span class="color-preview" style="background-color: var(--df-secondary);"></span></button>
                </li>
              </ul>
              <ul class="theme-group" data-theme="light">
                <li class="color">
                  <code class="color-label">--lf-primary</code>
                  <span class="color-preview" style="background-color: var(--lf-primary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--lf-secondary</code>
                  <span class="color-preview" style="background-color: var(--lf-secondary);"></span></button>
                </li>
              </ul>
            </li>
            <li>
              <h4 class="title-medium title-margin">Accent</h4>
              <ul class="theme-group" data-theme="dark">
                <li class="color">
                  <code class="color-label">--da-primary</code>
                  <span class="color-preview" style="background-color: var(--da-primary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--da-primary-muted</code>
                  <span class="color-preview" style="background-color: var(--da-primary-muted);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--da-secondary</code>
                  <span class="color-preview" style="background-color: var(--da-secondary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--da-tertiary</code>
                  <span class="color-preview" style="background-color: var(--da-tertiary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--da-quaternary</code>
                  <span class="color-preview" style="background-color: var(--da-quaternary);"></span></button>
                </li>
              </ul>
              <ul class="theme-group" data-theme="light">
                <li class="color">
                  <code class="color-label">--la-primary</code>
                  <span class="color-preview" style="background-color: var(--la-primary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--la-primary-muted</code>
                  <span class="color-preview" style="background-color: var(--la-primary-muted);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--la-seconlary</code>
                  <span class="color-preview" style="background-color: var(--la-seconlary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--la-tertiary</code>
                  <span class="color-preview" style="background-color: var(--la-tertiary);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--la-quaternary</code>
                  <span class="color-preview" style="background-color: var(--la-quaternary);"></span></button>
                </li>
              </ul>
            </li>
            <li>
              <h4 class="title-medium title-margin">Status color</h4>
              <ul class="theme-group" data-theme="dark">
                <li class="color">
                  <code class="color-label">--success-50</code>
                  <span class="color-preview" style="background-color: var(--success-50);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--success-500</code>
                  <span class="color-preview" style="background-color: var(--success-500);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--success-950</code>
                  <span class="color-preview" style="background-color: var(--success-950);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--warning-50</code>
                  <span class="color-preview" style="background-color: var(--warning-50);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--warning-500</code>
                  <span class="color-preview" style="background-color: var(--warning-500);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--warning-950</code>
                  <span class="color-preview" style="background-color: var(--warning-950);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--error-50</code>
                  <span class="color-preview" style="background-color: var(--error-50);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--error-500</code>
                  <span class="color-preview" style="background-color: var(--error-500);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--error-950</code>
                  <span class="color-preview" style="background-color: var(--error-950);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--info-50</code>
                  <span class="color-preview" style="background-color: var(--info-50);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--info-500</code>
                  <span class="color-preview" style="background-color: var(--info-500);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--info-950</code>
                  <span class="color-preview" style="background-color: var(--info-950);"></span></button>
                </li>
              </ul>
            </li>
            <li>
              <h4 class="title-medium title-margin">App color</h4>
              <ul class="theme-group" data-theme="dark">
                <li class="color">
                  <code class="color-label">--app-white</code>
                  <span class="color-preview" style="background-color: var(--app-white);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-black</code>
                  <span class="color-preview" style="background-color: var(--app-black);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-pink</code>
                  <span class="color-preview" style="background-color: var(--app-pink);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-blue</code>
                  <span class="color-preview" style="background-color: var(--app-blue);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-gold</code>
                  <span class="color-preview" style="background-color: var(--app-gold);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-indigo</code>
                  <span class="color-preview" style="background-color: var(--app-indigo);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-red</code>
                  <span class="color-preview" style="background-color: var(--app-red);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-yellow</code>
                  <span class="color-preview" style="background-color: var(--app-yellow);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-purple</code>
                  <span class="color-preview" style="background-color: var(--app-purple);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-lemon</code>
                  <span class="color-preview" style="background-color: var(--app-lemon);"></span></button>
                </li>
                <li class="color">
                  <code class="color-label">--app-orange</code>
                  <span class="color-preview" style="background-color: var(--app-orange);"></span></button>
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section aria-label="fonts">
          <h2 class="title-large title-margin">Fonts</h2>
          <p class="display">Display</p>
          <p class="title-l">Title L</p>
          <p class="title-m">Title M</p>
          <p class="title-s">Title S</p>
          <p class="headline-l">Headline L</p>
          <p class="headline-m">Headline M</p>
          <p class="headline-s">Headline S</p>
          <p class="body-l">Body large</p>
          <p class="body-m">Body medium</p>
          <p class="body-s">Body small</p>
          <p class="caption">Caption</p>
          <p class="code-font">Code font</p>

          <code class="code code-font">
            &lt;p class="display">Display&lt;/p&gt; <br>
            &lt;p class="title-l">Title L&lt;/p&gt; <br>
            &lt;p class="title-m">Title M&lt;/p&gt; <br>
            &lt;p class="title-s">Title S&lt;/p&gt; <br>
            &lt;p class="headline-l">Headline L&lt;/p&gt; <br>
            &lt;p class="headline-m">Headline M&lt;/p&gt; <br>
            &lt;p class="headline-s">Headline S&lt;/p&gt; <br>
            &lt;p class="body-l">Body large&lt;/p&gt; <br>
            &lt;p class="body-m">Body medium&lt;/p&gt; <br>
            &lt;p class="body-s">Body small&lt;/p&gt; <br>
            &lt;p class="caption">Caption&lt;/p&gt; <br>
            &lt;p class="code-font">Code font&lt;/p&gt; <br>
          </code>
        </section>

        <section aria-label="spacing">
          <h2 class="title-large title-margin">Spacing</h2>
          <ul>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-4</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-4);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-8</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-8);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-12</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-12);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-16</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-16);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-20</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-20);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-24</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-24);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-28</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-28);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-32</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-32);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-36</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-36);"></span></button>
            </li>
            <li class="spacing-group">
              <code class="spacing-label">--spacing-40</code>
              <span class="spacing-preview" style="inline-size: var(--spacing-40);"></span></button>
            </li>
          </ul>
        </section>

        <section aria-label="icons">
          <h2 class="title-large title-margin">Icons</h2>
          <div class="icons-section" style="margin-block-end: var(--spacing-20);">
            <span class="icon icon-arrow-bottom"></span>
            <span class="icon icon-arrow-top"></span>
            <span class="icon icon-arrow-right"></span>
            <span class="icon icon-arrow-left"></span>
            <span class="icon icon-close"></span>
            <span class="icon icon-close-l"></span>
            <span class="icon icon-delete"></span>
            <span class="icon icon-add"></span>
            <span class="icon icon-remove"></span>
            <span class="icon icon-search"></span>
            <span class="icon icon-copy"></span>
            <span class="icon icon-more"></span>
            <span class="icon icon-loading"></span>
            <span class="icon icon-help"></span>
            <span class="icon icon-info"></span>
            <span class="icon icon-show"></span>
            <span class="icon icon-hide"></span>
            <span class="icon icon-lock"></span>
            <span class="icon icon-unlock"></span>
            <span class="icon icon-download"></span>
          </div>
          <code class="code code-font">
            &lt;span class="icon icon-arrow-bottom"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-arrow-top"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-arrow-right"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-arrow-left"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-close"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-close-l"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-delete"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-add"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-remove"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-search"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-copy"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-more"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-loading"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-help"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-info"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-show"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-hide"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-lock"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-unlock"&gt;&lt;/span&gt; <br>
            &lt;span class="icon icon-download"&gt;&lt;/span&gt;
          </code>
        </section>

        <section aria-label="select">
          <h2 class="title-large title-margin">Select</h2>
          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <div class="form-group">
                <label class="select-label-hidden" for="select-1">Which is your favorite animal?</label>
                <select class="select" id="select-1">
                  <option value="">Select an animal</option>
                  <option value="1">Quokka</option>
                  <option value="2">Rabbit</option>
                  <option value="3">Goat</option>
                  <option value="4">Capybara</option>
                </select>
              </div>
            </div>
            <code class="code code-font">
              &lt;div class="form-group"&gt; <br>
              &nbsp;&lt;label class="select-label-hidden" for="select-1"&gt;Which is your favorite animal?&lt;/label&gt; <br>
              &nbsp;&lt;select class="select" id="select-1"&gt; <br>
              &nbsp;&nbsp;&lt;option value="1"&gt;Quokka&lt;/option&gt; <br>
              &nbsp;&nbsp;&lt;option value="2"&gt;Rabbit&lt;/option&gt; <br>
              &nbsp;&nbsp;&lt;option value="3"&gt;Goat&lt;/option&gt; <br>
              &nbsp;&nbsp;&lt;option value="4"&gt;Capybara&lt;/option&gt; <br>
              &nbsp;&lt;/select&gt; <br>
              &lt;/div&gt;
            </code>
          </div>

          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <div class="form-group">
                <label class="select-label-hidden" for="select-2">Which is your favorite animal?</label>
                <select class="select" id="select-2" disabled>
                  <option value="1">Quokka</option>
                  <option value="2">Rabbit</option>
                  <option value="3">Goat</option>
                  <option value="4">Capybara</option>
                </select>
              </div>
            </div>
            <code class="code code-font">
              &lt;div class="form-group"&gt; <br>
              &nbsp;&lt;label class="select-label-hidden" for="select-2"&gt;Which is your favorite animal?&lt;/label&gt; <br>
              &nbsp;&lt;select class="select" id="select-2" disabled&gt; <br>
              &nbsp;&nbsp;&lt;option value="1"&gt;Quokka&lt;/option&gt; <br>
              &nbsp;&nbsp;&lt;option value="2"&gt;Rabbit&lt;/option&gt; <br>
              &nbsp;&nbsp;&lt;option value="3"&gt;Goat&lt;/option&gt; <br>
              &nbsp;&nbsp;&lt;option value="4"&gt;Capybara&lt;/option&gt; <br>
              &nbsp;&lt;/select&gt; <br>
              &lt;/div&gt;
            </code>
          </div>
        </section>

        <section aria-label="input">
          <h2 class="title-large title-margin">Input</h2>
          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <div class="inputs-list">
                <div class="form-group">
                  <label class="input-label-hidden" for="input-1">This is the label</label>
                  <input class="input" type="text" placeholder="Input dark theme" id="input-1"/>
                </div>
                <div class="form-group">
                  <label class="input-label-hidden" for="input-2">This is the label</label>
                  <input class="input success" type="text" placeholder="Input dark theme success" id="input-2"/>
                </div>
                <div class="form-group">
                  <label class="input-label-hidden" for="input-3">This is the label</label>
                  <input class="input error" type="text" placeholder="Input dark theme error" id="input-3"/>
                </div>
              </div>
            </div>
            <code class="code code-font">
              &lt;div class="theme-group" data-theme="dark"&gt; <br>
              &nbsp;&lt;div class="form-group"&gt; <br>
              &nbsp;&nbsp;&lt;label class="input-label-hidden" for="input-1"&gt;This is the label&lt;/label&gt; <br>
              &nbsp;&nbsp;&lt;input class="input" type="text" placeholder="Input dark theme" id="input-1"/&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="form-group"&gt; <br>
              &nbsp;&nbsp;&lt;label class="input-label-hidden" for="input-2"&gt;This is the label&lt;/label&gt; <br>
              &nbsp;&nbsp;&lt;input class="input success" type="text" placeholder="Input dark theme success" id="input-2"/&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="form-group"&gt; <br>
              &nbsp;&nbsp;&lt;label class="input-label-hidden" for="input-3"&gt;This is the label&lt;/label&gt; <br>
              &nbsp;&nbsp;&lt;input class="input error" type="text" placeholder="Input dark theme error" id="input-3"/&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &lt;/div&gt;
            </code>
          </div>
          <div class="component-section">
            <div class="theme-group" data-theme="light">
              <div class="inputs-list">
                <div class="form-group">
                  <label class="input-label-hidden" for="input-4">This is the label</label>
                  <input class="input" type="text" placeholder="Input light theme" id="input-4"/>
                </div>
                <div class="form-group">
                  <label class="input-label-hidden" for="input-5">This is the label</label>
                  <input class="input success" type="text" placeholder="Input light theme success" id="input-5"/>
                </div>
                <div class="form-group">
                  <label class="input-label-hidden" for="input-6">This is the label</label>
                  <input class="input error" type="text" placeholder="Input light theme error" id="input-6"/>
                </div>
              </div>
            </div>
            <code class="code code-font">
              &lt;div class="theme-group" data-theme="light"&gt; <br>
              &nbsp;&lt;div class="form-group"&gt; <br>
              &nbsp;&nbsp;&lt;label class="input-label-hidden" for="input-4"&gt;This is the label&lt;/label&gt; <br>
              &nbsp;&nbsp;&lt;input class="input" type="text" placeholder="Input light theme" id="input-4"/&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="form-group"&gt; <br>
              &nbsp;&nbsp;&lt;label class="input-label-hidden" for="input-5"&gt;This is the label&lt;/label&gt; <br>
              &nbsp;&nbsp;&lt;input class="input success" type="text" placeholder="Input light theme success" id="input-5"/&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="form-group"&gt; <br>
              &nbsp;&nbsp;&lt;label class="input-label-hidden" for="input-6"&gt;This is the label&lt;/label&gt; <br>
              &nbsp;&nbsp;&lt;input class="input error" type="text" placeholder="Input light theme error" id="input-6"/&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &lt;/div&gt;
            </code>
          </div>
        </section>

        <section aria-label="buttons">
          <h2 class="title-large title-margin">Buttons</h2>
          <h3 class="title-medium title-margin">Primary button</h3>
          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <ul class="button-list">
                <li><button type="button" data-appearance="primary">Primary dark</button></li>
                <li><button type="button" data-appearance="primary" disabled>Disabled</button></li>
              </ul>
              <ul class="button-list">
                <li><button type="button" data-appearance="primary" data-variant="destructive">Primary dark destructive</button></li>
                <li><button type="button" data-appearance="primary" data-variant="destructive" disabled>Disabled</button></li>
              </ul>
            </div>

            <code class="code code-font">
              &lt;div data-theme="dark"&gt; <br>
              &nbsp;&lt;button type="button" data-appearance="primary"&gt;Primary Dark&lt;/button&gt; <br>
              &nbsp;&lt;button type="button" data-appearance="primary"&gt;Primary Dark destructive&lt;/button&gt; <br>
              &lt;/div&gt;
            </code>
          </div>

          <div class="component-section">
            <div class="theme-group" data-theme="light">
              <ul class="button-list">
                <li><button type="button" data-appearance="primary">Primary Light</button></li>
                <li><button type="button" data-appearance="primary" disabled>Disabled</button></li>
              </ul>
              <ul class="button-list">
                <li><button type="button" data-appearance="primary" data-variant="destructive">Primary light destructive</button></li>
                <li><button type="button" data-appearance="primary" data-variant="destructive" disabled>Disabled</button></li>
              </ul>
            </div>
            <code class="code code-font">
              &lt;div data-theme="light"&gt; <br>
              &nbsp;&lt;button type="button" data-appearance="primary"&gt;Primary Light&lt;/button&gt; <br>
              &nbsp;&lt;button type="button" data-appearance="primary" data-variant="destructive"&gt;Primary Light destructive&lt;/button&gt; <br>
              &lt;/div&gt;
            </code>
          </div>

          <h3 class="title-medium title-margin">Secondary button</h3>
          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <ul class="button-list">
                <li><button type="button" data-appearance="secondary">Secondary dark</button></li>
                <li><button type="button" data-appearance="secondary" disabled>Disabled</button></li>
              </ul>
            </div>
            <code class="code code-font">
              &lt;div data-theme="dark"&gt; <br>
              &nbsp;&lt;button type="button" data-appearance="secondary"&gt;Secondary Dark&lt;/button&gt; <br>
              &lt;/div&gt;
            </code>
          </div>

          <div class="component-section">
            <div class="theme-group" data-theme="light">
              <ul class="button-list">
                <li><button type="button" data-appearance="secondary">Secondary Light</button></li>
                <li><button type="button" data-appearance="secondary" disabled>Disabled</button></li>
              </ul>
            </div>
            <code class="code code-font">
              &lt;div data-theme="light"&gt; <br>
              &nbsp;&lt;button type="button" data-appearance="secondary"&gt;Secondary Light&lt;/button&gt; <br>
              &lt;/div&gt;
            </code>
          </div>
        </section>

        <section aria-label="checkox">
          <h2 class="title-large title-margin">Checkox</h2>
          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <div class="checkbox-container" style="margin-block-end: var(--spacing-8);">
                <input class="checkbox-input" type="checkbox" id="checkbox1" value="checkbox_one" />
                <label for="checkbox1" class="checkbox-hidden">Dark checkbox</label>
              </div>
              <div class="checkbox-container">
                <input class="checkbox-input" type="checkbox" id="checkbox2" value="checkbox_second" />
                <label for="checkbox2" class="body-small">Dark checkbox with label</label>
              </div>
            </div>
            <code class="code code-font">
              &lt;div data-theme="dark"&gt; <br>
              &nbsp;&lt;div class="checkbox-container"&gt; <br>
              &nbsp;&nbsp;  &lt;input class="checkbox-input" type="checkbox" id="checkbox1" value="checkbox_one" /&gt; <br>
              &nbsp;&nbsp;  &lt;label for="checkbox1" class="checkbox-hidden"&gt;Dark checkbox&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br> <br>
              &nbsp;&lt;div class="checkbox-container"&gt; <br>
              &nbsp;&nbsp;  &lt;input class="checkbox-input" type="checkbox" id="checkbox2" value="checkbox_second" /&gt; <br>
              &nbsp;&nbsp;  &lt;label for="checkbox2" class="body-small"&gt;Dark checkbox with label&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt;
              &lt;/div&gt;
            </code>
          </div>
          
          <div class="component-section">
            <div class="theme-group" data-theme="light">
              <div class="checkbox-container" style="margin-block-end: var(--spacing-8);">
                <input class="checkbox-input" type="checkbox" id="checkbox3" value="checkbox_third" />
                <label for="checkbox3" class="checkbox-hidden">Light checkbox</label>
              </div>
              <label class="checkbox-container">
                <input class="checkbox-input" type="checkbox" id="checkbox4" value="checkbox_fourth" />
                <label for="checkbox4" class="body-small">Light checkbox with label</label>
              </label>
            </div>
            <code class="code code-font">
              &lt;div data-theme="light"&gt; <br>
              &nbsp;&lt;div class="checkbox-container"&gt; <br>
              &nbsp;&nbsp;  &lt;input class="checkbox-input" type="checkbox" id="checkbox3" value="third" /&gt; <br>
              &nbsp;&nbsp;  &lt;label for="checkbox3" class="checkbox-hidden"&gt;Light checkbox&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br> <br>
              &nbsp;&lt;div class="checkbox-container"&gt; <br>
              &nbsp;&nbsp;  &lt;input class="checkbox-input" type="checkbox" id="checkbox4" value="checkbox_fourth" /&gt; <br>
              &nbsp;&nbsp;  &lt;label for="checkbox4" class="body-small"&gt;Light checkbox with label&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt;
              &lt;/div&gt;
            </code>
          </div>
        </section>

        <section aria-label="radio">
          <h2 class="title-large title-margin">Radio button</h2>
          <div class="component-section">
            <div class="theme-group" data-theme="dark">
              <div class="radio-container">
                <input type="radio" class="radio-input" id="quokka" name="animal" value="quokka">
                <label class="radio-label" for="quokka">quokka</label>
              </div>
              <div class="radio-container">
                <input type="radio" class="radio-input" id="capybara" name="animal" value="capybara">
                <label class="radio-label" for="capybara">capybara</label>
              </div>
              <div class="radio-container">
                <input type="radio" class="radio-input" id="goat" name="animal" value="goat">
                <label class="radio-label" for="goat">goat</label>
              </div>
            </div>
            <code class="code code-font">
              &lt;div data-theme="dark"&gt; <br>
              &nbsp;&lt;div class="radio-container"&gt; <br>
              &nbsp;&nbsp;&lt;input type="radio" class="radio-input" id="quokka" name="animal" value="quokka"&gt; <br>
              &nbsp;&nbsp;&lt;label class="radio-label" for="quokka"&gt;quokka&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="radio-container"&gt; <br>
              &nbsp;&nbsp;&lt;input type="radio" class="radio-input" id="capybara" name="animal" value="capybara"&gt; <br>
              &nbsp;&nbsp;&lt;label class="radio-label" for="capybara"&gt;capybara&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="radio-container"&gt; <br>
              &nbsp;&nbsp;&lt;input type="radio" class="radio-input" id="goat" name="animal" value="goat"&gt; <br>
              &nbsp;&nbsp;&lt;label class="radio-label" for="goat"&gt;goat&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &lt;/div&gt;
            </code>
          </div>

          <div class="component-section">
            <div class="theme-group" data-theme="light">
              <div class="radio-container">
                <input type="radio" class="radio-input" id="rabbit" name="small-animals" value="rabbit">
                <label class="radio-label" for="rabbit">rabbit</label>
              </div>
              <div class="radio-container">
                <input type="radio" class="radio-input" id="mouse" name="small-animals" value="mouse">
                <label class="radio-label" for="mouse">mouse</label>
              </div>
              <div class="radio-container">
                <input type="radio" class="radio-input" id="chinchilla" name="small-animals" value="chinchilla">
                <label class="radio-label" for="chinchilla">chinchilla</label>
              </div>
            </div>
            <code class="code code-font">
              &lt;div data-theme="light"&gt; <br>
              &nbsp;&lt;div class="radio-container"&gt; <br>
              &nbsp;&nbsp;&lt;input type="radio" class="radio-input" id="rabbit" name="small-animals" value="rabbit"&gt; <br>
              &nbsp;&nbsp;&lt;label class="radio-label" for="rabbit"&gt;rabbit&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="radio-container"&gt; <br>
              &nbsp;&nbsp;&lt;input type="radio" class="radio-input" id="mouse" name="small-animals" value="mouse"&gt; <br>
              &nbsp;&nbsp;&lt;label class="radio-label" for="mouse"&gt;mouse&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &nbsp;&lt;div class="radio-container"&gt; <br>
              &nbsp;&nbsp;&lt;input type="radio" class="radio-input" id="chinchilla" name="small-animals" value="chinchilla"&gt; <br>
              &nbsp;&nbsp;&lt;label class="radio-label" for="chinchilla"&gt;chinchilla&lt;/label&gt; <br>
              &nbsp;&lt;/div&gt; <br>
              &lt;/div&gt;
            </code>
          </div>
        </section>

      </main>
      `;
  }
}
customElements.define('app-root', AppElement);
