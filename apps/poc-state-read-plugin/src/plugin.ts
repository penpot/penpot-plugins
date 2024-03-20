penpot.ui.open('Plugin name', 'http://localhost:4202', {
  width: 500,
  height: 600,
});

penpot.ui.onMessage<{ content: string }>((message) => {
  if (message.content === 'close') {
    penpot.closePlugin();
  } else if (message.content === 'ready') {
    const pageState = penpot.getPageState();
    const fileState = penpot.getFileState();

    if (!pageState || !fileState) {
      return;
    }

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

penpot.on('pagechange', (page) => {
  penpot.ui.sendMessage({
    type: 'page',
    content: {
      name: page.name,
      id: page.id,
    },
  });
});

penpot.on('filechange', (file) => {
  penpot.ui.sendMessage({
    type: 'file',
    content: {
      name: file.name,
      id: file.id,
      revn: file.revn,
    },
  });
});

penpot.on('selectionchange', (selection) => {
  penpot.ui.sendMessage({ type: 'selection', content: [...selection] });
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme });
});
