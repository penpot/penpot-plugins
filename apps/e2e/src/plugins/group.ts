export default function () {
  function group() {
    const selected = penpot.selection;

    if (selected.length && !penpot.utils.types.isGroup(selected[0])) {
      return penpot.group(selected);
    }
  }

  function ungroup() {
    const selected = penpot.selection;

    if (selected.length && penpot.utils.types.isGroup(selected[0])) {
      return penpot.ungroup(selected[0]);
    }
  }

  const rectangle = penpot.createRectangle();
  const rectangle2 = penpot.createRectangle();

  penpot.selection = [rectangle, rectangle2];

  group();
  ungroup();
}
