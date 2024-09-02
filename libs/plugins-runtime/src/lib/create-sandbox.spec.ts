import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { createSandbox } from './create-sandbox.js';
import { createApi } from './api';
import { ses } from './ses.js';
import type { createPluginManager } from './plugin-manager';

vi.mock('./api', () => ({
  createApi: vi.fn(),
}));

vi.mock('./ses.js', () => ({
  ses: {
    hardenIntrinsics: vi.fn(),
    createCompartment: vi.fn().mockImplementation((publicApi) => {
      return {
        evaluate: vi.fn(),
        globalThis: publicApi,
      };
    }),
    harden: vi.fn().mockImplementation((obj) => obj),
  },
}));

describe('createSandbox', () => {
  let mockPlugin: Awaited<ReturnType<typeof createPluginManager>>;
  const compartmentMock = vi.mocked(ses.createCompartment);

  function getLastCompartment() {
    return compartmentMock.mock.results[compartmentMock.mock.results.length - 1]
      .value;
  }

  beforeEach(() => {
    mockPlugin = {
      code: 'console.log("Plugin running");',
      timeouts: new Set<ReturnType<typeof setTimeout>>(),
    } as unknown as Awaited<ReturnType<typeof createPluginManager>>;

    vi.mocked(createApi).mockReturnValue({
      penpot: {
        closePlugin: vi.fn(),
      },
    } as unknown as ReturnType<typeof createApi>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should harden intrinsics and create the plugin API', () => {
    createSandbox(mockPlugin);

    expect(ses.hardenIntrinsics).toHaveBeenCalled();
    expect(createApi).toHaveBeenCalledWith(mockPlugin);
    expect(ses.harden).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should evaluate the plugin code in the compartment', () => {
    const sandbox = createSandbox(mockPlugin);
    const compartment = getLastCompartment();

    sandbox.evaluate();

    expect(compartment.evaluate).toHaveBeenCalledWith(mockPlugin.code);
  });

  it('should add timeouts to the plugin and clean them on clearTimeout', () => {
    const sandbox = createSandbox(mockPlugin);
    const handler = vi.fn();

    const timeoutId = sandbox.compartment.globalThis['setTimeout'](
      handler,
      1000
    );

    expect(timeoutId).toBeDefined();
    expect(mockPlugin.timeouts.has(timeoutId)).toBe(true);

    sandbox.compartment.globalThis['clearTimeout'](timeoutId);

    expect(mockPlugin.timeouts.has(timeoutId)).toBe(false);
  });

  it('should clean the globalThis on cleanGlobalThis', () => {
    const sandbox = createSandbox(mockPlugin);
    const compartment = getLastCompartment();

    sandbox.cleanGlobalThis();

    expect(Object.keys(compartment.globalThis).length).toBe(0);
  });

  it('should ensure fetch requests omit credentials', async () => {
    const sandbox = createSandbox(mockPlugin);
    const fetchSpy = vi
      .spyOn(window, 'fetch')
      .mockResolvedValue(new Response());

    await sandbox.compartment.globalThis['fetch']('https://example.com/api', {
      method: 'GET',
      credentials: 'include',
    });

    expect(fetchSpy).toHaveBeenCalledWith('https://example.com/api', {
      method: 'GET',
      credentials: 'omit',
    });

    fetchSpy.mockRestore();
  });

  it('should prevent using the api after closing the plugin', async () => {
    const sandbox = createSandbox(mockPlugin);

    expect(
      Object.keys(sandbox.compartment.globalThis).filter((it) => !!it).length
    ).toBeGreaterThan(0);

    sandbox.cleanGlobalThis();

    expect(
      Object.keys(sandbox.compartment.globalThis).filter((it) => !!it).length
    ).toBe(0);
  });
});
