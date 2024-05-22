penpot.ui.open('Contrast plugin', '', {
  width: 450,
  height: 625,
});

penpot.ui.onMessage<{ content: string }>((message) => {
  if (message.content === 'ready') {
    penpot.ui.sendMessage({
      type: 'init',
      content: {
        theme: penpot.getTheme(),
        shapes: penpot.getSelectedShapes(),
      },
    });
  }
});

penpot.on('selectionchange', () => {
  const shapes = penpot.getSelectedShapes();
  penpot.ui.sendMessage({ type: 'selection', content: { shapes } });
});

penpot.on('themechange', () => {
  const theme = penpot.getTheme();
  penpot.ui.sendMessage({ type: 'theme', content: { theme } });
});
