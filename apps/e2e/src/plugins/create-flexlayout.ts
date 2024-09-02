export default function () {
  function createFlexLayout(): void {
    const frame = penpot.createFrame();
    frame.horizontalSizing = 'auto';
    frame.verticalSizing = 'auto';

    const flex = frame.addFlexLayout();

    flex.dir = 'column';
    flex.wrap = 'wrap';
    flex.alignItems = 'center';
    flex.justifyContent = 'center';
    flex.verticalPadding = 5;
    flex.horizontalPadding = 5;
    flex.horizontalSizing = 'fill';
    flex.verticalSizing = 'fill';

    frame.appendChild(penpot.createRectangle());
    frame.appendChild(penpot.createEllipse());
  }

  createFlexLayout();
}
