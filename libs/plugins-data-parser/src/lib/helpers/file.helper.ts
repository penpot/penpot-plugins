import { cleanObject } from '../utils';

/**
 * WIP
 */
export class FileHelper {
  private data: unknown = null;

  public constructor(data?: unknown) {
    if (data) {
      this.setData(data);
    }
  }

  public setData(data: unknown): void {
    this.data = cleanObject(data);
  }

  public getCleanData(): unknown {
    return this.data;
  }
}
