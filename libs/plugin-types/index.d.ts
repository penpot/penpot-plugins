export interface PenpotFile {
  id: string;
  name: string;
  revn: number;
}

export interface PenpotPage {
  id: string;
  name: string;
  getShapeById(id: string): PenpotShape | null;
  findShapes(): PenpotShape[];
}

export type PenpotGradient = {
  type: 'linear' | 'radial';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  stops: Array<{ color: string; opacity?: number; offset: number }>;
};

export type PenpotImageData = {
  name?: string;
  width: number;
  height: number;
  mtype?: string;
  id: string;
  keepApectRatio?: boolean;
};

export interface PenpotFill {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: PenpotGradient;
  fillColorRefFile?: string;
  fillColorRefId?: string;
  fillImage?: PenpotImageData;
}

export type PenpotStrokeCap =
  | 'round'
  | 'square'
  | 'line-arrow'
  | 'triangle-arrow'
  | 'square-marker'
  | 'circle-marker'
  | 'diamond-marker';

export interface PenpotStroke {
  strokeColor?: string;
  strokeColorRefFile?: string;
  strokeColorRefId?: string;
  strokeOpacity?: number;
  strokeStyle?: 'solid' | 'dotted' | 'dashed' | 'mixed' | 'none' | 'svg';
  strokeWidth?: number;
  strokeAlignment?: 'center' | 'inner' | 'outer';
  strokeCapStart?: PenpotStrokeCap;
  strokeCapEnd?: PenpotStrokeCap;
  strokeColorGradient: PenpotGradient;
}

export interface PenpotShapeBase {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;

  fills: PenpotFill[];
  strokes: PenpotStroke[];

  resize(width: number, height: number);
}

export interface PenpotText extends PenpotShape {
  type: 'text';
  characters: string;
}

export interface PenpotFrame extends PenpotShapeBase {
  readonly type: 'frame';
  readonly children: PenpotShape[];
}

export interface PenpotGroup extends PenpotShapeBase {
  readonly type: 'group';
  readonly children: PenpotShape[];
}

export interface PenpotBool extends PenpotShapeBase {
  readonly type: 'bool';
  readonly children: PenpotShape[];
}

export interface PenpotRectangle extends PenpotShapeBase {
  readonly type: 'rect';
}

export interface PenpotPath extends PenpotShapeBase {
  readonly type: 'rect';
}

export interface PenpotText extends PenpotShapeBase {
  readonly type: 'text';
  characters: string;
}

export interface PenpotCircle extends PenpotShapeBase {
  type: 'circle';
}

export interface PenpotSvgRaw extends PenpotShapeBase {
  type: 'svg-raw';
}

export interface PenpotImage extends PenpotShapeBase {
  type: 'image';
}

export type PenpotPoint = { x: number; y: number };
export type PenpotBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface PenpotViewport {
  center: PenpotPoint;
  zoom: number;
  readonly bounds: PenpotBounds;
}

export type PenpotShape =
  | PenpotFrame
  | PenpotGroup
  | PenpotBool
  | PenpotRectangle
  | PenpotPath
  | PenpotText
  | PenpotCircle
  | PenpotSvgRaw
  | PenpotImage;

export interface EventsMap {
  pagechange: PenpotPage;
  filechange: PenpotFile;
  selectionchange: string[];
  themechange: PenpotTheme;
}

export type PenpotTheme = 'light' | 'dark';

export interface PenpotContext {
  root: PenpotShape;
  currentPage: PenpotPage;
  selection: PenpotShape[];
  viewport: PenpotViewport;

  getFile(): PenpotFile | null;
  getPage(): PenpotPage | null;
  getSelected(): string[];
  getSelectedShapes(): PenpotShape[];
  getTheme(): PenpotTheme;

  uploadMediaUrl(name: string, url: string): Promise<PenpotImageData>;

  group(first: PenpotShape, ...rest: PenpotShape): PenpotGroup;
  ungroup(first: PenpotShape, ...rest: PenpotShape);

  createRectangle(): PenpotRectangle;
  createFrame(): PepotFrame;
}

export interface Penpot extends PenpotContext {
  ui: {
    open: (
      name: string,
      url: string,
      options: { width: number; height: number }
    ) => void;
    sendMessage: (message: unknown) => void;
    onMessage: <T>(callback: (message: T) => void) => void;
  };
  utils: {
    types: {
      isText(shape: PenpotShape): shape is PenpotText;
      isRectangle(shape: PenpotShape): shape is PenpotRectangle;
      isFrame(shape: PenpotShape): shape is PenpotFrame;
    };
  };
  log: (...data: unknown[]) => void;
  setTimeout: (callback: () => void, time: number) => void;
  closePlugin: () => void;
  on: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;
  off: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;

  fetch: typeof fetch;
}

declare global {
  const penpot: Penpot;
}
