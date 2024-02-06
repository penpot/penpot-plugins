/* eslint-disable @typescript-eslint/no-explicit-any */
export function initialize(api: any) {
  console.log('plugin context');
  console.log(api);

  api.addListener('plugin-page', 'page', (page: any) => {
    console.log('Page Changed:', page);
  });

  api.addListener('plugin file', 'file', (file: any) => {
    console.log('File Changed:', file);
  });
}
