/**
 * PenpotFile represents a file in the Penpot application.
 * It includes properties for the file's identifier, name, and revision number.
 */
export interface PenpotFile {
  id: string;
  name: string;
  revn: number;
}

/**
 * PenpotPage represents a page in the Penpot application.
 * It includes properties for the page's identifier and name, as well as methods for managing shapes on the page.
 */
export interface PenpotPage {
  /**
   * The `id` property is a unique identifier for the page.
   */
  id: string;
  /**
   * The `name` property is the name of the page.
   */
  name: string;
  /**
   * Retrieves a shape by its unique identifier.
   * @param id The unique identifier of the shape.
   */
  getShapeById(id: string): PenpotShape | null;
  /**
   * Finds all shapes on the page.
   */
  findShapes(): PenpotShape[];
}

/**
 * TODO PenpotGradient
 */
export type PenpotGradient = {
  type: 'linear' | 'radial';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  stops: Array<{ color: string; opacity?: number; offset: number }>;
};

/**
 * TODO PenpotImageData
 */
export type PenpotImageData = {
  name?: string;
  width: number;
  height: number;
  mtype?: string;
  id: string;
  keepApectRatio?: boolean;
};

/**
 * TODO PenpotFill
 */
export interface PenpotFill {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: PenpotGradient;
  fillColorRefFile?: string;
  fillColorRefId?: string;
  fillImage?: PenpotImageData;
}

/**
 * TODO PenpotStrokeCap
 */

export type PenpotStrokeCap =
  | 'round'
  | 'square'
  | 'line-arrow'
  | 'triangle-arrow'
  | 'square-marker'
  | 'circle-marker'
  | 'diamond-marker';

/**
 * TODO PenpotStroke
 */
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
  strokeColorGradient?: PenpotGradient;
}

/**
 * TODO PenpotColor
 */
export interface PenpotColor {
  id?: string;
  name?: string;
  path?: string;
  color?: string;
  opacity?: number;
  refId?: string;
  refFile?: string;
  gradient?: PenpotGradient;
  image?: PenpotImageData;
}

/**
 * TODO PenpotShadow
 */
export interface PenpotShadow {
  id?: string;
  style?: 'drop-shadow' | 'inner-shadow';
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  spread?: number;
  hidden?: boolean;
  color?: PenpotColor;
}

/**
 * TODO PenpotBlur
 */
export interface PenpotBlur {
  id?: string;
  type?: 'layer-blur';
  value?: number;
  hidden?: boolean;
}

/**
 * TODO PenpotFrameGuideColumnParams
 */
export interface PenpotFrameGuideColumnParams {
  color: { color: string; opacity: number };
  type?: 'stretch' | 'left' | 'center' | 'right';
  size?: number;
  margin?: number;
  itemLength?: number;
  gutter?: number;
}

/**
 * TODO PenpotFrameGuideSquareParams
 */
export interface PenpotFrameGuideSquareParams {
  color: { color: string; opacity: number };
  size?: number;
}

/**
 * TODO PenpotFrameGuideColumn
 */
export interface PenpotFrameGuideColumn {
  type: 'column';
  display: boolean;
  params: PenpotFrameGuideColumnParams;
}

/**
 * TODO PenpotFrameGuideRow
 */
export interface PenpotFrameGuideRow {
  type: 'row';
  display: boolean;
  params: PenpotFrameGuideColumnParams;
}

/**
 * TODO PenpotFrameGuideSquare
 */
export interface PenpotFrameGuideSquare {
  type: 'column';
  display: boolean;
  params: PenpotFrameGuideSquareParams;
}

/**
 * TODO PenpotFrameGuide
 */
export type PenpotFrameGuide =
  | PenpotFrameGuideColumn
  | PenpotFrameGuideRow
  | PenpotFrameGuideSquare;

/**
 * TODO PenpotExport
 */
export interface PenpotExport {}

/**
 * TODO PenpotTrackType
 */
export type PenpotTrackType = 'flex' | 'fixed' | 'percent' | 'auto';

/**
 * TODO PenpotTrack
 */
export interface PenpotTrack {
  type: PenpotTrackType;
  value: number | null;
}

/**
 * PenpotCommonLayout represents a common layout interface in the Penpot application.
 * It includes various properties for alignment, spacing, padding, and sizing, as well as a method to remove the layout.
 */
export interface PenpotCommonLayout {
  /**
   * The `alignItems` property specifies the default alignment for items inside the container.
   * It can be one of the following values:
   * - 'start': Items are aligned at the start.
   * - 'end': Items are aligned at the end.
   * - 'center': Items are centered.
   * - 'stretch': Items are stretched to fill the container.
   */
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * The `alignContent` property specifies how the content is aligned within the container when there is extra space.
   * It can be one of the following values:
   * - 'start': Content is aligned at the start.
   * - 'end': Content is aligned at the end.
   * - 'center': Content is centered.
   * - 'space-between': Content is distributed with space between.
   * - 'space-around': Content is distributed with space around.
   * - 'space-evenly': Content is distributed with even space around.
   * - 'stretch': Content is stretched to fill the container.
   */
  alignContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  /**
   * The `justifyItems` property specifies the default justification for items inside the container.
   * It can be one of the following values:
   * - 'start': Items are justified at the start.
   * - 'end': Items are justified at the end.
   * - 'center': Items are centered.
   * - 'stretch': Items are stretched to fill the container.
   */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * The `justifyContent` property specifies how the content is justified within the container when there is extra space.
   * It can be one of the following values:
   * - 'start': Content is justified at the start.
   * - 'center': Content is centered.
   * - 'end': Content is justified at the end.
   * - 'space-between': Content is distributed with space between.
   * - 'space-around': Content is distributed with space around.
   * - 'space-evenly': Content is distributed with even space around.
   * - 'stretch': Content is stretched to fill the container.
   */
  justifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';

  /**
   * The `rowGap` property specifies the gap between rows in the layout.
   */
  rowGap: number;
  /**
   * The `columnGap` property specifies the gap between columns in the layout.
   */
  columnGap: number;

  /**
   * The `verticalPadding` property specifies the vertical padding inside the container.
   */
  verticalPadding: number;
  /**
   * The `horizontalPadding` property specifies the horizontal padding inside the container.
   */
  horizontalPadding: number;

  /**
   * The `topPadding` property specifies the padding at the top of the container.
   */
  topPadding: number;
  /**
   * The `rightPadding` property specifies the padding at the right of the container.
   */
  rightPadding: number;
  /**
   * The `bottomPadding` property specifies the padding at the bottom of the container.
   */
  bottomPadding: number;
  /**
   * The `leftPadding` property specifies the padding at the left of the container.
   */
  leftPadding: number;

  /**
   * The `horizontalSizing` property specifies the horizontal sizing behavior of the container.
   * It can be one of the following values:
   * - 'fit-content': The container fits the content.
   * - 'fill': The container fills the available space.
   * - 'auto': The container size is determined automatically.
   */
  horizontalSizing: 'fit-content' | 'fill' | 'auto';
  /**
   * The `verticalSizing` property specifies the vertical sizing behavior of the container.
   * It can be one of the following values:
   * - 'fit-content': The container fits the content.
   * - 'fill': The container fills the available space.
   * - 'auto': The container size is determined automatically.
   */
  verticalSizing: 'fit-content' | 'fill' | 'auto';

  /**
   * The `remove` method removes the layout.
   */
  remove(): void;
}

/**
 * PenpotGridLayout represents a grid layout in the Penpot application, extending the common layout interface.
 * It includes properties and methods to manage rows, columns, and child elements within the grid.
 */
export interface PenpotGridLayout extends PenpotCommonLayout {
  /**
   * The `dir` property specifies the primary direction of the grid layout.
   * It can be either 'column' or 'row'.
   */
  dir: 'column' | 'row';
  /**
   * The `rows` property represents the collection of rows in the grid.
   * This property is read-only.
   */
  readonly rows: PenpotTrack[];
  /**
   * The `columns` property represents the collection of columns in the grid.
   * This property is read-only.
   */
  readonly columns: PenpotTrack[];

  /**
   * Adds a new row to the grid.
   * @param type The type of the row to add.
   * @param value The value associated with the row type (optional).
   */
  addRow(type: PenpotTrackType, value?: number): void;
  /**
   * Adds a new row to the grid at the specified index.
   * @param index The index at which to add the row.
   * @param type The type of the row to add.
   * @param value The value associated with the row type (optional).
   */
  addRowAtIndex(index: number, type: PenpotTrackType, value?: number): void;
  /**
   * Adds a new column to the grid.
   * @param type The type of the column to add.
   * @param value The value associated with the column type (optional).
   */
  addColumn(type: PenpotTrackType, value?: number): void;
  /**
   * Adds a new column to the grid at the specified index.
   * @param index The index at which to add the column.
   * @param type The type of the column to add.
   * @param value The value associated with the column type.
   */
  addColumnAtIndex(index: number, type: PenpotTrackType, value: number): void;
  /**
   * Removes a row from the grid at the specified index.
   * @param index The index of the row to remove.
   */
  removeRow(index: number): void;
  /**
   * Removes a column from the grid at the specified index.
   * @param index The index of the column to remove.
   */
  removeColumn(index: number): void;
  /**
   * Sets the properties of a column at the specified index.
   * @param index The index of the column to set.
   * @param type The type of the column.
   * @param value The value associated with the column type (optional).
   */
  setColumn(index: number, type: PenpotTrackType, value?: number): void;
  /**
   * Sets the properties of a row at the specified index.
   * @param index The index of the row to set.
   * @param type The type of the row.
   * @param value The value associated with the row type (optional).
   */
  setRow(index: number, type: PenpotTrackType, value?: number): void;

  /**
   * Appends a child element to the grid at the specified row and column.
   * @param child The child element to append.
   * @param row The row index where the child will be placed.
   * @param column The column index where the child will be placed.
   */
  appendChild(child: PenpotShape, row: number, column: number): void;
}

/**
 * TODO PenpotFlexLayout
 */
export interface PenpotFlexLayout extends PenpotCommonLayout {
  dir: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap';

  appendChild(child: PenpotShape): void;
}

/**
 * TODO PenpotPathCommand
 */
interface PenpotPathCommand {
  command:
    | 'M'
    | 'move-to'
    | 'Z'
    | 'close-path'
    | 'L'
    | 'line-to'
    | 'H'
    | 'line-to-horizontal'
    | 'V'
    | 'line-to-vertical'
    | 'C'
    | 'curve-to'
    | 'S'
    | 'smooth-curve-to'
    | 'Q'
    | 'quadratic-bezier-curve-to'
    | 'T'
    | 'smooth-quadratic-bezier-curve-to'
    | 'A'
    | 'elliptical-arc';

  params?: {
    x?: number;
    y?: number;
    c1x: number;
    c1y: number;
    c2x: number;
    c2y: number;
    rx?: number;
    ry?: number;
    xAxisRotation?: number;
    largeArcFlag?: boolean;
    sweepFlag?: boolean;
  };
}

/**
 * TODO PenpotShapeBase
 */
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
  blur?: PenpotBlur;
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

  readonly layoutChild?: {
    absolute: boolean;
    zIndex: number;

    horizontalSizing: 'auto' | 'fill' | 'fix';
    verticalSizing: 'auto' | 'fill' | 'fix';

    alignSelf: 'auto' | 'start' | 'center' | 'end' | 'stretch';

    horizontalMargin: number;
    verticalMargin: number;

    topMargin: number;
    rightMargin: number;
    bottomMargin: number;
    leftMargin: number;

    maxWidth: number | null;
    maxHeight: number | null;
    minWidth: number | null;
    minHeight: number | null;
  };

  readonly layoutCell?: {
    row?: number;
    rowSpan?: number;
    column?: number;
    columnSpan?: number;
    areaName?: string;
    position?: 'auto' | 'manual' | 'area';
  };

  resize(width: number, height: number): void;

  clone(): PenpotShape;
  remove(): void;
}

/**
 * TODO PenpotFrame
 */
export interface PenpotFrame extends PenpotShapeBase {
  readonly type: 'frame';
  readonly grid?: PenpotGridLayout;
  readonly flex?: PenpotFlexLayout;
  guides: PenpotFrameGuide;

  horizontalSizing?: 'auto' | 'fix';
  verticalSizing?: 'auto' | 'fix';

  // Container Properties
  readonly children: PenpotShape[];
  appendChild(child: PenpotShape): void;
  insertChild(index: number, child: PenpotShape): void;

  // Grid layout
  addFlexLayout(): PenpotFlexLayout;
  addGridLayout(): PenpotGridLayout;
}

/**
 * TODO PenpotGroup
 */
export interface PenpotGroup extends PenpotShapeBase {
  readonly type: 'group';

  // Container Properties
  readonly children: PenpotShape[];
  appendChild(child: PenpotShape): void;
  insertChild(index: number, child: PenpotShape): void;
  makeMask(): void;
  removeMask(): void;
}

/**
 * TODO PenpotBoolType
 */
export type PenpotBoolType =
  | 'union'
  | 'difference'
  | 'exclude'
  | 'intersection';

/**
 * TODO PenpotBool
 */
export interface PenpotBool extends PenpotShapeBase {
  readonly type: 'bool';

  // From path
  toD(): string;
  content: Array<PenpotPathCommand>;

  // Container Properties
  readonly children: PenpotShape[];
  appendChild(child: PenpotShape): void;
  insertChild(index: number, child: PenpotShape): void;
}

/**
 * TODO PenpotRectangle
 */
export interface PenpotRectangle extends PenpotShapeBase {
  readonly type: 'rect';
}

/**
 * TODO PenpotPath
 */
export interface PenpotPath extends PenpotShapeBase {
  readonly type: 'path';

  toD(): string;
  content: Array<PenpotPathCommand>;
}

/**
 * PenpotText represents a text element in the Penpot application, extending the base shape interface.
 * It includes various properties to define the text content and its styling attributes.
 */
export interface PenpotText extends PenpotShapeBase {
  readonly type: 'text';
  characters: string;
  growType: 'fixed' | 'auto-width' | 'auto-height';

  fontId: string | 'mixed';
  fontFamily: string | 'mixed';
  fontVariantId: string | 'mixed';
  fontSize: string | 'mixed';
  fontWeight: string | 'mixed';
  fontStyle: string | 'mixed';
  lineHeight: string | 'mixed';
  letterSpacing: string | 'mixed';
  textTransform: string | 'mixed';
}

/**
 * TODO PepotFrame
 */
export interface PepotFrame extends PenpotShapeBase {
  readonly type: 'frame';
  readonly children: PenpotShape[];
}

/**
 * TODO PenpotEllipse
 */
export interface PenpotEllipse extends PenpotShapeBase {
  type: 'circle';
}

/**
 * TODO PenpotSvgRaw
 */
export interface PenpotSvgRaw extends PenpotShapeBase {
  type: 'svg-raw';
}

/**
 * TODO PenpotImage
 */
export interface PenpotImage extends PenpotShapeBase {
  type: 'image';
}

/**
 * PenpotPoint represents a point in 2D space, typically with x and y coordinates.
 */
export type PenpotPoint = { x: number; y: number };

/**
 * PenpotBounds represents the boundaries of a rectangular area,
 * defined by the coordinates of the top-left corner and the dimensions of the rectangle.
 */
export type PenpotBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * PenpotViewport represents the viewport in the Penpot application.
 * It includes the center point, zoom level, and the bounds of the viewport.
 */
export interface PenpotViewport {
  center: PenpotPoint;
  zoom: number;
  readonly bounds: PenpotBounds;
}

/**
 * PenpotShape represents a union of various shape types used in the Penpot project.
 * This type allows for different shapes to be handled under a single type umbrella.
 */
export type PenpotShape =
  | PenpotFrame
  | PenpotGroup
  | PenpotBool
  | PenpotRectangle
  | PenpotPath
  | PenpotText
  | PenpotEllipse
  | PenpotSvgRaw
  | PenpotImage;

/**
 * TODO EventsMap
 */
export interface EventsMap {
  /**
   * The `pagechange` event is triggered when the active page in the project is changed.
   */
  pagechange: PenpotPage;
  /**
   * The `filechange` event is triggered when there are changes in the current file.
   */
  filechange: PenpotFile;
  /**
   * The `selectionchange` event is triggered when the selection of elements changes.
   * This event passes a list of identifiers of the selected elements.
   */
  selectionchange: string[];
  /**
   * The `themechange` event is triggered when the application theme is changed.
   */
  themechange: PenpotTheme;
  /**
   * The `finish` event is triggered when some operation is finished.
   */
  finish: string;
}

/**
 * TODO PenpotTheme
 */
export type PenpotTheme = 'light' | 'dark';

/**
 * TODO PenpotLibraryElement
 */
export interface PenpotLibraryElement {
  readonly id: string;
  readonly libraryId: string;
  name: string;
  path: string;
}

/**
 * TODO PenpotLibraryColor
 */
export interface PenpotLibraryColor extends PenpotLibraryElement {
  color?: string;
  opacity?: number;
  gradient?: PenpotGradient;
  image?: PenpotImageData;

  /**
   * TODO asFill
   *
   * @example
   * ```js
   * asFill code
   * ```
   */
  asFill(): PenpotFill;
  /**
   * TODO asStroke
   *
   * @example
   * ```js
   * asStroke code
   * ```
   */
  asStroke(): PenpotStroke;
}

/**
 * TODO PenpotLibraryTypography
 */
export interface PenpotLibraryTypography extends PenpotLibraryElement {
  fontId: string;
  fontFamily: string;
  fontVariantId: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;

  /**
   * TODO applyToText
   *
   * @param shape TODO
   *
   * @example
   * ```js
   * applyToText code
   * ```
   */
  applyToText(shape: PenpotShape): void;
  /**
   * TODO applyToTextRange
   *
   * @param shape TODO
   *
   * @example
   * ```js
   * applyToTextRange code
   * ```
   */
  applyToTextRange(shape: PenpotShape): void;
}

/**
 * TODO PenpotLibraryComponent
 */
export interface PenpotLibraryComponent extends PenpotLibraryElement {
  /**
   * TODO instance
   *
   * @example
   * ```js
   * instance code
   * ```
   */
  instance(): PenpotShape;
}

/**
 * TODO PenpotLibrary
 */
export type PenpotLibrary = {
  colors: PenpotLibraryColor[];
  typographies: PenpotLibraryTypography[];
  components: PenpotLibraryComponent[];

  /**
   * TODO createColor
   *
   * @example
   * ```js
   * createColor code
   * ```
   */
  createColor(): PenpotLibraryColor;
  /**
   * TODO createTypography
   *
   * @example
   * ```js
   * createTypography code
   * ```
   */
  createTypography(): PenpotLibraryTypography;
  /**
   * TODO createComponent
   *
   * @example
   * ```js
   * createComponent code
   * ```
   */
  createComponent(shapes: PenpotShape[]): PenpotLibraryComponent;
};

/**
 * TODO PenpotLibraryContext
 */
export type PenpotLibraryContext = {
  /**
   * TODO local
   *
   * @example
   * ```js
   * local code
   * ```
   */
  local: PenpotLibrary;
  /**
   * TODO connected
   *
   * @example
   * ```js
   * connected code
   * ```
   */
  connected: PenpotLibrary[];
};

/**
 * TODO PenpotUser
 */
export interface PenpotUser {
  /**
   * TODO id
   *
   * @example
   * ```js
   * id code
   * ```
   */
  readonly id: string;
  /**
   * TODO name
   *
   * @example
   * ```js
   * name code
   * ```
   */
  readonly name?: string;
  /**
   * TODO avatarUrl
   *
   * @example
   * ```js
   * avatarUrl code
   * ```
   */
  readonly avatarUrl?: string;
  /**
   * TODO color
   *
   * @example
   * ```js
   * color code
   * ```
   */
  readonly color: string;
  /**
   * TODO sessionId
   *
   * @example
   * ```js
   * sessionId code
   * ```
   */
  readonly sessionId?: string;
}

/**
 * TODO PenpotActiveUser
 */
export interface PenpotActiveUser extends PenpotUser {
  /**
   * TODO position
   *
   * @example
   * ```js
   * position code
   * ```
   */
  readonly position?: { x: number; y: number };
  /**
   * TODO zoom
   *
   * @example
   * ```js
   * zoom code
   * ```
   */
  readonly zoom?: number;
}

/**
 * TODO PenpotContext
 */
export interface PenpotContext {
  /**
   * TODO root
   *
   * @example
   * ```js
   * context.root;
   * ```
   */
  readonly root: PenpotShape;
  /**
   * TODO currentPage
   *
   * @example
   * ```js
   * context.currentPage;
   * ```
   */
  readonly currentPage: PenpotPage;
  /**
   * TODO viewport
   *
   * @example
   * ```js
   * context.viewport;
   * ```
   */
  readonly viewport: PenpotViewport;
  /**
   * TODO library
   *
   * @example
   * ```js
   * context.library;
   * ```
   */
  readonly library: PenpotLibraryContext;
  /**
   * TODO currentUser
   *
   * @example
   * ```js
   * context.currentUser;
   * ```
   */
  readonly currentUser: PenpotUser;
  /**
   * TODO activeUsers
   *
   * @example
   * ```js
   * context.activeUsers;
   * ```
   */
  readonly activeUsers: PenpotActiveUser;

  /**
   * TODO selection
   *
   * @example
   * ```js
   * penpot.selection;
   * ```
   */
  selection: PenpotShape[];

  /**
   * Use this method to get file data
   *
   * @example
   * ```js
   * penpot.getFile();
   * ```
   */
  getFile(): PenpotFile | null;
  /**
   * Use this method to get page data
   *
   * @example
   * ```js
   * penpot.getPage();
   * ```
   */
  getPage(): PenpotPage | null;
  /**
   * Use this method to get the selected elements on penpot. You'll get and array of ids.
   *
   * @example
   * ```js
   * penpot.getSelected();
   * ```
   */
  getSelected(): string[];
  /**
   * Use this method to get the selected elements on penpot. You'll get the data from each shape.
   *
   * @example
   * ```js
   * penpot.getSelectedShapes();
   * ```
   */
  getSelectedShapes(): PenpotShape[];
  /**
   * Use this method to get the selected theme on penpot. This is necessary to take care of the dark and light mode of your plugin UI.
   *
   * @example
   * ```js
   * penpot.getTheme();
   * ```
   */
  getTheme(): PenpotTheme;

  uploadMediaUrl(name: string, url: string): Promise<PenpotImageData>;

  group(shapes: PenpotShape[]): PenpotGroup;
  ungroup(group: PenpotGroup, ...other: PenpotGroup[]): void;

  /**
   * Use this method to create the shape of a rectangle.
   *
   * @example
   * ```js
   * penpot.createRectangle();
   * ```
   */
  createRectangle(): PenpotRectangle;
  /**
   * Use this method to create a frame. This is the first step before anything else, the container.
   * Then you can add a gridlayout, flexlayout or add a shape inside the frame.
   *
   * @example
   * ```js
   * penpot.createFrame();
   * ```
   */
  createFrame(): PenpotFrame;
  /**
   * Use this method to create the shape of a ellipse.
   *
   * @example
   * ```js
   * penpot.createEllipse();
   * ```
   */
  createEllipse(): PenpotEllipse;
  /**
   * Use this method to create a path.
   *
   * @example
   * ```js
   * penpot.createPath();
   * ```
   */
  createPath(): PenpotPath;
  /**
   * TODO createboolean
   *
   * @example
   * ```js
   * penpot.createBoolean();
   * ```
   */
  createBoolean(boolType: PenpotBoolType, shapes: PenpotShape[]): PenpotBool;
  /**
   * TODO createShapeFromSvg
   *
   * @example
   * ```js
   * penpot.createShapeFromSvg();
   * ```
   */
  createShapeFromSvg(svgString: string): PenpotGroup;
  /**
   * TODO createText
   *
   * @example
   * ```js
   * const board = penpot.createFrame();
   * let text;
   * text = penpot.createText();
   * text.growType = 'auto-height';
   * text.fontFamily = 'Work Sans';
   * text.fontSize = '12';
   * board.appendChild(text);
   * ```
   */
  createText(text: string): PenpotText;
  /**
   * TODO addListener
   *
   * @param type todo explanation
   * @param callback todo explanation
   *
   * @example
   * ```js
   * penpot.addListener();
   * ```
   */
  addListener<T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ): symbol;
  /**
   * TODO removeListener
   *
   * @example
   * ```js
   * penpot.removeListener();
   * ```
   */
  removeListener(listenerId: symbol): void;
}

/**
 * These are methods and properties available on the `penpot` global object.
 *
 */
export interface Penpot
  extends Omit<PenpotContext, 'addListener' | 'removeListener'> {
  ui: {
    /**
     * Opens the plugin UI. It is possible to develop a plugin without interface (see Palette color example) but if you need, the way to open this UI is using `penpot.ui.open`.
     * There is a minimum and maximum size for this modal and a default size but it's possible to customize it anyway with the options parameter.
     *
     * @param name title of the plugin, it'll be displayed on the top of the modal
     * @param url of the plugin
     * @param options height and width of the modal.
     *
     * @example
     * ```js
     * penpot.ui.open('Plugin name', 'url', {width: 150, height: 300});
     * ```
     */
    open: (
      name: string,
      url: string,
      options?: { width: number; height: number }
    ) => void;
    /**
     * TODO description of sendMessage
     *
     * @param message content usually is an object
     *
     * @example
     * ```js
     * this.sendMessage({ type: 'example-type', content: 'data we want to share' });
     * ```
     */
    sendMessage: (message: unknown) => void;
    /**
     * This is usually used in the `plugin.ts` file in order to handle the data sent by our plugin
     *
     * @param message content usually is an object
     *
     * @example
     * ```js
     * penpot.ui.onMessage((message) => {if(message.type === 'example-type' { ...do something })});
     * ```
     */
    onMessage: <T>(callback: (message: T) => void) => void;
  };
  utils: {
    types: {
      isText(shape: PenpotShape): shape is PenpotText;
      isRectangle(shape: PenpotShape): shape is PenpotRectangle;
      isFrame(shape: PenpotShape): shape is PenpotFrame;
    };
  };
  /**
   * Closes the plugin. When this method is called the UI will be closed.
   *
   * @example
   * ```js
   * penpot.closePlugin();
   * ```
   */
  closePlugin: () => void;
  /**
   * TODO description of 'on'
   *
   * @example
   * ```js
   * penpot.on('pagechange', () => {...do something}).
   * ```
   */
  on: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;
  /**
   * TODO description of 'off'
   *
   * @example
   * ```js
   * penpot.off('pagechange', () => {...do something}).
   * ```
   */
  off: <T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ) => void;
}

declare global {
  const penpot: Penpot;
}
