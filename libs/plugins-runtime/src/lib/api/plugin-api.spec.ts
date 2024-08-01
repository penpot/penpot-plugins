import { expect, describe, vi } from 'vitest';
import { createApi, themeChange, uiMessagesCallbacks } from './index.js';
import openUIApi from './openUI.api.js';
import type { PenpotFile } from '@penpot/plugin-types';

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
    getFile: vi.fn(),
    getPage: vi.fn(),
    getSelected: vi.fn(),
    getSelectedShapes: vi.fn(),
    getTheme: vi.fn(() => 'dark'),
    addListener: vi.fn().mockReturnValueOnce(Symbol()),
    removeListener: vi.fn(),
  };

  const api = createApi(
    mockContext as any,
    {
      pluginId: 'test',
      name: 'test',
      code: '',
      host: 'http://fake.com',
      permissions: [
        'content:read',
        'content:write',
        'library:read',
        'library:write',
        'user:read',
      ],
    },
    () => {}
  );

  const addEventListenerMock = vi.mocked(window.addEventListener);
  const messageEvent = addEventListenerMock.mock.calls[0][1] as EventListener;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ui', () => {
    it('open', () => {
      const name = 'test';
      const url = 'http://fake.com/';
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
      const url = 'http://fake.com/';
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

      const id = api.on('pagechange', callback);
      expect(mockContext.addListener).toHaveBeenCalled();
      expect((mockContext.addListener.mock as any).lastCall[0]).toBe(
        'pagechange'
      );
      expect((mockContext.addListener.mock as any).lastCall[1]).toBe(callback);

      api.off(id);
      expect(mockContext.removeListener).toHaveBeenCalled();
      expect((mockContext.removeListener.mock as any).lastCall[0]).toBe(id);
    });

    it('remove event on close plugin', () => {
      const callback = vi.fn();

      api.on('pagechange', callback);
      api.closePlugin();

      expect(mockContext.removeListener).toHaveBeenCalled();
    });
  });

  describe.concurrent('permissions', () => {
    const api = createApi(
      {} as any,
      {
        name: 'test',
        code: '',
        permissions: [],
      } as any,
      () => {}
    );

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
        api.getFile();
      }).toThrow();

      expect(() => {
        api.getPage();
      }).toThrow();

      expect(() => {
        api.getSelected();
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
    } as PenpotFile;

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

    themeChange('dark');
    expect(modalMock.setTheme).toHaveBeenCalledWith('dark');
  });

  it('close plugin', () => {
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
