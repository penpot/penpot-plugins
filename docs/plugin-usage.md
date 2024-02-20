Open UI:

```ts
penpot.ui.open('Plugin name', 'http://localhost:4201', {
  width: 500,
  height: 600,
});
```

Get state:

```ts
// file file state
penpot.ui.getFileState();

// file page state
penpot.ui.getFileState();

// selection id
penpot.ui.getSelection();
```

### Messages

Receive message from iframe:

```ts
penpot.ui.onMessage((message) => {
  penpot.log('Received message:', message);
});
```

Send message from iframe:

```ts
parent.postMessage({ content: 'text' }, '*');
```

Send message from plugin

```ts
penpot.ui.sendMessage({ type: 'hello' });
```

Send message from plugin:

```ts
window.addEventListener('message', function (event) {
  console.log('Message received from plugin: ', event.data);
});
```

### Events

Current events `pagechange`, `filechange` and `selectionchange`.

```ts
const event = (page) => {
  penpot.log(page.name);
};

penpot.on('pagechange', event);

penpot.off('pagechange', event);
```
