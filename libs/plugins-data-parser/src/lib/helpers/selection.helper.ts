import { Selection } from '../models';

/**
 * WIP
 */
export class SelectionHelper {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getUuids(selection: Selection): string[] {
    const root = selection?.linked_map?.delegate_map?.root?.arr;

    return (root?.filter((r) => r?.uuid).map((r) => r.uuid) as string[]) || [];
  }
}
