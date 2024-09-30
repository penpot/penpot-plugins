import type { OpenUIOptions } from './models/open-ui-options.model.js';
import type { Theme } from '@penpot/plugin-types';
import type { PluginModalElement } from './modal/plugin-modal.js';

export function createModal(
  name: string,
  url: string,
  theme: Theme,
  options?: OpenUIOptions,
  allowDownloads?: boolean
) {
  const modal = document.createElement('plugin-modal') as PluginModalElement;

  modal.setTheme(theme);
  const minPluginWidth = 200;
  const minPluginHeight = 200;

  const defaultWidth = 335;
  const defaultHeight = 590;

  const maxWidth =
    (options?.width ?? defaultWidth) > window.innerWidth
      ? window.innerWidth - 290
      : options?.width ?? defaultWidth;

  const initialPosition = {
    blockStart: 40,
    // To be able to resize the element as expected the position must be absolute from the right.
    // This value is the length of the window minus the width of the element plus the width of the design tab.
    inlineStart: window.innerWidth - maxWidth - 290,
  };

  modal.style.setProperty(
    '--modal-block-start',
    `${initialPosition.blockStart}px`
  );
  modal.style.setProperty(
    '--modal-inline-start',
    `${initialPosition.inlineStart}px`
  );

  const maxHeight = window.innerHeight - initialPosition.blockStart;
  let width = Math.min(options?.width || defaultWidth, maxWidth);
  let height = Math.min(options?.height || defaultHeight, maxHeight);

  width = Math.max(width, minPluginWidth);
  height = Math.max(height, minPluginHeight);

  modal.setAttribute('title', name);
  modal.setAttribute('iframe-src', url);
  modal.setAttribute('width', String(width));
  modal.setAttribute('height', String(height));

  if (allowDownloads) {
    modal.setAttribute('allow-downloads', 'true');
  }

  document.body.appendChild(modal);

  return modal;
}
