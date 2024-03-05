import { cleanObject, parseObject, isObject } from '../utils';
import { PObject } from '../models';
import { Name, Uuid } from '../utils/models/util.model';

interface PageArr {
  data?: {
    arr?: unknown[];
  };
  [key: string]: unknown;
}

interface PageObject {
  root?: {
    arr?: unknown[];
  };
  [key: string]: unknown;
}

/**
 * WIP
 */
export class PageHelper {
  private data: unknown = null;
  private objects: unknown[] = [];

  public constructor(data?: unknown) {
    if (data) {
      this.setData(data);
    }
  }

  public setData(data: unknown): void {
    this.data = cleanObject(data);
    this.objects = this.getPageObjects(this.data as PageArr);
  }

  public getCleanData(): unknown {
    return this.data;
  }

  public getObjectsArray(): unknown[] {
    return this.objects;
  }

  public getObjectById(id: string): PObject | null {
    if (!this.objects) {
      return null;
    }

    const foundObject = this.findObject(this.objects, id);
    return parseObject(foundObject) as PObject;
  }

  private getPageObjects(obj: PageArr): unknown[] {
    const dataArr = obj?.data?.arr;

    const objectNameIndex = dataArr?.findIndex(
      (item) => isObject(item) && (item as Name)?.name === 'objects'
    );

    if (!objectNameIndex) {
      return [];
    }

    const objects = dataArr?.[objectNameIndex + 1] as PageObject;

    return (isObject(objects) && objects?.root?.arr) || [];
  }

  private findObject(
    data: unknown,
    id: string
  ): Record<string, unknown> | null {
    if (Array.isArray(data)) {
      for (const item of data) {
        const foundObject = this.findObject(item, id);
        if (foundObject !== null) {
          return foundObject;
        }
      }
    } else if (isObject(data)) {
      const obj = data as Record<string, unknown>;
      if ((obj?.['id'] as Uuid)?.uuid === id || obj?.['id'] === id) {
        return obj;
      }

      for (const key of Object.keys(obj)) {
        const foundObject = this.findObject(obj[key], id);
        if (foundObject !== null) {
          return foundObject;
        }
      }
    }

    return null;
  }
}
