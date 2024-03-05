/**
 * Converts a string to camelCase from kebab-case and snake_case
 */
export function toCamelCase(str: string): string {
  const clean = str.replace(/^(\$|_|-)_?/, '');

  return clean.replace(/(_|-)./g, (x) => x[1].toUpperCase());
}
