import puppeteer from 'puppeteer'; // or import puppeteer from 'puppeteer-core';
import { PenpotApi } from './utils/api';
import { getFileUrl } from './utils/get-file-url';
import testingPlugin from './plugins/one';

describe('Plugins', () => {
  it('WIP', { timeout: 10000 }, async () => {
    const penpotApi = await PenpotApi();

    const file = await penpotApi.createFile();
    const fileUrl = getFileUrl(file);

    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    page.setCookie({
      name: 'auth-token',
      value: penpotApi.getAuth().split('=')[1],
      domain: 'localhost',
      path: '/',
      expires: (Date.now() + 3600 * 1000) / 1000,
    });

    await page.goto(fileUrl);

    await page.waitForSelector('.viewport');

    const result = await page.evaluate((testingPlugin) => {
      (globalThis as any).ɵloadPlugin({
        name: 'Test',
        code: `
          (${testingPlugin})();
        `,
        icon: '',
        description: '',
        permissions: ['page:read', 'file:read', 'selection:read'],
      });
    }, testingPlugin.toString());

    await page.waitForSelector(
      '.main_ui_workspace_right_header__saved-status',
      {
        timeout: 10000,
      }
    );

    // await page.screenshot({ path: 'example.png' });

    await browser.close();
  });
});
