import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { icons } from 'feather-icons';

@Component({
  selector: 'app-icon-search',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './icon-search.component.css',
  template: `<input
    type="search"
    [placeholder]="'Search ' + iconsCount + ' icons'"
    (input)="onSearchIcons($event)"
  />`,
})
export class IconSearchComponent {
  @Output()
  private searchIcons = new EventEmitter<string>();

  public iconsCount = Object.keys(icons).length;

  public onSearchIcons(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchIcons.emit(target?.value || '');
  }
}
