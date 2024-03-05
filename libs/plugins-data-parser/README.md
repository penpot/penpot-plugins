# Parser

This library exports `cleanObject()` and `getSelectedUuids()` funtions and the model `Selection`.

The `cleanObject()` function cleans up objects from useless properties and transforms the remaining ones to camelCase. It returns `unknown`.

The `getSelectedUuids()` functions, given an `Selection` object, returns the selected Uuids as an array of string.

## Helpers

### File Helper

#### File Helper functions

- `setData()`

You can either pass the data in the constructor or use the `setData()` function.

example:

```ts
const fileHelper = new FileHelper();
fileHelper.setData(data);
```

or

```ts
const fileHelper = new FileHelper(data);
```

- `getCleanData()`

Gets the cleaned up data. It deletes useless properties and and transforms the remaining ones to camelCase.

example:

```ts
const clean = fileHelper.getCleanData();
```

### Page Helper

#### Page Helper functions

- `setData()`

You can either pass the data in the constructor or use the `setData()` function.

example:

```ts
const pageHelper = new PageHelper();
pageHelper.setData(data);
```

or

```ts
const pageHelper = new PageHelper(data);
```

- `getCleanData()`

Gets the cleaned up data. It deletes useless properties and and transforms the remaining ones to camelCase.

example:

```ts
const clean = pageHelper.getCleanData();
```

- `getObjectsArray()`

Returns the objects array, which can contain heavily nested arrays with objects data.

example:

```ts
const objects = pageHelper.getObjectsArray();
```

- `getObjectById(id: string)`

Returns an object by given uuid. The object is cleaned up and formatted as a `PObject`.

```ts
const obj: PObject = pageHelper.getObjectById(
  '3aba0744-11fe-4c41-80fb-1b42aa7ef3e5'
);
```

### Selection Helper

#### Selection Helper functions

- `static getUuids(selection: Selection)`

Returns the selected items in an array.

example:

```ts
const ids = SelectionHelper.getUuids(selection);
```
