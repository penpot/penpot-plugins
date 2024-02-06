import { OpenUIOptions } from './models/open-ui-options.model';

export function createModal(name: string, url: string, options: OpenUIOptions) {
  const modal = document.createElement('plugin-modal');

  modal.setAttribute('title', name);
  modal.setAttribute('iframe-src', url);
  modal.setAttribute('width', String(options.width || 300));
  modal.setAttribute('height', String(options.height || 400));

  document.body.appendChild(modal);

  return modal;
}
