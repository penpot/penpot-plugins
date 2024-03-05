import {
  isObject,
  toCamelCase,
  parseArrProperty,
  isRootTail,
  isSingleObjectWithProperties,
  isSingleObjectWithProperty,
} from '.';
import { Arr } from './models/util.model';

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

export function parseRootTail(obj: unknown): unknown {
  if (isObject(obj) && isRootTail(obj)) {
    const { root, tail } = obj as Record<string, unknown>;

    const hasRoot = Array.isArray(root) && root?.length > 0;
    const hasTail = Array.isArray(tail) && tail?.length > 0;

    if (hasRoot && hasTail) {
      return obj;
    }

    if (hasTail) {
      return tail;
    }

    if (hasRoot) {
      return root;
    }

    return [];
  }

  return obj;
}

/**
 * Recursively cleans an object from unnecesary properties
 * and converts snake_case and kebab-case to camelCase
 */
export function cleanObject(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj
      .filter((p) => p !== null)
      .map((v: Record<string, unknown>) => cleanObject(v)) as Record<
      string,
      unknown
    >[];
  } else if (isObject(obj)) {
    return Object.keys(obj as Record<string, unknown>)
      .filter(
        (key) =>
          !/^(cljs\$|\$hash|ts|ry|\$meta|__hash|_hash|bitmap|meta|ns|fqn|cnt|shift|edit|has_nil_QMARK_|nil_val)/g.test(
            key
          )
      )
      .reduce((result, key) => {
        const value = (obj as Record<string, unknown>)[key];
        if (['extmap', '$extmap'].includes(key) && value === null) {
          return { ...result };
        }

        return {
          ...result,
          [toCamelCase(key)]: cleanObject(
            (obj as Record<string, unknown>)[key]
          ),
        };
      }, {});
  }
  return obj as Record<string, unknown>;
}

export function parseObject(obj: unknown): unknown {
  const singleProperties = ['root', 'name', 'uuid', 'guides'];
  if (isSingleObjectWithProperties(obj, singleProperties)) {
    const parsed = parseSingleProperties(
      obj as Record<string, unknown>,
      singleProperties
    );
    return parseObject(parsed);
  }

  if (isSingleObjectWithProperty(obj, 'arr')) {
    const parsed = parseArrProperty((obj as Arr).arr);
    return parseObject(parsed);
  }

  if (isRootTail(obj)) {
    const parsed = parseRootTail(obj);
    return parseObject(parsed);
  }

  // If it's an array, parse each element
  if (Array.isArray(obj)) {
    return obj.map((v: Record<string, unknown>) => parseObject(v));
  }

  // If it's an object, parse each property
  if (isObject(obj)) {
    return Object.keys(obj as Record<string, unknown>).reduce((result, key) => {
      return {
        ...result,
        [key]: parseObject((obj as Record<string, unknown>)[key]),
      };
    }, {});
  }

  return obj;
}
