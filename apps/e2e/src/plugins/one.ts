export default function () {
  const initText: string = 'hi!';
  const text = penpot.createText(initText);
  text.x = penpot.viewport.center.x;
  text.y = penpot.viewport.center.y;
}
