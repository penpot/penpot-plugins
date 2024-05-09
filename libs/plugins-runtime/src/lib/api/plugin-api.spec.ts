import { expect, describe, vi } from 'vitest';
import { createApi, triggerEvent, uiMessagesCallbacks } from './index.js';
import openUIApi from './openUI.api.js';
import { FileState } from '@penpot/plugin-types';

vi.mock('./openUI.api', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      removeEventListener: vi.fn(),
      remove: vi.fn(),
      setAttribute: vi.fn(),
      setTheme: vi.fn(),
    })),
  };
});

vi.hoisted(() => {
  const addEventListenerMock = vi.fn();
  window.addEventListener = addEventListenerMock;
});

describe('Plugin api', () => {
  const mockContext = {
    addListener: vi.fn(),
    getFile: vi.fn(),
    getPage: vi.fn(),
    getSelected: vi.fn(),
    getSelectedShapes: vi.fn(),
    getTheme: vi.fn(() => 'dark'),
  };

  const api = createApi(mockContext, {
    name: 'test',
    code: '',
    permissions: ['page:read', 'file:read', 'selection:read'],
  });

  const addEventListenerMock = vi.mocked(window.addEventListener);
  const messageEvent = addEventListenerMock.mock.calls[0][1] as EventListener;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ui', () => {
    it('open', () => {
      const name = 'test';
      const url = 'http://fake.com';
      const options = { width: 100, height: 100 };
      const openUIApiMock = vi.mocked(openUIApi);

      api.ui.open(name, url, options);

      const modalMock = openUIApiMock.mock.results[0].value;

      expect(openUIApiMock).toHaveBeenCalledWith(name, url, 'dark', options);
      expect(modalMock.addEventListener).toHaveBeenCalledWith(
        'close',
        expect.any(Function),
        { once: true }
      );
    });

    it('sendMessage', () => {
      const name = 'test';
      const url = 'http://fake.com';
      const options = { width: 100, height: 100 };
      const message = { test: 'test' };
      const openUIApiMock = vi.mocked(openUIApi);

      api.ui.open(name, url, options);
      api.ui.sendMessage(message);

      const modalMock = openUIApiMock.mock.results[0].value;
      const eventPassedToDispatchEvent =
        modalMock.dispatchEvent.mock.calls[0][0];

      expect(modalMock.dispatchEvent).toHaveBeenCalled();
      expect(eventPassedToDispatchEvent.type).toBe('message');
      expect(eventPassedToDispatchEvent.detail).toBe(message);
    });

    it('onMessage', () => {
      const message = new MessageEvent('message', {
        data: {
          test: 'test',
        },
      });

      const callback = vi.fn();

      api.ui.onMessage(callback);
      messageEvent(message);

      expect(uiMessagesCallbacks.length).toEqual(1);
      expect(callback).toHaveBeenCalledWith(message.data);
    });
  });

  describe('events', () => {
    it('invalid event', () => {
      expect(() => {
        api.on('invalid' as any, vi.fn());
      }).toThrow();
    });

    it('pagechange', () => {
      const callback = vi.fn();

      api.on('pagechange', callback);

      triggerEvent('pagechange', 'test' as any);

      api.off('pagechange', callback);

      triggerEvent('pagechange', 'test' as any);

      expect(callback).toHaveBeenCalledWith('test');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('filechange', () => {
      const callback = vi.fn();

      api.on('filechange', callback);

      triggerEvent('filechange', 'test' as any);

      api.off('filechange', callback);

      triggerEvent('filechange', 'test' as any);

      expect(callback).toHaveBeenCalledWith('test');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('selectionchange', () => {
    const callback = vi.fn();

    api.on('selectionchange', callback);

    triggerEvent('selectionchange', 'test' as any);

    api.off('selectionchange', callback);

    triggerEvent('selectionchange', 'test' as any);

    expect(callback).toHaveBeenCalledWith('test');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('themechange', () => {
    const callback = vi.fn();

    api.on('themechange', callback);

    triggerEvent('themechange', 'light');

    api.off('themechange', callback);

    triggerEvent('themechange', 'light');

    expect(callback).toHaveBeenCalledWith('light');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  describe.concurrent('permissions', () => {
    const api = createApi({
      name: 'test',
      code: '',
      permissions: [],
    });

    it('on', () => {
      const callback = vi.fn();

      expect(() => {
        api.on('filechange', callback);
      }).toThrow();

      expect(() => {
        api.on('pagechange', callback);
      }).toThrow();

      expect(() => {
        api.on('selectionchange', callback);
      }).toThrow();
    });

    it('get states', () => {
      expect(() => {
        api.getFileState();
      }).toThrow();

      expect(() => {
        api.getPageState();
      }).toThrow();

      expect(() => {
        api.getSelection();
      }).toThrow();
    });
  });

  it('get file state', () => {
    const examplePage = {
      name: 'test',
      id: '123',
    };

    mockContext.getPage.mockImplementation(() => examplePage);

    const pageState = api.getPage();

    expect(pageState).toEqual(examplePage);
  });

  it('get page state', () => {
    const exampleFile = {
      name: 'test',
      id: '123',
      revn: 0,
    } as FileState;

    mockContext.getFile.mockImplementation(() => exampleFile);

    const fileState = api.getFile();

    expect(fileState).toEqual(exampleFile);
  });

  it('get selection', () => {
    const selection = ['123'];

    mockContext.getSelected.mockImplementation(() => selection);

    const currentSelection = api.getSelected();

    expect(currentSelection).toEqual(selection);
  });

  it('set theme refresh modal theme', () => {
    const name = 'test';
    const url = 'http://fake.com';
    const options = { width: 100, height: 100 };
    const openUIApiMock = vi.mocked(openUIApi);

    mockContext.getTheme.mockImplementation(() => 'light');

    api.ui.open(name, url, options);

    const modalMock = openUIApiMock.mock.results[0].value;
    expect(modalMock.setTheme).toHaveBeenCalledWith('light');
    expect(api.getTheme()).toBe('light');

    triggerEvent('themechange', 'dark' as any);
    expect(modalMock.setTheme).toHaveBeenCalledWith('dark');
  });

  it('close puglin', () => {
    const name = 'test';
    const url = 'http://fake.com';
    const options = { width: 100, height: 100 };
    const openUIApiMock = vi.mocked(openUIApi);
    const callback = vi.fn();

    api.ui.open(name, url, options);
    api.ui.onMessage(callback);

    api.closePlugin();

    const modalMock = openUIApiMock.mock.results[0].value;

    expect(modalMock.remove).toHaveBeenCalled();
    expect(modalMock.removeEventListener).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(uiMessagesCallbacks).toEqual([]);
  });
});
