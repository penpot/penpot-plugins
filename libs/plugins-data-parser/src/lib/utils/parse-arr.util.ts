import { isObject, toCamelCase } from './object.util';
import { isSingleObjectWithProperty } from './parse-properties.util';

interface Name {
  name: string;
}

interface Uuid {
  uuid: string;
}

interface Arr {
  arr: unknown[];
}

/**
 * Checks if "arr" property can be turned into an object
 */
function toObject(arr: unknown[]): boolean {
  return arr.some((a) => isSingleObjectWithProperty(a, 'name'));
}

/**
 * Checks if "arr" property can be turned into an array of objects
 */
function toArray(arr: unknown[]): boolean {
  return (
    arr.every((a) => isObject(a)) &&
    arr.some((a) => isSingleObjectWithProperty(a, 'uuid')) &&
    arr.some((a) => isSingleObjectWithProperty(a, 'arr'))
  );
}

/**
 * Checks if "arr" needs cleaning and clean the leftovers uuid objects.
 *
 * It needs cleaning when uuid objects are redundant.
 */
function cleanUuid(arr: unknown[]): unknown[] {
  const shouldClean = arr.some((a, index) => {
    const next = arr[index + 1] as Record<string, unknown>;

    return (
      isSingleObjectWithProperty(a, 'uuid') &&
      (next?.['id'] as Uuid)?.uuid === (a as Uuid).uuid
    );
  });

  if (shouldClean) {
    return arr.filter((a) => !isSingleObjectWithProperty(a, 'uuid'));
  }

  return arr;
}

/**
 * Parses a splitted "arr" back into an object if possible.
 *
 * If there are objects with a single property "name", that
 * object and the next one are turned into a key-value pair.
 *
 * example:
 * [{ name: 'foo' }, 'bar', { name: 'baz' }, 'qux'] => { foo: 'bar', baz: 'qux' }
 */
function arrToObject(arr: unknown[]): Record<string, unknown> {
  return arr.reduce(
    (result: Record<string, unknown>, value: unknown, index: number) => {
      if (isSingleObjectWithProperty(value, 'name')) {
        const next = arr[index + 1];
        if (!!next && !isSingleObjectWithProperty(next, 'name')) {
          return { ...result, [toCamelCase((value as Name).name)]: next };
        } else {
          return { ...result, [toCamelCase((value as Name).name)]: null };
        }
      }
      return { ...result };
    },
    {}
  );
}

/**
 * Recursively parses a splitted "arr" back into an array of
 * objects with id and data properties.
 *
 * If there are objects with a single property "uuid", and
 * the next one is an object with a single property "arr",
 * it turns them into an object with id and data properties.
 *
 * It also checks for nested "arr" properties and turns them
 * into an object with key-value pairs if possible.
 *
 * example:
 *
 * [{ uuid: 'foo' }, {arr: [{ name: 'bar' }, 'baz']}] => [{ id: 'foo', data: { bar: 'baz' } }]
 */
function arrToArray(arr: unknown[]): unknown[] {
  return arr.reduce((result: unknown[], value: unknown, index: number) => {
    if (isSingleObjectWithProperty(value, 'uuid')) {
      const next = arr[index + 1];
      if (!!next && isSingleObjectWithProperty(next, 'arr')) {
        const parsedArr = toObject((next as Arr).arr)
          ? arrToObject((next as Arr).arr)
          : toArray((next as Arr).arr)
          ? arrToArray((next as Arr).arr)
          : [...(next as Arr).arr];

        return [...result, { id: (value as Uuid).uuid, data: parsedArr }];
      }
    }
    return [...result];
  }, []);
}

/**
 * Checks an "arr" property and decides which parse solution to use
 */
export function parseArrProperty(
  arr: unknown[]
): unknown[] | Record<string, unknown> {
  if (toArray(arr)) {
    return arrToArray(arr);
  } else if (toObject(arr)) {
    return arrToObject(arr);
  }

  return cleanUuid(arr);
}

/**
 * Parses an object with an "arr" property
 */
export function parseObjArr(obj: unknown): unknown {
  if (isSingleObjectWithProperty(obj, 'arr')) {
    return parseArrProperty((obj as Arr)['arr'] as unknown[]);
  }

  return obj;
}

/**
 * Checks if an array is a nested array of objects
 *
 * It also checks and filter empty nested arrays
 */
function isNestedArray(arr: unknown[]): boolean {
  if (Array.isArray(arr) && arr.every((a) => Array.isArray(a))) {
    // Filter empty nested arrays
    const filtered = arr.filter((a) => (a as unknown[]).length > 0);

    // Check if every nested array is an array of objects
    return filtered.every(
      (a) => Array.isArray(a) && a.every((b) => isObject(b))
    );
  }

  return false;
}

/**
 * If an array is nested, it flattens it.
 *
 * example
 * [[1, 2], [3, 4]] => [1, 2, 3, 4]
 */
export function flattenNestedArrays(arr: unknown[]): unknown {
  if (isNestedArray(arr)) {
    return arr.flatMap((innerArray) => innerArray);
  }
  return arr;
}
