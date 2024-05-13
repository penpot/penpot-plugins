import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatherIconNames, icons } from 'feather-icons';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { IconSearchComponent } from './components/icon-search/icon-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    SafeHtmlPipe,
    IconButtonComponent,
    IconSearchComponent,
  ],
  styleUrl: './app.component.css',
  template: `<div>
    <div>
      <app-icon-search
        (searchIcons)="this.searchIcons($event)"
      ></app-icon-search>
    </div>
    @for (key of iconKeys(); track key) {
    <app-icon-button
      [icon]="icons()[key]"
      (insertIcon)="this.insertIcon(key)"
    ></app-icon-button>
    }
  </div>`,
})
export class AppComponent {
  public icons = signal(icons);
  public iconKeys = signal(Object.keys(icons) as FeatherIconNames[]);

  public insertIcon(key: FeatherIconNames): void {
    if (key && this.icons()[key] && this.icons()[key].toSvg()) {
      this.sendMessage({
        content: this.icons()[key].toSvg(),
        name: this.icons()[key].name || key,
      });
    }
  }

  public searchIcons(search: string): void {
    const allKeys = Object.keys(icons) as FeatherIconNames[];

    if (search === '') {
      this.iconKeys.set(allKeys);
      return;
    }

    const filtered = allKeys.filter(
      (key) =>
        this.icons()[key].tags.some((t) => t.match(search)) ||
        this.icons()[key].name.match(search)
    ) as FeatherIconNames[];

    this.iconKeys.set(filtered);
  }

  private sendMessage(message: unknown): void {
    parent.postMessage(message, '*');
  }
}
