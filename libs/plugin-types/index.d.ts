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

export interface PenpotColor {
  id: string;
  name?: string;
  path?: string;
  color?: string;
  opacity?: number;
  refId?: string;
  refFile?: string;
  gradient?: PenpotGradient;
  image?: PenpotImageData;
}

export interface PenpotShadow {
  id: string;
  style: 'drop-shadow' | 'inner-shadow';
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  hidden: boolean;
  color: PenpotColor;
}

export interface PenpotBlur {
  id: string;
  type: 'layer-blur';
  value: number;
  hidden: boolean;
}

export interface PenpotFrameGuideColumnParams {
  color: { color: string; opacity: number };
  type?: 'stretch' | 'left' | 'center' | 'right';
  size?: number;
  margin?: number;
  itemLength?: number;
  gutter?: number;
}

export interface PenpotFrameGuideSquareParams {
  color: { color: string; opacity: number };
  size?: number;
}

export interface PenpotFrameGuideColumn {
  type: 'column';
  display: boolean;
  params: PenpotFrameGuideColumnParams;
}

export interface PenpotFrameGuideRow {
  type: 'row';
  display: boolean;
  params: PenpotFrameGuideColumnParams;
}

export interface PenpotFrameGuideSquare {
  type: 'column';
  display: boolean;
  params: PenpotFrameGuideSquareParams;
}

export type PenpotFrameGuide =
  | PenpotFrameGuideColumn
  | PenpotFrameGuideRow
  | PenpotFrameGuideSquare;

export interface PenpotExport {}

export type PenpotTrackType = 'flex' | 'fixed' | 'percent' | 'auto';

export interface PenpotTrack {
  type: PenpotTrackType;
  value: number | null;
}

export interface PenpotGridLayout {
  dir: 'column' | 'row';
  readonly rows: PenpotTrack[];
  readonly columns: PenpotTrack[];

  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  alignContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  justifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';

  rowGap: number;
  columnGap: number;

  verticalPadding: number;
  horizontalPadding: number;

  topPadding: number;
  rightPadding: number;
  bottomPadding: number;
  leftPadding: number;

  addRow(type: PenpotTrackType, value?: number): void;
  addRowAtIndex(index: number, type: PenpotTrackType, value?: number): void;
  addColumn(type: PenpotTrackType, value?: number): void;
  addColumnAtIndex(index: number, type: PenpotTrackType, value: number): void;
  removeRow(index: number): void;
  removeColumn(index: number): void;
  setColumn(index: number, type: PenpotTrackType, value?: number): void;
  setRow(index: number, type: PenpotTrackType, value?: number): void;

  appendChild(child: PenpotShape, row: number, column: number): void;
  remove(): void;
}

export interface PenpotShapeBase {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;

  blocked: boolean;
  hidden: boolean;
  proportionLock: boolean;
  constraintsHorizontal: 'left' | 'right' | 'leftright' | 'center' | 'scale';
  constraintsVertical: 'top' | 'bottom' | 'topbottom' | 'center' | 'scale';
  borderRadius: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomRight: number;
  borderRadiusBottomLeft: number;

  opacity: number;
  blendMode:
    | 'normal'
    | 'darken'
    | 'multiply'
    | 'color-burn'
    | 'lighten'
    | 'screen'
    | 'color-dodge'
    | 'overlay'
    | 'soft-light'
    | 'hard-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity';

  shadows: PenpotShadow[];
  blur: PenpotBlur;
  exports: PenpotExport;

  // Relative positions
  frameX: number;
  frameY: number;
  parentX: number;
  parentY: number;

  flipX: boolean;
  flipY: boolean;

  fills: PenpotFill[];
  strokes: PenpotStroke[];

  resize(width: number, height: number): void;
  clone(): PenpotShape;
  remove(): void;
}

export interface PenpotFrame extends PenpotShapeBase {
  readonly type: 'frame';
  readonly children: PenpotShape[];
  readonly grid?: PenpotGridLayout;
  guides: PenpotFrameGuide;

  addGridLayout(): PenpotGridLayout;
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
  growType: 'fixed' | 'auto-width' | 'auto-height';
}

export interface PepotFrame extends PenpotShapeBase {
  readonly type: 'frame';
  readonly children: PenpotShape[];
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

  group(first: PenpotShape, ...rest: PenpotShape[]): PenpotGroup;
  ungroup(first: PenpotShape, ...rest: PenpotShape[]): void;

  createRectangle(): PenpotRectangle;
  createFrame(): PenpotFrame;
  createShapeFromSvg(svgString: string): PenpotGroup;
  createText(text: string): PenpotText;
  addListener<T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ): void;
}

export interface Penpot
  extends Omit<PenpotContext, 'addListener' | 'group' | 'ungroup'> {
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
}

declare global {
  const penpot: Penpot;
}
