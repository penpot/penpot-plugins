import type {
  PenpotFrame,
  PenpotRectangle,
  PenpotText,
} from '@penpot/plugin-types';

export default function () {
  function createText(text: string): PenpotText | undefined {
    const textNode = penpot.createText(text);

    if (!textNode) {
      return;
    }

    textNode.x = penpot.viewport.center.x;
    textNode.y = penpot.viewport.center.y;

    return textNode;
  }

  function createRectangle(): PenpotRectangle {
    const rectangle = penpot.createRectangle();

    rectangle.setPluginData('customKey', 'customValue');

    rectangle.x = penpot.viewport.center.x;
    rectangle.y = penpot.viewport.center.y;

    rectangle.resize(200, 200);

    return rectangle;
  }

  function createFrame(): PenpotFrame {
    const frame = penpot.createFrame();

    frame.name = 'Frame name';

    console.log(penpot.viewport.center.x);

    frame.x = penpot.viewport.center.x;
    frame.y = penpot.viewport.center.y;

    frame.borderRadius = 8;

    frame.resize(300, 300);

    const text = penpot.createText('Hello from frame');

    if (!text) {
      throw new Error('Could not create text');
    }

    text.x = 10;
    text.y = 10;
    frame.appendChild(text);

    return frame;
  }

  createText('Hello from plugin');
  createRectangle();
  createFrame();
}
