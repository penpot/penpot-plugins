penpot.ui.open('Plugin name', 'http://localhost:4202', {
  width: 500,
  height: 600,
});

penpot.ui.onMessage<{ content: string }>((message) => {
  if (message.content === 'close') {
    penpot.closePlugin();
  } else if (message.content === 'ready') {
    const page = penpot.getPage();
    const file = penpot.getFile();

    if (!page || !file) {
      return;
    }

    penpot.ui.sendMessage({
      type: 'init',
      content: {
        name: page.name,
        pageId: page.id,
        fileId: file.id,
        revn: file.revn,
        theme: penpot.getTheme(),
        selection: penpot.getSelected(),
      },
    });
  }
});

penpot.on('pagechange', () => {
  const page = penpot.getPage();
  const shapes = page.findShapes();

  penpot.ui.sendMessage({
    type: 'page',
    content: { page, shapes },
  });
});

penpot.on('filechange', () => {
  const file = penpot.getFile();
  penpot.ui.sendMessage({
    type: 'file',
    content: {
      id: file.id
    },
  });
});

penpot.on('selectionchange', () => {
  // const selected = await penpot.queryObject({id: selection[0]});
  const selected: string[] = penpot.getSelected();
  penpot.ui.sendMessage({ type: 'selection', content: selected });
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme });
});
