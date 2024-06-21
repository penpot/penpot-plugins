import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { PenpotShape } from '@penpot/plugin-types';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: `
    <div class="wrapper">
      <h1>Test area!</h1>

      <p>
        Current project name: <span>{{ projectName() }}</span>
      </p>
      <p>
        Counter: <span>{{ counter() }}</span>
      </p>

      <form [formGroup]="form" (ngSubmit)="updateName()">
        <div class="name-wrap">
          <label>Selected Shape: </label>
          <input class="input" type="text" formControlName="name" />
          <button type="submit">Update</button>
        </div>
      </form>

      <div class="actions-wrap">
        <button
          type="button"
          data-appearance="secondary"
          (click)="createRect()"
        >
          +Rect
        </button>
        <button type="button" data-appearance="secondary" (click)="moveX()">
          Move X
        </button>
        <button type="button" data-appearance="secondary" (click)="moveY()">
          Move Y
        </button>
        <button type="button" data-appearance="secondary" (click)="resizeW()">
          Resize W
        </button>
        <button type="button" data-appearance="secondary" (click)="resizeH()">
          Resize H
        </button>
        <button
          type="button"
          data-appearance="secondary"
          (click)="loremIpsum()"
        >
          Lorem Ipsum
        </button>
        <button type="button" data-appearance="secondary" (click)="addIcon()">
          + Icon
        </button>
        <button
          type="button"
          data-appearance="secondary"
          (click)="createGrid()"
        >
          + Grid
        </button>
        <button
          type="button"
          data-appearance="secondary"
          (click)="createPalette()"
        >
          Create color palette board
        </button>
        <button
          type="button"
          data-appearance="secondary"
          (click)="increaseCounter()"
        >
          +COUNTER
        </button>
        <button
          type="button"
          data-appearance="secondary"
          (click)="stylizeWords()"
        >
          WORDS STYLES
        </button>
        <button
          type="button"
          data-appearance="secondary"
          (click)="rotateShapes()"
        >
          Rotate
        </button>

        <input type="file" class="file-upload" (change)="uploadImage($event)" />
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
  counter = signal(0);

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
        this.counter.set(event.data.content.counter);
      } else if (event.data.type === 'init') {
        this.#fileId = event.data.content.fileId;
        this.#revn = event.data.content.revn;
        this.#refreshPage(event.data.content.pageId, event.data.content.name);
        this.#refreshSelection(event.data.content.selection);
        this.theme.set(event.data.content.theme);
        this.counter.set(event.data.content.counter);
      } else if (event.data.type === 'theme') {
        this.theme.set(event.data.content);
      } else if (event.data.type === 'update-counter') {
        this.counter.set(event.data.content.counter);
      }
    });

    this.#sendMessage({ content: 'ready' });

    effect(() => {
      document.body.setAttribute('data-theme', this.theme());
    });
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

  createGrid() {
    this.#sendMessage({ content: 'create-grid' });
  }

  createPalette() {
    this.#sendMessage({ content: 'create-colors' });
  }

  increaseCounter() {
    this.#sendMessage({ content: 'increase-counter' });
  }

  stylizeWords() {
    this.#sendMessage({ content: 'word-styles' });
  }

  rotateShapes() {
    this.#sendMessage({ content: 'rotate-selection' });
  }

  async uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input?.files[0];

      if (file) {
        const buff = await file.arrayBuffer();
        const data = new Uint8Array(buff);
        const mimeType = file.type;
        this.#sendMessage({
          content: 'create-image-data',
          data: { data, mimeType },
        });
        input.value = '';
      }
    }
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
