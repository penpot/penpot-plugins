# plugins-runtime

Go to to the [this branch](https://github.com/penpot/penpot/tree/niwinz-poc-plugins) in the Penpot local code.

Open `penpot/frontend/resources/templates/index.mustache` and replace the below:

```html
<script type="importmap">
  { "imports": { "plugins-runtime": "/js/plugins-runtime.mjs" } }
</script>
```

New code:

```
<script type="importmap">
  {"imports": {"plugins-runtime": "http://localhost:4200/index.mjs"}}
</script>
```

Run the penpot runtime with `npm start`.

Now you can go to penpot and see the `log` of this file `plugins-runtime/src/index.ts`.
