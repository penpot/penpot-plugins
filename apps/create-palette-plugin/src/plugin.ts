main();

function main() {
  createPalette();
  penpot.closePlugin();
}

function createPalette() {
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
