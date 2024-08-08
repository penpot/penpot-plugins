import { expect, describe, vi } from 'vitest';
import { createApi, themeChange, uiMessagesCallbacks } from './index.js';
import openUIApi from './openUI.api.js';
import type { PenpotFile } from '@penpot/plugin-types';

const mockUrl = 'http://fake.fake/';

vi.mock('./openUI.api', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addEventListener: vi
        .fn()
        .mockImplementation((type: string, fn: () => void) => {
          if (type === 'load') {
            fn();
          }
        }),
      dispatchEvent: vi.fn(),
      removeEventListener: vi.fn(),
      remove: vi.fn(),
      setAttribute: vi.fn(),
      setTheme: vi.fn(),
      getAttribute: () => {
        return mockUrl;
      },
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

  let api: ReturnType<typeof createApi>;

  const addEventListenerMock = vi.mocked(window.addEventListener);
  const messageEvent = addEventListenerMock.mock.calls[0][1] as EventListener;
  const closedCallback = vi.fn();
  const loadCallback = vi.fn();

  beforeEach(() => {
    api = createApi(
      mockContext as any,
      {
        pluginId: 'test',
        name: 'test',
        code: '',
        host: mockUrl,
        permissions: [
          'content:read',
          'content:write',
          'library:read',
          'library:write',
          'user:read',
        ],
      },
      closedCallback,
      loadCallback
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ui', () => {
    it('open', () => {
      const name = 'test';
      const url = 'http://fake.com/';
      const options = { width: 100, height: 100 };
      const openUIApiMock = vi.mocked(openUIApi);

      api.penpot.ui.open(name, url, options);

      const modalMock = openUIApiMock.mock.results[0].value;

      expect(openUIApiMock).toHaveBeenCalledWith(name, url, 'dark', options);
      expect(modalMock.addEventListener).toHaveBeenCalledWith(
        'close',
        expect.any(Function),
        { once: true }
      );

      expect(modalMock.addEventListener).toHaveBeenCalledWith(
        'load',
        expect.any(Function)
      );

      expect(loadCallback).toHaveBeenCalled();
    });

    it('sendMessage', () => {
      const name = 'test';
      const url = 'http://fake.com/';
      const options = { width: 100, height: 100 };
      const message = { test: 'test' };
      const openUIApiMock = vi.mocked(openUIApi);

      api.penpot.ui.open(name, url, options);
      api.penpot.ui.sendMessage(message);

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

      api.penpot.ui.onMessage(callback);
      messageEvent(message);

      expect(uiMessagesCallbacks.length).toEqual(1);
      expect(callback).toHaveBeenCalledWith(message.data);
    });
  });

  describe('events', () => {
    it('invalid event', () => {
      expect(() => {
        api.penpot.on('invalid' as any, vi.fn());
      }).toThrow();
    });

    it('pagechange', () => {
      const callback = vi.fn();

      const id = api.penpot.on('pagechange', callback);
      expect(mockContext.addListener).toHaveBeenCalled();
      expect((mockContext.addListener.mock as any).lastCall[0]).toBe(
        'pagechange'
      );
      expect((mockContext.addListener.mock as any).lastCall[1]).toBe(callback);

      api.penpot.off(id);
      expect(mockContext.removeListener).toHaveBeenCalled();
      expect((mockContext.removeListener.mock as any).lastCall[0]).toBe(id);
    });

    it('remove event on close plugin', () => {
      const callback = vi.fn();

      api.penpot.on('pagechange', callback);
      api.penpot.closePlugin();

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
      () => {},
      () => {}
    );

    it('on', () => {
      const callback = vi.fn();

      expect(() => {
        api.penpot.on('filechange', callback);
      }).toThrow();

      expect(() => {
        api.penpot.on('pagechange', callback);
      }).toThrow();

      expect(() => {
        api.penpot.on('selectionchange', callback);
      }).toThrow();
    });

    it('get states', () => {
      expect(() => {
        api.penpot.getFile();
      }).toThrow();

      expect(() => {
        api.penpot.getPage();
      }).toThrow();

      expect(() => {
        api.penpot.getSelected();
      }).toThrow();
    });
  });

  it('get file state', () => {
    const examplePage = {
      name: 'test',
      id: '123',
    };

    mockContext.getPage.mockImplementation(() => examplePage);

    const pageState = api.penpot.getPage();

    expect(pageState).toEqual(examplePage);
  });

  it('get page state', () => {
    const exampleFile = {
      name: 'test',
      id: '123',
      revn: 0,
    } as PenpotFile;

    mockContext.getFile.mockImplementation(() => exampleFile);

    const fileState = api.penpot.getFile();

    expect(fileState).toEqual(exampleFile);
  });

  it('get selection', () => {
    const selection = ['123'];

    mockContext.getSelected.mockImplementation(() => selection);

    const currentSelection = api.penpot.getSelected();

    expect(currentSelection).toEqual(selection);
  });

  it('set theme refresh modal theme', () => {
    const name = 'test';
    const url = mockUrl;
    const options = { width: 100, height: 100 };
    const openUIApiMock = vi.mocked(openUIApi);

    mockContext.getTheme.mockImplementation(() => 'light');

    api.penpot.ui.open(name, url, options);

    const modalMock = openUIApiMock.mock.results[0].value;
    expect(modalMock.setTheme).toHaveBeenCalledWith('light');
    expect(api.penpot.getTheme()).toBe('light');

    themeChange('dark');
    expect(modalMock.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should not open twice the same url', () => {
    const name = 'test';
    const url = mockUrl;
    const options = { width: 100, height: 100 };
    const openUIApiMock = vi.mocked(openUIApi);

    api.penpot.ui.open(name, url, options);
    api.penpot.ui.open(name, url, options);

    expect(openUIApiMock).toHaveBeenCalledTimes(1);
  });

  it('open twice diffennt url', () => {
    const name = 'test';
    const url = mockUrl + '1';
    const options = { width: 100, height: 100 };
    const openUIApiMock = vi.mocked(openUIApi);

    api.penpot.ui.open(name, url, options);
    api.penpot.ui.open(name, url, options);

    expect(openUIApiMock).toHaveBeenCalledTimes(2);
  });

  it('close plugin', () => {
    const name = 'test';
    const url = mockUrl;
    const options = { width: 100, height: 100 };
    const openUIApiMock = vi.mocked(openUIApi);
    const callback = vi.fn();

    api.penpot.ui.open(name, url, options);
    api.penpot.ui.onMessage(callback);

    api.penpot.closePlugin();

    const modalMock = openUIApiMock.mock.results[0].value;

    expect(closedCallback).toHaveBeenCalled();
    expect(modalMock.remove).toHaveBeenCalled();
    expect(modalMock.removeEventListener).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(uiMessagesCallbacks).toEqual([]);
  });
});
