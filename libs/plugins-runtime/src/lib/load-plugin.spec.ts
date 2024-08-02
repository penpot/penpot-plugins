import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { loadPlugin, setContextBuilder } from './load-plugin.js';
import { loadManifestCode } from './parse-manifest.js';
import { createApi, themeChange } from './api/index.js';
import type { PenpotContext, PenpotTheme } from '@penpot/plugin-types';
import type { Manifest } from './models/manifest.model.js';

vi.mock('./parse-manifest.js', () => ({
  loadManifestCode: vi.fn(),
}));

vi.mock('./api/index.js', () => ({
  createApi: vi.fn(),
  themeChange: vi.fn(),
}));

const evaluateMock = vi.fn();

vi.mock('./ses.js', () => ({
  ses: {
    hardenIntrinsics: vi.fn().mockReturnValue(null),
    createCompartment: vi.fn().mockImplementation((publicApi) => {
      return {
        evaluate: evaluateMock,
        globalThis: publicApi,
      };
    }),
    harden: vi.fn().mockImplementation((obj) => obj),
  },
}));

describe('loadPlugin', () => {
  vi.spyOn(globalThis, 'clearTimeout');
  vi.spyOn(globalThis.console, 'error').mockImplementation(() => {});

  let mockContext: PenpotContext;
  let manifest: Manifest = {
    pluginId: 'test-plugin',
    name: 'Test Plugin',
    host: '',
    code: '',
    permissions: [
      'content:read',
      'content:write',
      'library:read',
      'library:write',
      'user:read',
    ],
  };
  let mockApi: ReturnType<typeof createApi>;
  let addListenerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addListenerMock = vi.fn();
    mockContext = {
      addListener: addListenerMock,
      removeListener: vi.fn(),
    } as unknown as PenpotContext;

    mockApi = {
      closePlugin: vi.fn(),
    } as unknown as ReturnType<typeof createApi>;

    vi.mocked(createApi).mockReturnValue(mockApi);
    vi.mocked(loadManifestCode).mockResolvedValue(
      'console.log("Plugin loaded");'
    );
    setContextBuilder(() => mockContext);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set up the context and load the manifest code', async () => {
    await loadPlugin(manifest);

    expect(loadManifestCode).toHaveBeenCalledWith(manifest);
    expect(createApi).toHaveBeenCalledWith(
      mockContext,
      manifest,
      expect.any(Function)
    );
  });

  it('should handle theme change events', async () => {
    await loadPlugin(manifest);

    const themeChangeListener = addListenerMock.mock.calls
      .find((call) => call[0] === 'themechange')
      ?.at(1);

    const mockTheme: PenpotTheme = 'dark';
    themeChangeListener(mockTheme);

    expect(themeChange).toHaveBeenCalledWith(mockTheme);
  });

  it('should close all plugins when a new plugin is loaded', async () => {
    await loadPlugin(manifest);
    await loadPlugin(manifest);

    expect(mockApi.closePlugin).toHaveBeenCalledTimes(1);
  });

  it('should remove finish event listener on plugin finish', async () => {
    await loadPlugin(manifest);

    const finishListener = addListenerMock.mock.calls
      .find((call) => call[0] === 'finish')
      ?.at(1);

    finishListener();

    expect(mockContext.removeListener).toHaveBeenCalled();
  });

  it('shoud clean setTimeout when plugin is closed', async () => {
    const plugin = await loadPlugin(manifest);

    if (!plugin) {
      throw new Error('Plugin not loaded');
    }

    plugin.publicPluginApi.setTimeout(() => {}, 1000);
    plugin.publicPluginApi.setTimeout(() => {}, 1000);

    expect(plugin.timeouts.size).toBe(2);

    const closedCallback = vi.mocked(createApi).mock.calls[0][2];
    closedCallback();

    expect(plugin.timeouts.size).toBe(0);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
  });

  it('should close plugin on evaluation error', async () => {
    evaluateMock.mockImplementationOnce(() => {
      throw new Error('Evaluation error');
    });

    await loadPlugin(manifest);

    expect(mockApi.closePlugin).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should prevent using the api after closing the plugin', async () => {
    const plugin = await loadPlugin(manifest);

    if (!plugin) {
      throw new Error('Plugin not loaded');
    }

    expect(
      Object.keys(plugin.compartment.globalThis).filter((it) => !!it).length
    ).toBeGreaterThan(0);

    const closedCallback = vi.mocked(createApi).mock.calls[0][2];
    closedCallback();

    expect(
      Object.keys(plugin.compartment.globalThis).filter((it) => !!it).length
    ).toBe(0);
  });
});
