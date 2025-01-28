import type { OpenUIOptions } from './models/open-ui-options.model.js';
import type { Theme } from '@penpot/plugin-types';
import type { PluginModalElement } from './modal/plugin-modal.js';

export function createModal(
  name: string,
  url: string,
  theme: Theme,
  options?: OpenUIOptions,
  allowDownloads?: boolean,
) {
  const modal = document.createElement('plugin-modal') as PluginModalElement;

  modal.setTheme(theme);

  const { width } = resizeModal(modal, options?.width, options?.height);

  const initialPosition = {
    blockStart: 40,
    // To be able to resize the element as expected the position must be absolute from the right.
    // This value is the length of the window minus the width of the element plus the width of the design tab.
    inlineStart: window.innerWidth - width - 290,
  };

  modal.style.setProperty(
    '--modal-block-start',
    `${initialPosition.blockStart}px`,
  );
  modal.style.setProperty(
    '--modal-inline-start',
    `${initialPosition.inlineStart}px`,
  );

  modal.setAttribute('title', name);
  modal.setAttribute('iframe-src', url);

  if (allowDownloads) {
    modal.setAttribute('allow-downloads', 'true');
  }

  document.body.appendChild(modal);

  return modal;
}

export function resizeModal(
  modal: PluginModalElement,
  width: number = 335,
  height: number = 590,
) {
  const minPluginWidth = 200;
  const minPluginHeight = 200;

  const maxWidth = width > window.innerWidth ? window.innerWidth - 290 : width;

  const blockStart = parseInt(
    modal.style.getPropertyValue('--modal-block-start') || '40',
    10,
  );

  const maxHeight = window.innerHeight - blockStart;
  width = Math.min(width, maxWidth);
  height = Math.min(height, maxHeight);

  width = Math.max(width, minPluginWidth);
  height = Math.max(height, minPluginHeight);

  modal.wrapper.style.width = `${width}px`;
  modal.wrapper.style.minWidth = `${width}px`;
  modal.wrapper.style.height = `${height}px`;
  modal.wrapper.style.minHeight = `${height}px`;

  return { width, height };
}
