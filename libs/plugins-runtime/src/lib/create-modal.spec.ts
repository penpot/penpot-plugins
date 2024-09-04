import { describe, it, expect, vi } from 'vitest';
import { createModal } from './create-modal.js';
import type { Theme } from '@penpot/plugin-types';
import type { OpenUIOptions } from './models/open-ui-options.model';
import type { PluginModalElement } from './modal/plugin-modal';

describe('createModal', () => {
  const modalMock = {
    setTheme: vi.fn(),
    style: {
      setProperty: vi.fn(),
    },
    setAttribute: vi.fn(),
  } as unknown as PluginModalElement;

  const appendChildSpy = vi
    .spyOn(document.body, 'appendChild')
    .mockReturnValue(modalMock);

  const createElementSpy = vi
    .spyOn(document, 'createElement')
    .mockReturnValue(modalMock);

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should create and configure a modal element', () => {
    const theme: Theme = 'light';
    const options: OpenUIOptions = { width: 400, height: 600 };

    const modal = createModal(
      'Test Modal',
      'https://example.com',
      theme,
      options
    );

    expect(createElementSpy).toHaveBeenCalledWith('plugin-modal');
    expect(modal.setTheme).toHaveBeenCalledWith(theme);

    expect(modal.style.setProperty).toHaveBeenCalledWith(
      '--modal-block-start',
      '40px'
    );
    expect(modal.style.setProperty).toHaveBeenCalledWith(
      '--modal-inline-end',
      '320px'
    );

    expect(modal.setAttribute).toHaveBeenCalledWith('title', 'Test Modal');
    expect(modal.setAttribute).toHaveBeenCalledWith(
      'iframe-src',
      'https://example.com'
    );
    expect(modal.setAttribute).toHaveBeenCalledWith('width', '400');
    expect(modal.setAttribute).toHaveBeenCalledWith('height', '600');

    expect(appendChildSpy).toHaveBeenCalledWith(modal);
  });

  it('should apply default dimensions if options are not provided', () => {
    const theme: Theme = 'light';

    const modal = createModal('Test Modal', 'https://example.com', theme);

    expect(modal.setAttribute).toHaveBeenCalledWith('width', '335');
    expect(modal.setAttribute).toHaveBeenCalledWith('height', '590');
  });

  it('should limit modal dimensions to the window size', () => {
    const theme: Theme = 'light';
    const options: OpenUIOptions = { width: 2000, height: 2000 };

    window.innerWidth = 1000;
    window.innerHeight = 800;

    const modal = createModal(
      'Test Modal',
      'https://example.com',
      theme,
      options
    );

    const expectedWidth = 680; // 1000 - 320 (initialPosition.inlineEnd)
    const expectedHeight = 760; // 800 - 40 (initialPosition.blockStart)

    expect(modal.setAttribute).toHaveBeenCalledWith(
      'width',
      String(expectedWidth)
    );
    expect(modal.setAttribute).toHaveBeenCalledWith(
      'height',
      String(expectedHeight)
    );
  });

  it('should apply minimum dimensions to the modal', () => {
    const theme: Theme = 'light';
    const options: OpenUIOptions = { width: 100, height: 100 };

    const modal = createModal(
      'Test Modal',
      'https://example.com',
      theme,
      options
    );

    expect(modal.setAttribute).toHaveBeenCalledWith('width', '200');
    expect(modal.setAttribute).toHaveBeenCalledWith('height', '200');
  });
});
