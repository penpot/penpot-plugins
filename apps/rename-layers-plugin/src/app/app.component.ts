import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import type { PluginMessageEvent, ReplaceText } from '../app/model';
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
  route = inject(ActivatedRoute);
  messages$ = fromEvent<MessageEvent<PluginMessageEvent>>(window, 'message');
  public textToReplace: ReplaceText = {
    current: '',
    new: '',
  };

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

  public updateText() {
    this.sendMessage({ type: 'replace-text', content: this.textToReplace });
  }

  private sendMessage(message: PluginMessageEvent): void {
    parent.postMessage(message, '*');
  }
}
