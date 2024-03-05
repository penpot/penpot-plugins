/**
 * Check if param is an object
 */
export function isObject(obj: unknown): boolean {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Check if param is an object with a single property
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

/**
 * Check if param is an object with a single property from a list
 */
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

/**
 * Check if param is a root-tail object
 */
export function isRootTail(obj: unknown): boolean {
  if (isObject(obj)) {
    const keys = Object.keys(obj as Record<string, unknown>);
    return keys.length === 2 && keys.includes('root') && keys.includes('tail');
  }

  return false;
}
