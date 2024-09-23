export default function () {
  const rectangle = penpot.createRectangle();
  rectangle.x = penpot.viewport.center.x;
  rectangle.y = penpot.viewport.center.y;

  const shape = penpot.getPage()?.getShapeById(rectangle.id);
  if (shape) {
    penpot.library.local.createComponent([shape]);
  }
}
