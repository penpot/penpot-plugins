export interface ParsedFile {
  id: string;
  name: string;
  data: FileData;
}

export interface FileData {
  id: string;
  version: number;
  colors: IdData<Color>[];
  typographies: IdData<Typhography>[];
  pages: RootTail<unknown, string[]>; // Tail is an array of uuid (string)
  pagesIndex?: IdData<PageIndex>[];
  components: IdData<Components>[];
  media?: IdData<Media>[];
}

export interface Color {
  color: string;
  opacity: number;
  id: string;
  name: string;
  fileId: string;
  path: string | null;
}

export interface Typhography {
  lineHeight: string;
  path: string | null;
  fontStyle: string;
  textTransform: string;
  fontId: string;
  fontSize: string;
  fontWeight: string;
  name: string;
  fontVariantId: string;
  id: string;
  letterSpacing: string;
  fontFamily: string;
  modifiedAt?: Date;
}

export interface PageIndex {
  options: IdData<Option>[];
  name: string;
  objects: IdData<ObjectI>[];
}

export interface Option {
  position: number;
  frameId: string;
  id: string;
  axis: null | unknown;
  x: null | unknown;
}

export interface Components {
  id: string;
  name: string;
  path: string;
  objects: IdData<ObjectI>[];
}

export interface ObjectI {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: 0;
  selrect: Selrect;
  points: RootTail<unknown, Point[]>;
  transform: Transform;
  transformInverse: Transform;
  parentId: null | string;
  frameId: null | string;
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

export interface Media {
  id: string;
  name: string;
  width: number;
  height: number;
  mtype: string;
  path: string;
}

/*****************
 * Generic types *
 *****************/

export interface RootTail<R, T> {
  root: R;
  tail: T;
}

export interface IdData<T> {
  id: string;
  data: T;
}
