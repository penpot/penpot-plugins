import { PluginMessageEvent } from './app/model';

penpot.ui.open('TABLE PLUGIN', `?theme=${penpot.getTheme()}`, {
  width: 235,
  height: 564,
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme });
});

penpot.ui.onMessage<PluginMessageEvent>((message) => {
  if (message.type === 'table') {
    let numRows = 0;
    let numCols = 0;
    if (message.content.type === 'import' && message.content.import) {
      numRows = message.content.import.length;
      numCols = message.content.import[0].length;
    } else if (message.content.new) {
      numRows = message.content.new.row;
      numCols = message.content.new.column;
    }

    const frame = penpot.createFrame();
    frame.name = 'Table';

    const viewport = penpot.viewport;
    frame.x = viewport.center.x - 150;
    frame.y = viewport.center.y - 200;
    frame.resize(numCols * 160, numRows * 50);
    frame.borderRadius = 8;
    frame.horizontalSizing = 'fix';
    frame.verticalSizing = 'auto';

    // create grid
    const grid = frame.addGridLayout();

    for (let i = 0; i < numRows; i++) {
      grid.addRow('auto');
    }

    for (let i = 0; i < numCols; i++) {
      grid.addColumn('auto');
    }

    grid.alignItems = 'center';
    grid.justifyItems = 'start';
    grid.justifyContent = 'stretch';
    grid.alignContent = 'stretch';

    // create text
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const board = penpot.createFrame();

        if (col === 0 && row === 0) {
          board.borderRadiusTopLeft = 8;
        } else if (col === 0 && row === numRows - 1) {
          board.borderRadiusBottomRight = 8;
        } else if (col === numCols - 1 && row === 0) {
          board.borderRadiusTopRight = 8;
        } else if (col === numCols - 1 && row === numRows - 1) {
          board.borderRadiusBottomRight = 8;
        }

        grid.appendChild(board, row + 1, col + 1);

        if (board.layoutChild) {
          board.layoutChild.horizontalSizing = 'fill';
          board.layoutChild.verticalSizing = 'auto';
        }

        if (message.content.options.alternateRows && !(row % 2)) {
          board.fills = [{ fillColor: '#f8f9fc' }];
        }

        if (
          (message.content.options.filledHeaderRow && row === 0) ||
          (message.content.options.filledHeaderColumn && col === 0)
        ) {
          board.fills = [{ fillColor: '#d9dfea' }];
        }

        if (message.content.options.borders) {
          board.strokes = [
            {
              strokeColor: '#d4dadc',
              strokeStyle: 'solid',
              strokeWidth: 0.5,
              strokeAlignment: 'center',
            },
          ];
        }

        const flex = board.addFlexLayout();
        flex.alignItems = 'center';
        flex.justifyContent = 'start';
        flex.verticalPadding = 10;
        flex.horizontalPadding = 20;

        let text;
        if (message.content.type === 'import' && message.content.import) {
          text = penpot.createText(message.content.import[row][col]);
        } else if (message.content.new) {
          text =
            row === 0 ? penpot.createText('Header') : penpot.createText('Cell');
        }

        if (text) {
          text.growType = 'auto-height';
          text.fontFamily = 'Work Sans';
          text.fontId = 'gfont-work-sans';
          text.fontVariantId = row === 0 ? '500' : 'regular';
          text.fontSize = '12';
          text.fontWeight = row === 0 ? '500' : '400';
          board.appendChild(text);
          if (text.layoutChild) {
            text.layoutChild.horizontalSizing = 'fill';
            text.layoutChild.verticalSizing = 'fix';
          }
        }
      }
    }
    penpot.closePlugin();
  }
});
