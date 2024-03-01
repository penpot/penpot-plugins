import { isObject } from '.';

/**
 * Checks if an object have only one property, and if that
 * property is the one passed as argument.
 *
 * examples checking property 'hello':
 *
 * { hello: 'world' } => true,
 *
 * { hello: 'world', foo: 'bar' } => false
 */
export function isSingleObjectWithProperty(
  object: unknown,
  property: string
): boolean {
  if (isObject(object)) {
    return (
      Object.keys(object as Record<string, unknown>).length === 1 &&
      !!(object as Record<string, unknown>)[property]
    );
  }

  return false;
}

export function isSingleObjectWithProperties(
  object: unknown,
  properties: string[]
): boolean {
  if (isObject(object)) {
    const keys = Object.keys(object as Record<string, unknown>);

    if (keys.length === 1) {
      return properties.includes(keys[0]);
    }
  }

  return false;
}

export function parseSingleProperties(
  obj: unknown,
  properties: string[]
): unknown {
  let result = obj;

  properties.forEach((property) => {
    if (isSingleObjectWithProperty(obj, property)) {
      result = (obj as Record<string, unknown>)[property];
    }
  });

  return result;
}
