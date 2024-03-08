penpot.ui.open('Contrast plugin', 'http://localhost:4201', {
  width: 450,
  height: 625,
});

penpot.ui.onMessage<{ content: string }>((message) => {
  if (message.content === 'ready') {
    const pageState = penpot.getPageState();
    const fileState = penpot.getFileState();

    penpot.ui.sendMessage({
      type: 'init',
      content: {
        name: pageState.name,
        pageId: pageState.id,
        fileId: fileState.id,
        revn: fileState.revn,
        theme: penpot.getTheme(),
        selection: penpot.getSelection(),
      },
    });
  }
});

penpot.on('selectionchange', (id) => {
  penpot.ui.sendMessage({ type: 'selection', content: id });
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme });
});
