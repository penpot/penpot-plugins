/* eslint-disable */

export declare global {
  declare namespace globalThis {
    export const penpot = {
      ui: {},
    };
  }
}

penpot.log('Hello from plugin');

penpot.ui.open('Plugin name', 'http://localhost:4201', {
  width: 500,
  height: 600,
});

penpot.ui.onMessage((message) => {
  if (message.content === 'ping') {
    penpot.log('ping received');
    penpot.ui.sendMessage({ type: 'pingpong', content: 'pong' });
  } else if (message.content === 'close') {
    penpot.closePlugin();
  } else if (message.content === 'ready') {
    penpot.ui.sendMessage({
      type: 'init',
      content: {
        name: penpot.getPageState().name,
      },
    });
  }
});

penpot.on('pagechange', (page) => {
  penpot.ui.sendMessage({ type: 'page', content: page.name });
});