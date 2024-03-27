import { OpenUIOptions } from './models/open-ui-options.model';

import type { Theme } from '@penpot/plugin-types';

export function setModalTheme(modal: HTMLElement, theme: Theme) {
  modal.setAttribute('data-theme', theme);
}

export function createModal(
  name: string,
  url: string,
  theme: Theme,
  options: OpenUIOptions
) {
  const modal = document.createElement('plugin-modal');

  setModalTheme(modal, theme);

  modal.setAttribute('title', name);
  modal.setAttribute('iframe-src', url);
  modal.setAttribute('width', String(options.width || 300));
  modal.setAttribute('height', String(options.height || 400));

  document.body.appendChild(modal);

  return modal;
}
