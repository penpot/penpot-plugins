import { describe, it, vi, expect, beforeEach, afterEach, Mock } from 'vitest';
import { loadPlugin, setContextBuilder } from './load-plugin.js';
import { loadManifestCode } from './parse-manifest.js';
import { createApi, themeChange } from './api/index.js';
import type { PenpotContext, PenpotTheme } from '@penpot/plugin-types';
import type { Manifest } from './models/manifest.model.js';
import { ses } from './ses.js';

vi.mock('./parse-manifest.js', () => ({
  loadManifestCode: vi.fn(),
}));

vi.mock('./api/index.js', () => ({
  createApi: vi.fn(),
  themeChange: vi.fn(),
}));

vi.mock('./ses.js', () => ({
  ses: {
    hardenIntrinsics: vi.fn().mockReturnValue(null),
    createCompartment: vi.fn().mockReturnValue({
      evaluate: vi.fn(),
    }),
    harden: vi.fn().mockImplementation((obj) => obj),
  },
}));

describe('loadPlugin', () => {
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

    (createApi as Mock).mockReturnValue(mockApi);
    (loadManifestCode as Mock).mockResolvedValue(
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

  it('should clear timeouts on plugin close', async () => {
    await loadPlugin(manifest);

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const timeoutCallback = vi.fn();
    const timeoutId = setTimeout(timeoutCallback, 1000);
    clearTimeout(timeoutId);

    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
    expect(setTimeoutSpy).toHaveBeenCalled();
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
    vi.spyOn(globalThis, 'clearTimeout');

    let closedCallback = () => {};

    (createApi as Mock).mockImplementation((context, manifest, closed) => {
      closedCallback = closed;

      return mockApi;
    });

    const plugin = await loadPlugin(manifest);

    if (!plugin) {
      throw new Error('Plugin not loaded');
    }

    plugin.publicPluginApi.setTimeout(() => {}, 1000);
    plugin.publicPluginApi.setTimeout(() => {}, 1000);

    expect(plugin.timeouts.size).toBe(2);

    closedCallback();

    expect(plugin.timeouts.size).toBe(0);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
  });

  it('should close plugin on evaluation error', async () => {
    ses.createCompartment = vi.fn().mockImplementation(() => {
      return {
        evaluate: vi.fn().mockImplementation(() => {
          throw new Error('Error in plugin');
        }),
      };
    });

    await loadPlugin(manifest);

    expect(mockApi.closePlugin).toHaveBeenCalled();
  });
});
