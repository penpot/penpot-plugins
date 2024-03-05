import { Extmap } from '.';

export interface PObject {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  selrect: Selrect;
  points: Point[];
  transform: Transform;
  transformInverse: Transform;
  parentId: string;
  frameId: string;
  extmap: Extmap;
}

export interface Selrect {
  x: number;
  y: number;
  width: number;
  height: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
