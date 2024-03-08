import 'ses';
import './lib/plugin-modal';

import { ɵloadPlugin } from './lib/load-plugin';
import { setFileState, setPageState, setSelection, setTheme } from './lib/api';
import { getSelectedUuids } from 'plugins-parser';

repairIntrinsics({
  evalTaming: 'unsafeEval',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initialize(api: any) {
  console.log('plugin context');

  globalThis.ɵloadPlugin = ɵloadPlugin;

  console.log(api);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api.addListener('plugin-page', 'page', (page: any) => {
    console.log('Page Changed:', page);

    setPageState(page);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api.addListener('plugin-file', 'file', (file: any) => {
    console.log('File Changed:', file);

    setFileState(file);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api.addListener('plugin-selection', 'selection', (selection: any) => {
    const selectionData = getSelectedUuids(selection);
    console.log('Selection Changed:', selectionData);

    setSelection(selectionData);
  });

  api.addListener('plugin-theme', 'theme', (theme: 'light' | 'default') => {
    console.log('Theme change:', theme);

    const newTheme: Theme = theme === 'default' ? 'dark' : theme;

    setTheme(newTheme);
  });
}
