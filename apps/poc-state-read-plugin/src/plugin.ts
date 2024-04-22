penpot.ui.open('Plugin name', 'http://localhost:4202', {
  width: 500,
  height: 600,
});

penpot.ui.onMessage<{ content: string; data: unknown }>((message) => {
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
        selection: penpot.getSelectedShapes(),
      },
    });
  } else if (message.content === 'change-name') {
    const shape = penpot
      .getPage()
      ?.getShapeById('' + (message.data as { id: string }).id);
    if (shape) {
      shape.name = (message.data as { name: string }).name;
    }
  } else if (message.content === 'create-rect') {
    const shape = penpot.createRectangle();
    penpot.log(shape);
  } else if (message.content === 'move-x') {
    const shape = penpot
      .getPage()
      ?.getShapeById('' + (message.data as { id: string }).id);
    if (shape) {
      shape.x += 100;
    }
  } else if (message.content === 'move-y') {
    const shape = penpot
      .getPage()
      ?.getShapeById('' + (message.data as { id: string }).id);
    if (shape) {
      shape.y += 100;
    }
  } else if (message.content === 'resize-w') {
    const shape = penpot
      .getPage()
      ?.getShapeById('' + (message.data as { id: string }).id);
    if (shape) {
      shape.resize(shape.width * 2, shape.height);
    }
  } else if (message.content === 'resize-h') {
    const shape = penpot
      .getPage()
      ?.getShapeById('' + (message.data as { id: string }).id);
    if (shape) {
      shape.resize(shape.width, shape.height * 2);
    }
  } else if (message.content === 'lorem-ipsum') {
    const selection = penpot.selection;

    for (const shape of selection) {
      if (penpot.utils.types.isText(shape)) {
        shape.characters = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id mauris ut felis finibus congue. Ut odio ipsum, condimentum id tellus sit amet, dapibus sagittis ligula. Pellentesque hendrerit, nulla sit amet aliquet scelerisque, orci nunc commodo tellus, quis hendrerit nisl massa non tellus.

Phasellus fringilla tortor elit, ac dictum tellus posuere sodales. Ut eget imperdiet ante. Nunc eros magna, tincidunt non finibus in, tempor elementum nunc. Sed commodo magna in arcu aliquam efficitur.`;
      }
    }
  }
});

penpot.on('pagechange', () => {
  const page = penpot.getPage();
  const shapes = page?.findShapes();

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
      id: file.id,
    },
  });
});

penpot.on('selectionchange', () => {
  const selection = penpot.getSelectedShapes();
  penpot.ui.sendMessage({ type: 'selection', content: { selection } });
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme });
});
