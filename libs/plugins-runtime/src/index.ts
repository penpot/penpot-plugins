import 'ses';
import './lib/plugin-modal';

import { ɵloadPlugin } from './lib/load-plugin';
import { setFileState, setPageState, setSelection, setTheme } from './lib/api';
import { getPartialState } from 'plugins-parser';

repairIntrinsics({
  evalTaming: 'unsafeEval',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initialize(api: any) {
  console.log('plugin context');

  globalThis.ɵloadPlugin = ɵloadPlugin;

  console.log(api);

  /* eslint-disable */
  (globalThis as any).getPartialState = (path: string) => {
    return getPartialState(path, api.getState());
  };

  api.addListener('plugin-page', 'page', (page: any) => {
    console.log('Page Changed:', page);

    const workspaceData = getPartialState(
      'root/:workspace-data',
      api.getState()
    );

    setPageState(workspaceData.pagesIndex['#' + page.id]);
  });

  api.addListener('plugin-file', 'file', (file: any) => {
    console.log('File Changed:', file);

    setFileState(file);
  });

  api.addListener(
    'plugin-selection',
    'selection',
    (selection: { uuid: string }[]) => {
      console.log('Selection Changed:', selection);

      setSelection(selection.map(({ uuid }) => uuid));
    }
  );

  api.addListener('plugin-theme', 'theme', (theme: 'light' | 'default') => {
    console.log('Theme change:', theme);

    const newTheme: Theme = theme === 'default' ? 'dark' : theme;

    setTheme(newTheme);
  });
}
