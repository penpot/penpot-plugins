import type { PluginMessageEvent, PluginUIEvent } from './model.js';

penpot.ui.open('CONTRAST PLUGIN', `?theme=${penpot.getTheme()}`, {
  width: 235,
  height: 445,
});

penpot.ui.onMessage<PluginUIEvent>((message) => {
  if (message.type === 'ready') {
    sendMessage({
      type: 'init',
      content: {
        theme: penpot.getTheme(),
        selection: penpot.getSelectedShapes(),
      },
    });
  }
});

penpot.on('selectionchange', () => {
  const shapes = penpot.getSelectedShapes();
  sendMessage({ type: 'selection', content: shapes });
});

penpot.on('themechange', () => {
  const theme = penpot.getTheme();
  sendMessage({ type: 'theme', content: theme });
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}
