# Parser

This library includes a `parse()` funtion and some parsed models like `ParsedFile` or `ParsedPage`.

The parse function cleans up and transforms a penpot object into a more typescript friendly object. It returns a `ParsedData` object that can be casted as `ParsedFile` or `ParsedPage`. Note that `ParsedData` is the parent interface and includes all `ParsedFile` and `ParsedPage` properties.

Most of the properties are optional and may or may not be present in your result, you should access them with care.

## Use

Import the parse function and the desired models from plugins data parser.

Example:

```
import { parse, ParsedFile } from 'plugins-parser';

[...]

const parsedFile: ParsedFile = parse(file);
console.log(parsedFile.data.colors?.[0]?.color);

[...]
```
