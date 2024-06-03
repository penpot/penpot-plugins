import type { OpenUIOptions } from './models/open-ui-options.model.js';
import type { PenpotTheme } from '@penpot/plugin-types';
import type { PluginModalElement } from './modal/plugin-modal.js';

export function createModal(
  name: string,
  url: string,
  theme: PenpotTheme,
  options?: OpenUIOptions
) {
  const modal = document.createElement('plugin-modal') as PluginModalElement;

  modal.setTheme(theme);

  const defaultWidth = 335;
  const defaultHeight = 590;

  const initialPosition = {
    blockStart: 40,
    inlineEnd: 320,
  };

  modal.style.setProperty(
    '--modal-block-start',
    `${initialPosition.blockStart}px`
  );
  modal.style.setProperty(
    '--modal-inline-end',
    `${initialPosition.inlineEnd}px`
  );

  const maxWidth = window.innerWidth - initialPosition.inlineEnd;
  const maxHeight = window.innerHeight - initialPosition.blockStart;
  const width = Math.min(options?.width || defaultWidth, maxWidth);
  const height = Math.min(options?.height || defaultHeight, maxHeight);

  modal.setAttribute('title', name);
  modal.setAttribute('iframe-src', url);
  modal.setAttribute('width', String(width));
  modal.setAttribute('height', String(height));

  document.body.appendChild(modal);

  return modal;
}
