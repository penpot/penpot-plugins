import { expect, describe, vi } from 'vitest';
import { createApi } from './index.js';
import type { File } from '@penpot/plugin-types';

const mockUrl = 'http://fake.fake/';

describe('Plugin api', () => {
  function generateMockPluginManager() {
    return {
      manifest: {
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
          'comment:read',
          'comment:write',
          'allow:downloads',
        ],
      },
      openModal: vi.fn(),
      getModal: vi.fn(),
      registerMessageCallback: vi.fn(),
      close: vi.fn(),
      registerListener: vi.fn(),
      destroyListener: vi.fn(),
      context: {
        getFile: vi.fn(),
        getPage: vi.fn(),
        getSelected: vi.fn(),
        getSelectedShapes: vi.fn(),
        getTheme: vi.fn(() => 'dark'),
        addListener: vi.fn().mockReturnValueOnce(Symbol()),
        removeListener: vi.fn(),
      },
    };
  }

  let api: ReturnType<typeof createApi>;
  let pluginManager: ReturnType<typeof generateMockPluginManager>;

  beforeEach(() => {
    pluginManager = generateMockPluginManager();

    api = createApi(pluginManager as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ui', () => {
    describe.concurrent('permissions', () => {
      const api = createApi({
        ...pluginManager,
        permissions: [],
      } as any);

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

      pluginManager.context.getPage.mockImplementation(() => examplePage);

      const pageState = api.penpot.getPage();

      expect(pageState).toEqual(examplePage);
    });

    it('get page state', () => {
      const exampleFile = {
        name: 'test',
        id: '123',
        revn: 0,
      } as File;

      pluginManager.context.getFile.mockImplementation(() => exampleFile);

      const fileState = api.penpot.getFile();

      expect(fileState).toEqual(exampleFile);
    });

    it('get selection', () => {
      const selection = ['123'];

      pluginManager.context.getSelected.mockImplementation(() => selection);

      const currentSelection = api.penpot.getSelected();

      expect(currentSelection).toEqual(selection);
    });
  });
});
