import { UnparsedSelection } from '../models/selection.model';

/**
 * Gets selected uuids from selection object
 */
export function getSelectedUuids(selection: UnparsedSelection): string[] {
  const root = selection?.linked_map?.delegate_map?.root?.arr;

  if (!root) {
    return [];
  }

  return root.map((r) => r.uuid).filter((uuid): uuid is string => !!uuid);
}
