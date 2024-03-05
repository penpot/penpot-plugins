import { Point } from '.';

export interface Extmap {
  fillColor?: string;
  strokeStyle?: null | string;
  none?: unknown;
  strokeColor?: string;
  content?: ExtmapContent[];
  strokeOpacity?: number;
  strokeAlignment?: unknown;
  center?: null | ExtmapInner;
  proportionLock?: null | boolean;
  constraintsV?: unknown;
  constraintsH?: unknown;
  leftright?: unknown;
  strokes?: Stroke[];
  proportion?: number;
  fills?: Fill[];
  fillOpacity?: number;
  growType?: unknown;
  touched?: Touched;
  shapeRef?: string;
  topbottom?: unknown;
  positionData?: PositionData[];
  overflowText?: unknown;
  fixed?: unknown;
  hidden?: null | boolean;
  componentId?: string;
  flipX?: unknown;
  componentFile?: string;
  flipY?: unknown;
  shapes?: string[];
  inner?: ExtmapInner;
  strokeWidth?: number;
  shadow: Shadow[];
  componentRoot?: boolean;
  rx?: number;
  ry?: number;
  autoWidth?: unknown;
  top?: Top;
  hideInViewer: null | boolean;
  exports?: null | Export[];
  thumbnail?: string;
}

export interface Export {
  type: null | string;
  jpeg: unknown;
  suffix: null | string;
  scale: number;
}

export interface Top {
  constraintsH: unknown;
  leftRight: unknown;
  hidden: null | boolean;
}

export interface Shadow {
  color: Partial<Color>;
  spread: unknown;
  offsetY: number;
  style: unknown;
  dropShadow: unknown;
  blur: number;
  hidden: null | boolean;
  opacity: null | number;
  id: string;
  offsetX: null | number;
}

export interface ExtmapInner {
  shapeRef: string;
  proportionLock: boolean;
}

export interface Touched {
  hashMap: HashMap;
}

export interface HashMap {
  hashMap: GeometryGroup;
}

export interface GeometryGroup {
  geometryGroup: unknown;
}

export interface PositionData {
  y?: number;
  fontStyle?: string;
  textTransform?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: number;
  textDecoration?: string;
  letterSpacing?: string;
  x?: number;
  fills?: Fill[];
  direction?: string;
  fontFamily?: string;
  height?: number;
  text?: string;
  extmap?: ExtmapContent;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}
export interface ExtmapBottom {
  blur: Blur;
  strokeWidth: number;
}

export interface Fill {
  fillColor: string;
  fillOpacity: number;
  fillColorRefFile?: string;
  fillColorRefId?: string;
}

export interface Stroke {
  strokeStyle: unknown;
  none: unknown;
  strokeColor: string;
  strokeOpacity: number;
  strokeAlignment: unknown;
  center: unknown;
  strokeWidth: number;
}

export interface Blur {
  id: string;
  type: unknown;
  layerBlur: unknown;
  value: number;
  hidden: unknown;
}

export interface ExtmapContent {
  command?: unknown;
  moveTo?: unknown;
  relative?: unknown;
  params?: Point;
  key?: string;
  type?: string;
  children?: ExtmapContent[];
  fillColor?: string;
  fillOpacity?: number;
  fontFamily?: string;
  fontId?: string;
  fontSize?: string;
  fontStyle?: string;
  fontVariantId?: string;
  fontWeight?: string;
  text?: string;
  textDecoration?: string;
  textTransform?: string;
  verticalAlign?: string;
  direction?: string;
  fills?: Fill[];
  letterSpacing?: string;
}

export interface ExtmapContentPoint {
  x: number;
  y: number;
  c1x?: number;
  c1y?: number;
  c2x?: number;
  c2y?: number;
}

export interface Color {
  color: string;
  opacity: number;
  id: string;
  name: string;
  fileId: string;
  path: string | null;
}
