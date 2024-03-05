import { UnparsedSelection } from '../models/selection.model';

/**
 * Gets selected uuids from selection object
 */
export function getSelectedUuids(selection: UnparsedSelection): string[] {
  const root = selection?.linked_map?.delegate_map?.root?.arr;

  return (root?.filter((r) => r?.uuid).map((r) => r.uuid) as string[]) || [];
}
