const GRID = [5, 5];

penpot.ui.open('Plugin name', '', {
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
    const center = penpot.viewport.center;
    shape.x = center.x;
    shape.y = center.y;
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
      } else if (penpot.utils.types.isRectangle(shape)) {
        const width = Math.ceil(shape.width);
        const height = Math.ceil(shape.height);
        penpot
          .uploadMediaUrl(
            'placeholder',
            `https://picsum.photos/${width}/${height}`
          )
          .then((data) => {
            shape.fills = [{ fillOpacity: 1, fillImage: data }];
          })
          .catch((err) => console.error(err));
      }
    }
  } else if (message.content === 'add-icon') {
    const iconStr = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg
           width="32"
           height="32"
           fill="#aa2727"
           viewBox="0 0 24 24"
           version="1.1"
           id="svg1038"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:svg="http://www.w3.org/2000/svg">
          <defs
             id="defs1042" />
          <path
             d="m 12.036278,21.614293 c -5.3352879,0 -9.6752019,-4.339914 -9.6752019,-9.674229 0,-5.334314 4.339914,-9.6742275 9.6752019,-9.6742275 5.335289,0 9.675202,4.3399135 9.675202,9.6742275 0,5.334315 -4.339913,9.674229 -9.675202,9.674229 z"
             id="path1034-5"
             style="fill:#ffff00;stroke-width:0.973948" />
          <g
             id="g1036">
            <path
               d="m 15.811,10.399 c 0.45,-0.46 -0.25,-1.17 -0.71,-0.71 l -3.56,3.56 c -0.58,-0.58 -1.16,-1.16 -1.73,-1.73 -0.46,-0.46 -1.17,0.25 -0.71,0.71 l 2.08,2.08 c 0.2,0.19 0.52,0.19 0.71,0 z"
               id="path1032" />
            <path
               d="M 12,21.933 C 6.522,21.933 2.066,17.477 2.066,12 2.066,6.523 6.522,2.067 12,2.067 c 5.478,0 9.934,4.456 9.934,9.933 0,5.477 -4.456,9.933 -9.934,9.933 z M 12,3.067 c -4.926,0 -8.934,4.007 -8.934,8.933 0,4.926 4.008,8.933 8.934,8.933 4.926,0 8.934,-4.007 8.934,-8.933 0,-4.926 -4.008,-8.933 -8.934,-8.933 z"
               id="path1034" />
          </g>
</svg>`;
    const shape = penpot.createShapeFromSvg(iconStr);
    const center = penpot.viewport.center;
    shape.x = center.x;
    shape.y = center.y;
  } else if (message.content === 'create-grid') {
    const frame = penpot.createFrame();
    frame.name = 'Frame Grid';

    const viewport = penpot.viewport;
    frame.x = viewport.center.x - 150;
    frame.y = viewport.center.y - 200;
    frame.resize(300, 400);

    // create grid
    const grid = frame.addGridLayout();
    const [numRows, numCols] = GRID;

    for (let i = 0; i < numRows; i++) {
      grid.addRow('auto');
    }

    for (let i = 0; i < numCols; i++) {
      grid.addColumn('auto');
    }

    grid.alignItems = 'center';
    grid.justifyItems = 'start';
    grid.justifyContent = 'space-between';
    grid.alignContent = 'stretch';
    grid.rowGap = 1;
    grid.columnGap = 2;
    grid.verticalPadding = 3;
    grid.horizontalPadding = 4;

    // create text
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const text = penpot.createText(`${row + 1} - ${col + 1}`);
        text.growType = 'auto-width';
        grid.appendChild(text, row + 1, col + 1);
      }
    }
  } else if (message.content === 'create-colors') {
    const frame = penpot.createFrame();
    frame.name = 'Palette';

    const viewport = penpot.viewport;
    frame.x = viewport.center.x - 150;
    frame.y = viewport.center.y - 200;

    const colors = penpot.library.local.colors.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : 0
    );

    if (colors.length === 0) {
      // NO colors return
      return;
    }

    const cols = 3;
    const rows = Math.ceil(colors.length / 3);

    const width = cols * 150 + Math.max(0, cols - 1) * 10 + 20;
    const height = rows * 100 + Math.max(0, rows - 1) * 10 + 20;

    frame.resize(width, height);
    frame.borderRadius = 8;

    // create grid
    const grid = frame.addGridLayout();

    for (let i = 0; i < rows; i++) {
      grid.addRow('auto');
    }

    for (let i = 0; i < cols; i++) {
      grid.addColumn('auto');
    }

    grid.alignItems = 'center';
    grid.justifyItems = 'start';
    grid.justifyContent = 'stretch';
    grid.alignContent = 'stretch';
    grid.rowGap = 10;
    grid.columnGap = 10;
    grid.verticalPadding = 10;
    grid.horizontalPadding = 10;

    // These properties are not mandatory, if not defined will apply the default values
    frame.shadows = [
      {
        style: 'drop-shadow',
        offsetX: 5,
        offsetY: 5,
        blur: 4,
        spread: 5,
        color: {
          color: '#000000',
          opacity: 0.3,
        },
      },
    ];

    // create text
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const color = colors[i];

        if (i >= colors.length) {
          return;
        }

        const board = penpot.createFrame();
        grid.appendChild(board, row + 1, col + 1);
        board.fills = [color.asFill()];
        board.strokes = [
          { strokeColor: '#000000', strokeOpacity: 0.3, strokeStyle: 'solid' },
        ];

        if (board.layoutChild) {
          board.layoutChild.horizontalSizing = 'fill';
          board.layoutChild.verticalSizing = 'fill';
        }

        const flex = board.addFlexLayout();
        flex.alignItems = 'center';
        flex.justifyContent = 'center';

        const text = penpot.createText(color.name);
        text.growType = 'auto-width';
        board.appendChild(text);
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

  if (!file) {
    return;
  }

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
