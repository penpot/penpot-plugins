# Parser

This library exports `parse()` and `getSelectedUuids()` funtions and some models like `ParsedFile`, `ParsedPage` or `UnparsedSelection`.

The `parse()` function cleans up and transforms a penpot object into a more typescript friendly object. It returns a `ParsedData` object that can be casted as `ParsedFile` or `ParsedPage`. Note that `ParsedData` is the parent interface and includes all `ParsedFile` and `ParsedPage` properties.

Most of the properties are optional and may or may not be present in your result, you should access them with care.

The `getSelectedUuids()` functions, given an `UnparsedSelection` object, returns the selected Uuids as an array of string.

## Use

Import the parse function and the desired models from plugins data parser.

Examples:

- `parse()`

```ts
import { parse, ParsedFile } from 'plugins-parser';

[...]

const parsedFile: ParsedFile = parse(file);

const color = parsedFile.data.colors?.[0];

/** color:
 *  {
 *    "path": "Background",
 *    "color": "#1c1b1f",
 *    "fileId": "f13ed095-e13f-808c-8002-2830d45911f7",
 *    "name": "On Background",
 *    "opacity": 1,
 *    "id": "136eece0-40ab-8002-8002-296771ace070"
 *  }
 */

```

- `getSelectedUuids()`

```ts
import { getSelectedUuids, UnparsedSelection } from 'plugins-parser';

[...]

const selection: UnparsedSelection = { [...] };

const ids: string[] = getSelectedUuids(selection); =>

/** ids:
 *  [
 *    "4fa12080-0d58-80a3-8002-3a2344356e7c",
 *    "d9a61226-8431-8080-8002-5aea35acc724"
 *  ]
 */

```
