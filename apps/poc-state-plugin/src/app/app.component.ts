import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { PenpotShape } from '@penpot/plugin-types';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: `
    <div class="wrapper" [attr.data-theme]="theme()">
      <h1>Test area!</h1>

      <p>
        Current project name: <span>{{ projectName() }}</span>
      </p>

      <form [formGroup]="form" (ngSubmit)="updateName()">
        <div class="name-wrap">
          <label>Selected Shape: </label>
          <input type="text" formControlName="name" />
          <button type="submit">Update</button>
        </div>
      </form>

      <div class="actions-wrap">
        <button type="button" (click)="createRect()">+Rect</button>
        <button type="button" (click)="moveX()">Move X</button>
        <button type="button" (click)="moveY()">Move Y</button>
        <button type="button" (click)="resizeW()">Resize W</button>
        <button type="button" (click)="resizeH()">Resize H</button>
        <button type="button" (click)="loremIpsum()">Lorem Ipsum</button>
        <button type="button" (click)="addIcon()">+ Icon</button>
      </div>

      <p>
        <button
          (click)="close()"
          type="button"
          data-appearance="primary"
          data-variant="destructive"
          class="act-close-plugin"
        >
          Close plugin
        </button>
      </p>
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  #pageId: null | string = null;
  #fileId = null;
  #revn = 0;
  #selection = signal<PenpotShape[]>([]);
  form = new FormGroup({
    name: new FormControl(''),
  });
  theme = signal('');
  projectName = signal('Unknown');

  constructor() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'file') {
        this.#fileId = event.data.content.id;
        this.#revn = event.data.content.revn;
      } else if (event.data.type === 'page') {
        this.#refreshPage(
          event.data.content.page.id,
          event.data.content.page.name
        );
      } else if (event.data.type === 'selection') {
        this.#refreshSelection(event.data.content.selection);
      } else if (event.data.type === 'init') {
        this.#fileId = event.data.content.fileId;
        this.#revn = event.data.content.revn;
        this.#refreshPage(event.data.content.pageId, event.data.content.name);
        this.#refreshSelection(event.data.content.selection);
        this.theme.set(event.data.content.theme);
      } else if (event.data.type === 'theme') {
        this.theme.set(event.data.content);
      }
    });

    this.#sendMessage({ content: 'ready' });
  }

  close() {
    this.#sendMessage({ content: 'close' });
  }

  updateName() {
    const id = this.#selection()[0].id;
    const name = this.form.get('name')?.value;
    this.#sendMessage({ content: 'change-name', data: { id, name } });
  }

  createRect() {
    this.#sendMessage({ content: 'create-rect' });
  }

  moveX() {
    const id = this.#selection()[0].id;
    this.#sendMessage({ content: 'move-x', data: { id } });
  }

  moveY() {
    const id = this.#selection()[0].id;
    this.#sendMessage({ content: 'move-y', data: { id } });
  }

  resizeW() {
    const id = this.#selection()[0].id;
    this.#sendMessage({ content: 'resize-w', data: { id } });
  }

  resizeH() {
    const id = this.#selection()[0].id;
    this.#sendMessage({ content: 'resize-h', data: { id } });
  }

  loremIpsum() {
    this.#sendMessage({ content: 'lorem-ipsum' });
  }

  addIcon() {
    this.#sendMessage({ content: 'add-icon' });
  }

  #sendMessage(message: unknown) {
    parent.postMessage(message, '*');
  }

  #refreshPage(pageId: string, name: string) {
    this.#pageId = pageId;
    this.projectName.set(name || 'Unknown');
  }

  #refreshSelection(selection: PenpotShape[]) {
    this.#selection.set(selection);
    if (selection && selection.length > 0) {
      this.form.get('name')?.setValue(this.#selection()[0].name);
    } else {
      this.form.get('name')?.setValue('');
    }
  }
}
