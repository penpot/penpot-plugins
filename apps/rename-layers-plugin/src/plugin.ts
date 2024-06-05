import { PluginMessageEvent } from './app/model';

penpot.ui.open('Plugin rename layers', `?theme=${penpot.getTheme()}`, {
  width: 235,
  height: 245,
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({ type: 'theme', content: theme });
});

penpot.ui.onMessage<PluginMessageEvent>((message) => {
  if (message.type === 'replace-text') {
    const shapes = penpot.getPage()?.findShapes();
    const shapesToUpdate = shapes?.filter((shape) =>
      shape.name.includes(message.content.current)
    );
    shapesToUpdate?.forEach((shape) => {
      shape.name = shape.name.replace(
        message.content.current,
        message.content.new
      );
    });
  }
});
