export default function () {
  const rectangle = penpot.createRectangle();
  const shape = penpot.getPage()?.getShapeById(rectangle.id);
  if (shape) {
    penpot.library.local.createComponent(shape);
  }
}
