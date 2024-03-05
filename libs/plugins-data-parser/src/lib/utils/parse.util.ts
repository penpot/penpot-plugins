import { ParsedData } from '../models/parsed.model';
import { isObject, toCamelCase } from './object.util';
import { flattenNestedArrays, parseObjArr } from './parse-arr.util';
import {
  isSingleObjectWithProperties,
  isSingleObjectWithProperty,
  parseSingleProperties,
} from './parse-properties.util';

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
          !/^(\$|cljs\$|__hash|_hash|bitmap|meta|extmap|ns|fqn|cnt|shift|edit|has_nil_QMARK_|nil_val)/g.test(
            key
          )
      )
      .reduce(
        (result, key) => ({
          ...result,
          [toCamelCase(key)]: cleanObject(
            (obj as Record<string, unknown>)[key]
          ),
        }),
        {}
      );
  }
  return obj as Record<string, unknown>;
}

/**
 * Recursively checks for "arr" properties and parses them
 *
 * It also checks for useless one-property objects like uuid or root
 */
export function parseObject(obj: unknown): unknown {
  // If it's an array, parse each element
  if (Array.isArray(obj)) {
    const parsedArray = obj.map((v: Record<string, unknown>) => parseObject(v));

    // Flatten nested arrays if necessary
    return flattenNestedArrays(parsedArray);
  }

  // If it's an object with only property 'arr', parse it
  if (isSingleObjectWithProperty(obj, 'arr')) {
    const parsed = parseObjArr(obj as Record<string, unknown>);
    return parseObject(parsed);
  }

  // If it's an object with only properties singleProperties, parse them
  const singleProperties = ['root', 'uuid', 'name', 'guides'];
  if (isSingleObjectWithProperties(obj, singleProperties)) {
    const parsed = parseSingleProperties(
      obj as Record<string, unknown>,
      singleProperties
    );
    return parseObject(parsed);
  }

  // If it's an object, parse each property
  if (isObject(obj)) {
    return Object.keys(obj as Record<string, unknown>).reduce(
      (result, key) => ({
        ...result,
        [key]: parseObject((obj as Record<string, unknown>)[key]),
      }),
      {}
    );
  }

  return obj;
}

/**
 * Parse object into a more typescript friendly object
 */
export function parse(file: unknown): ParsedData {
  return parseObject(cleanObject(file)) as ParsedData;
}
