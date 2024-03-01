/**
 * Check if param is an object
 */
export function isObject(obj: unknown): boolean {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Converts a string to camelCase from kebab-case and snake_case
 */
export function toCamelCase(str: string): string {
  // Clean string from leading underscores and hyphens
  const clean = str.replace(/^(_|-)_?/, '');

  // Replace all underscores and hyphens followed by a character
  // with that character in uppercase
  return clean.replace(/(_|-)./g, (x) => x[1].toUpperCase());
}
