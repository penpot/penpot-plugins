penpot.ui.open('Icons plugin', 'http://localhost:4202', {
  width: 500,
  height: 600,
});

penpot.ui.onMessage<{ content: string; name: string }>((message) => {
  if (!message.content || !message.name) {
    return;
  }

  const svgIcon = message.content;
  const iconName = message.name;
  const icon = penpot.createShapeFromSvg(svgIcon);
  icon.name = iconName;
  icon.x = penpot.viewport.center.x;
  icon.y = penpot.viewport.center.y;
});
