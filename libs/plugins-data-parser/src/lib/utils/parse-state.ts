/* eslint-disable */

import { toCamelCase } from './object.util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UknowCljs = any;

declare global {
  const cljs: UknowCljs;
  const app: UknowCljs;
}

const PATH_SEPARATOR = '/' as const;

function getPath(path: string): UknowCljs[] {
  if (path === 'root') {
    return [];
  }
  return path
    .slice(5)
    .split(PATH_SEPARATOR)
    .map((it) => {
      if (it.startsWith('#')) {
        return cljs.core.uuid(it.slice(1));
      } else if (it.startsWith(':')) {
        return cljs.core.keyword(it.slice(1));
      } else if (it.startsWith('!')) {
        return parseInt(it.slice(1), 10);
      } else {
        return it;
      }
    });
}

const expandableTable = {
  'app:datetime': false,
  'cljs:uuid': false,
  'cljs:keyword': false,
  'cljs:symbol': false,
  'js:date': false,
  'js:boolean': false,
  'js:function': false,
  'js:number': false,
  'js:string': false,
  'js:undefined': false,
  'js:null': false,
  'unkwnown:unknown': false,
  'cljs:vector': true,
  'cljs:list': true,
  'cljs:map': true,
  'cljs:set': true,
  'js:array': true,
  'js:object': true,
} as const;

function isCljsArray(key: string) {
  const valid = ['cljs:vector', 'cljs:list', 'cljs:set'];

  return valid.includes(key);
}

const valueTable = {
  'app:datetime': (value: unknown) => cljs.core.str(value),
  'cljs:uuid': (value: unknown) => cljs.core.name(value),
  'cljs:keyword': (value: unknown) => cljs.core.name(value),
  'js:date': (value: unknown) => (value as Date).toISOString(),
};

function isTypeExpandable(type: keyof typeof expandableTable) {
  return expandableTable[type];
}

function getType(value: unknown) {
  const typeTable = {
    'app:datetime': app.util.time.datetime_QMARK_,
    'cljs:uuid': cljs.core.uuid_QMARK_,
    'cljs:keyword': cljs.core.keyword_QMARK_,
    'cljs:vector': cljs.core.vector_QMARK_,
    'cljs:list': cljs.core.list_QMARK_,
    'cljs:map': cljs.core.map_QMARK_,
    'cljs:set': cljs.core.set_QMARK_,
    'cljs:symbol': cljs.core.symbol_QMARK_,
    'js:date': (value: unknown) => value instanceof Date,
    'js:array': (value: unknown) => Array.isArray(value),
    'js:boolean': (value: unknown) => typeof value === 'boolean',
    'js:function': (value: unknown) => typeof value === 'function',
    'js:number': (value: unknown) => typeof value === 'number',
    'js:string': (value: unknown) => typeof value === 'string',
    'js:undefined': (value: unknown) => typeof value === 'undefined',
    'js:null': (value: unknown) => value === null,
    'js:object': (value: unknown) =>
      typeof value === 'object' &&
      value !== null &&
      value.toString() === '[object Object]',
  };

  for (const [type, fn] of Object.entries(typeTable)) {
    if (fn(value)) return type as keyof typeof typeTable;
  }

  return 'unknown:unknown' as keyof typeof typeTable;
}

function getKeyName(key: string | number) {
  if (cljs.core.uuid_QMARK_(key)) {
    return '#' + cljs.core.name(key);
  } else if (cljs.core.keyword_QMARK_(key)) {
    return ':' + cljs.core.name(key);
  } else if (typeof key === 'string') {
    return key;
  } else if (typeof key === 'number') {
    return `!${key}`;
  }

  return key;
}

function getValue(value: unknown, type: string): unknown {
  return type in valueTable
    ? valueTable[type as keyof typeof valueTable](value)
    : value;
}

export function getPartialState(path: string, state: UknowCljs): UknowCljs {
  // const state = cljs.core.deref(app.main.store.state);
  const statePath = getPath(path);
  const data = cljs.core.get_in(state, statePath);
  const type = getType(data);
  const isArray = isCljsArray(type);
  const isExpandable = isTypeExpandable(type);

  const map: Record<string, unknown> = {};
  const list: unknown[] = [];

  function addEntry(
    childPath: string,
    propName: string | number,
    repValue: unknown,
    isExpandable: boolean
  ) {
    if (isArray) {
      list.push(isExpandable ? getPartialState(childPath, state) : repValue);
    } else {
      if (isExpandable) {
        Object.defineProperty(map, propName, {
          get() {
            return getPartialState(childPath, state);
          },
          configurable: true,
          enumerable: true,
        });
      } else {
        map[propName] = repValue;
      }
    }
  }

  if (isExpandable) {
    if (type.startsWith('cljs:')) {
      const cljsData = cljs.core.clj__GT_js(cljs.core.to_array(data));

      cljsData.forEach((entry: unknown, index: number) => {
        if (cljs.core.map_entry_QMARK_(entry)) {
          const key = cljs.core.first(entry);
          const name = getKeyName(key);
          const value = cljs.core.nth(entry, 1);
          const valueType = getType(value);
          const repValue = getValue(value, valueType);
          const isExpandable = isTypeExpandable(valueType);
          const childPath = path + PATH_SEPARATOR + name;
          const propName = name.startsWith(':')
            ? toCamelCase(name.slice(1))
            : name;

          addEntry(childPath, propName, repValue, isExpandable);
        } else {
          const valueType = getType(entry);
          const repValue = getValue(entry, valueType);
          const isExpandable = isTypeExpandable(valueType);
          const childPath = path + PATH_SEPARATOR + getKeyName(index);

          addEntry(childPath, index, repValue, isExpandable);
        }
      });
    } else if (type.startsWith('js:')) {
      Object.entries(data).forEach(([key, value]) => {
        map[key] = value;
      });
    }

    return isArray ? list : map;
  }

  const repValue = getValue(data, type);

  return repValue;
}
