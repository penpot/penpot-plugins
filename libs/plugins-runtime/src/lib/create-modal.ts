import type { OpenUIOptions } from './models/open-ui-options.model.js';
import type { PenpotTheme } from '@penpot/plugin-types';
import type { PluginModalElement } from './modal/plugin-modal.js';

export function createModal(
  name: string,
  url: string,
  theme: PenpotTheme,
  options: OpenUIOptions
) {
  const modal = document.createElement('plugin-modal') as PluginModalElement;

  modal.setTheme(theme);

  modal.setAttribute('title', name);
  modal.setAttribute('iframe-src', url);
  modal.setAttribute('width', String(options.width || 285));
  modal.setAttribute('height', String(options.height || 540));

  document.body.appendChild(modal);

  return modal;
}
