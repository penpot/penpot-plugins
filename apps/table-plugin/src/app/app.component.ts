import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import type { Cell, PluginMessageEvent, TableOptions } from '../app/model';
import { filter, fromEvent, map, merge, take } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    '[attr.data-theme]': 'theme()',
  },
})
export class AppComponent {
  public table: string[][] = [];
  public cells = [...Array(48).keys()];
  public selectedRow = 0;
  public selectedColumn = 0;
  public selectedCell: Cell | undefined;
  public tableOptions: TableOptions = {
    filledHeaderRow: true,
    filledHeaderColumn: false,
    borders: true,
    alternateRows: true,
  };
  public fileError = false;

  route = inject(ActivatedRoute);
  messages$ = fromEvent<MessageEvent<PluginMessageEvent>>(window, 'message');

  initialTheme$ = this.route.queryParamMap.pipe(
    map((params) => params.get('theme')),
    filter((theme) => !!theme),
    take(1)
  );

  theme = toSignal(
    merge(
      this.initialTheme$,
      this.messages$.pipe(
        filter((event) => event.data.type === 'theme'),
        map((event) => {
          return event.data.content;
        })
      )
    )
  );

  onSelectFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (
      target.files &&
      target.files[0] &&
      target.files[0].type === 'text/csv'
    ) {
      var reader = new FileReader();
      reader.readAsText(target.files[0]);
      reader.onload = (e) => {
        this.table = (e?.target?.result as string)
          ?.split(/\r?\n|\r|\n/g)
          .map((it) => it.trim())
          .filter((it) => it !== '')
          .map((it) => it.split(','));

        this.sendMessage({
          content: {
            import: this.table,
            type: 'import',
            options: this.tableOptions,
          },
          type: 'table',
        });
      };
    } else {
      this.fileError = true;
    }
  }

  createTable(cell: number) {
    const data = this.getCellColRow(cell);
    this.sendMessage({
      content: {
        new: { column: data.column, row: data.row },
        type: 'new',
        options: this.tableOptions,
      },
      type: 'table',
    });
  }

  setColRow(cell: number) {
    this.clearError();
    this.selectedCell = this.getCellColRow(cell);
    this.selectedColumn = this.selectedCell.column;
    this.selectedRow = this.selectedCell.row;
  }

  clearColRow() {
    this.selectedCell = undefined;
    this.selectedColumn = 0;
    this.selectedRow = 0;
  }

  clearError() {
    this.fileError = false;
  }

  getCellColRow(cell: number) {
    return {
      column: (cell % 8) + 1,
      row: Math.floor(cell / 8) + 1,
    };
  }

  private sendMessage(message: PluginMessageEvent): void {
    parent.postMessage(message, '*');
  }
}
