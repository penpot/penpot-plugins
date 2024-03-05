import { isObject, toCamelCase, isSingleObjectWithProperty } from '.';
import { Arr, Name } from './models/util.model';

/**
 * Checks if "arr" property can be turned into an object
 */
function toObject(arr: unknown): boolean {
  return (
    Array.isArray(arr) && arr.some((a) => isSingleObjectWithProperty(a, 'name'))
  );
}

/**
 * Checks if "arr" property can be turned into an array of objects
 */
function toArray(arr: unknown): boolean {
  return (
    Array.isArray(arr) &&
    arr.every((a) => isObject(a)) &&
    arr.every(
      (a) =>
        isSingleObjectWithProperty(a, 'uuid') ||
        isSingleObjectWithProperty(a, 'arr')
    )
  );
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
function arrToObject(arr: unknown): Record<string, unknown> | null {
  return (
    (Array.isArray(arr) &&
      arr.reduce(
        (result: Record<string, unknown>, value: unknown, index: number) => {
          if (isSingleObjectWithProperty(value, 'name')) {
            const next = arr[index + 1] as unknown;
            if (!!next && !isSingleObjectWithProperty(next, 'name')) {
              return { ...result, [toCamelCase((value as Name)?.name)]: next };
            } else {
              return { ...result, [toCamelCase((value as Name)?.name)]: null };
            }
          }
          return { ...result };
        },
        {}
      )) ||
    null
  );
}

/**
 * Parses a splitted "arr" back into an array of objects.
 *
 */
function arrToArray(arr: unknown): unknown[] | null {
  return (
    (Array.isArray(arr) &&
      arr.reduce((result: unknown[], value: unknown) => {
        if (isSingleObjectWithProperty(value, 'arr')) {
          return [...result, { ...(value as Arr)?.arr }];
        }
        return [...result];
      }, [])) ||
    null
  );
}

/**
 * Checks an "arr" property and decides which parse solution to use
 */
export function parseArrProperty(
  arr: unknown[]
): unknown[] | Record<string, unknown> | null {
  if (toArray(arr)) {
    return arrToArray(arr);
  } else if (toObject(arr)) {
    return arrToObject(arr);
  }

  return arr;
}
