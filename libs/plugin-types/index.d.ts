/**
 * Provides methods for managing plugin-specific data associated with a Penpot shape.
 */
export interface PenpotPluginData {
  /**
   * Retrieves the plugin-specific data associated with the given key.
   *
   * @param key The key for which to retrieve the data.
   * Returns the data associated with the key as a string.
   */
  getPluginData(key: string): string;

  /**
   * Sets the plugin-specific data for the given key.
   *
   * @param key The key for which to set the data.
   * @param value The data to set for the key.
   */
  setPluginData(key: string, value: string): void;

  /**
   * Retrieves all the keys for the plugin-specific data.
   *
   * Returns an array of strings representing all the keys.
   */
  getPluginDataKeys(): string[];

  /**
   * Retrieves the shared plugin-specific data for the given namespace and key.
   *
   * @param namespace The namespace for the shared data.
   * @param key The key for which to retrieve the data.
   * Returns the shared data associated with the key as a string.
   */
  getSharedPluginData(namespace: string, key: string): string;

  /**
   * Sets the shared plugin-specific data for the given namespace and key.
   *
   * @param namespace The namespace for the shared data.
   * @param key The key for which to set the data.
   * @param value The data to set for the key.
   */
  setSharedPluginData(namespace: string, key: string, value: string): void;

  /**
   * Retrieves all the keys for the shared plugin-specific data in the given namespace.
   *
   * @param namespace The namespace for the shared data.
   * Returns an array of strings representing all the keys in the namespace.
   */
  getSharedPluginDataKeys(namespace: string): string[];
}

/**
 * PenpotFile represents a file in the Penpot application.
 * It includes properties for the file's identifier, name, and revision number.
 */
export interface PenpotFile extends PenpotPluginData {
  id: string;
  name: string;
  revn: number;
}

/**
 * PenpotPage represents a page in the Penpot application.
 * It includes properties for the page's identifier and name, as well as methods for managing shapes on the page.
 */
export interface PenpotPage extends PenpotPluginData {
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
 * Represents a gradient configuration in Penpot.
 * A gradient can be either linear or radial and includes properties to define its shape, position, and color stops.
 */
export type PenpotGradient = {
  /**
   * Specifies the type of gradient.
   * - 'linear': A gradient that transitions colors along a straight line.
   * - 'radial': A gradient that transitions colors radiating outward from a central point.
   */
  type: 'linear' | 'radial';
  /**
   * The X-coordinate of the starting point of the gradient.
   */
  startX: number;
  /**
   * The Y-coordinate of the starting point of the gradient.
   */
  startY: number;
  /**
   * The X-coordinate of the ending point of the gradient.
   */
  endX: number;
  /**
   * The Y-coordinate of the ending point of the gradient.
   */
  endY: number;
  /**
   * The width of the gradient. For radial gradients, this could be interpreted as the radius.
   */
  width: number;
  /**
   * An array of color stops that define the gradient.
   */
  stops: Array<{ color: string; opacity?: number; offset: number }>;
};

/**
 * Represents image data in Penpot.
 * This includes properties for defining the image's dimensions, metadata, and aspect ratio handling.
 */
export type PenpotImageData = {
  /**
   * The optional name of the image.
   */
  name?: string;
  /**
   * The width of the image.
   */
  width: number;
  /**
   * The height of the image.
   */
  height: number;
  /**
   * The optional media type of the image (e.g., 'image/png', 'image/jpeg').
   */
  mtype?: string;
  /**
   * The unique identifier for the image.
   */
  id: string;
  /**
   * Whether to keep the aspect ratio of the image when resizing.
   * Defaults to false if omitted.
   */
  keepApectRatio?: boolean;
};

/**
 * Represents fill properties in Penpot.
 * This interface includes properties for defining solid color fills, gradient fills, and image fills.
 */
export interface PenpotFill {
  /**
   * The optional solid fill color, represented as a string (e.g., '#FF5733').
   */
  fillColor?: string;
  /**
   * The optional opacity level of the solid fill color, ranging from 0 (fully transparent) to 1 (fully opaque).
   * Defaults to 1 if omitted.
   */
  fillOpacity?: number;
  /**
   * The optional gradient fill defined by a PenpotGradient object.
   */
  fillColorGradient?: PenpotGradient;
  /**
   * The optional reference to an external file for the fill color.
   */
  fillColorRefFile?: string;
  /**
   * The optional reference ID within the external file for the fill color.
   */
  fillColorRefId?: string;
  /**
   * The optional image fill defined by a PenpotImageData object.
   */
  fillImage?: PenpotImageData;
}

/**
 * Represents the cap style of a stroke in Penpot.
 * This type defines various styles for the ends of a stroke.
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
 * Represents stroke properties in Penpot.
 * This interface includes properties for defining the color, style, width, alignment, and caps of a stroke.
 */
export interface PenpotStroke {
  /**
   * The optional color of the stroke, represented as a string (e.g., '#FF5733').
   */
  strokeColor?: string;
  /**
   * The optional reference to an external file for the stroke color.
   */
  strokeColorRefFile?: string;
  /**
   * The optional reference ID within the external file for the stroke color.
   */
  strokeColorRefId?: string;
  /**
   * The optional opacity level of the stroke color, ranging from 0 (fully transparent) to 1 (fully opaque).
   * Defaults to 1 if omitted.
   */
  strokeOpacity?: number;
  /**
   * The optional style of the stroke.
   */
  strokeStyle?: 'solid' | 'dotted' | 'dashed' | 'mixed' | 'none' | 'svg';
  /**
   * The optional width of the stroke.
   */
  strokeWidth?: number;
  /**
   * The optional alignment of the stroke relative to the shape's boundary.
   */
  strokeAlignment?: 'center' | 'inner' | 'outer';
  /**
   * The optional cap style for the start of the stroke.
   */
  strokeCapStart?: PenpotStrokeCap;
  /**
   * The optional cap style for the end of the stroke.
   */
  strokeCapEnd?: PenpotStrokeCap;
  /**
   * The optional gradient stroke defined by a PenpotGradient object.
   */
  strokeColorGradient?: PenpotGradient;
}

/**
 * Represents color properties in Penpot.
 * This interface includes properties for defining solid colors, gradients, and image fills, along with metadata.
 */
export interface PenpotColor {
  /**
   * The optional unique identifier for the color.
   */
  id?: string;
  /**
   * The optional name of the color.
   */
  name?: string;
  /**
   * The optional path or category to which this color belongs.
   */
  path?: string;
  /**
   * The optional solid color, represented as a string (e.g., '#FF5733').
   */
  color?: string;
  /**
   * The optional opacity level of the color, ranging from 0 (fully transparent) to 1 (fully opaque).
   * Defaults to 1 if omitted.
   */
  opacity?: number;
  /**
   * The optional reference ID for an external color definition.
   */
  refId?: string;
  /**
   * The optional reference to an external file for the color definition.
   */
  refFile?: string;
  /**
   * The optional gradient fill defined by a PenpotGradient object.
   */
  gradient?: PenpotGradient;
  /**
   * The optional image fill defined by a PenpotImageData object.
   */
  image?: PenpotImageData;
}

/**
 * Entry for the color shape additional information.
 */
export interface PenpotColorShapeInfoEntry {
  /**
   * Property that has the color (example: fill, stroke...)
   */
  readonly property: string;

  /**
   * For properties that are indexes (such as fill) represent the index
   * of the color inside that property.
   */
  readonly index?: number;

  /**
   * Identifier of the shape that contains the color
   */
  readonly shapeId: string;
}

/**
 * Additional color information for the methods to extract colors from a list of shapes.
 */
export interface PenpotColorShapeInfo {
  /**
   * List of shapes with additional information
   */
  readonly shapesInfo: PenpotColorShapeInfoEntry[];
}

/**
 * Represents shadow properties in Penpot.
 * This interface includes properties for defining drop shadows and inner shadows, along with their visual attributes.
 */
export interface PenpotShadow {
  /**
   * The optional unique identifier for the shadow.
   */
  id?: string;
  /**
   * The optional style of the shadow.
   * - 'drop-shadow': A shadow cast outside the element.
   * - 'inner-shadow': A shadow cast inside the element.
   */
  style?: 'drop-shadow' | 'inner-shadow';
  /**
   * The optional X-axis offset of the shadow.
   */
  offsetX?: number;
  /**
   * The optional Y-axis offset of the shadow.
   */
  offsetY?: number;
  /**
   * The optional blur radius of the shadow.
   */
  blur?: number;
  /**
   * The optional spread radius of the shadow.
   */
  spread?: number;
  /**
   * Specifies whether the shadow is hidden.
   * Defaults to false if omitted.
   */
  hidden?: boolean;
  /**
   * The optional color of the shadow, defined by a PenpotColor object.
   */
  color?: PenpotColor;
}

/**
 * Represents blur properties in Penpot.
 * This interface includes properties for defining the type and intensity of a blur effect, along with its visibility.
 */
export interface PenpotBlur {
  /**
   * The optional unique identifier for the blur effect.
   */
  id?: string;
  /**
   * The optional type of the blur effect.
   * Currently, only 'layer-blur' is supported.
   */
  type?: 'layer-blur';
  /**
   * The optional intensity value of the blur effect.
   */
  value?: number;
  /**
   * Specifies whether the blur effect is hidden.
   * Defaults to false if omitted.
   */
  hidden?: boolean;
}

/**
 * Represents parameters for frame guide columns in Penpot.
 * This interface includes properties for defining the appearance and layout of column guides within a frame.
 */
export interface PenpotFrameGuideColumnParams {
  /**
   * The color configuration for the column guides.
   */
  color: { color: string; opacity: number };
  /**
   * The optional alignment type of the column guides.
   * - 'stretch': Columns stretch to fit the available space.
   * - 'left': Columns align to the left.
   * - 'center': Columns align to the center.
   * - 'right': Columns align to the right.
   */
  type?: 'stretch' | 'left' | 'center' | 'right';
  /**
   * The optional size of each column.
   */
  size?: number;
  /**
   * The optional margin between the columns and the frame edges.
   */
  margin?: number;
  /**
   * The optional length of each item within the columns.
   */
  itemLength?: number;
  /**
   * The optional gutter width between columns.
   */
  gutter?: number;
}

/**
 * Represents parameters for frame guide squares in Penpot.
 * This interface includes properties for defining the appearance and size of square guides within a frame.
 */
export interface PenpotFrameGuideSquareParams {
  /**
   * The color configuration for the square guides.
   */
  color: { color: string; opacity: number };
  /**
   * The optional size of each square guide.
   */
  size?: number;
}

/**
 * Represents a frame guide for columns in Penpot.
 * This interface includes properties for defining the type, visibility, and parameters of column guides within a frame.
 */
export interface PenpotFrameGuideColumn {
  /**
   * The type of the guide, which is always 'column' for column guides.
   */
  type: 'column';
  /**
   * Specifies whether the column guide is displayed.
   */
  display: boolean;
  /**
   * The parameters defining the appearance and layout of the column guides.
   */
  params: PenpotFrameGuideColumnParams;
}

/**
 * Represents a frame guide for rows in Penpot.
 * This interface includes properties for defining the type, visibility, and parameters of row guides within a frame.
 */
export interface PenpotFrameGuideRow {
  /**
   * The type of the guide, which is always 'row' for row guides.
   */
  type: 'row';
  /**
   * Specifies whether the row guide is displayed.
   */
  display: boolean;
  /**
   * The parameters defining the appearance and layout of the row guides.
   * Note: This reuses the same parameter structure as column guides.
   */
  params: PenpotFrameGuideColumnParams;
}

/**
 * Represents a frame guide for squares in Penpot.
 * This interface includes properties for defining the type, visibility, and parameters of square guides within a frame.
 */
export interface PenpotFrameGuideSquare {
  /**
   * The type of the guide, which is always 'column' for square guides.
   */
  type: 'column';
  /**
   * Specifies whether the square guide is displayed.
   */
  display: boolean;
  /**
   * The parameters defining the appearance and layout of the square guides.
   */
  params: PenpotFrameGuideSquareParams;
}

/**
 * Represents a frame guide in Penpot.
 * This type can be one of several specific frame guide types: column, row, or square.
 */
export type PenpotFrameGuide =
  | PenpotFrameGuideColumn
  | PenpotFrameGuideRow
  | PenpotFrameGuideSquare;

/**
 * Represents export settings in Penpot.
 * This interface includes properties for defining export configurations.
 */
export interface PenpotExport {
  /**
   * Type of the file to export. Can be one of the following values: png, jpeg, svg, pdf
   */
  type: 'png' | 'jpeg' | 'svg' | 'pdf';
  /**
   * For bitmap formats represent the scale of the original size to resize the export
   */
  scale: number;
  /**
   * Suffix that will be appended to the resulting exported file
   */
  suffix: string;
}

/**
 * Represents the type of track in Penpot.
 * This type defines various track types that can be used in layout configurations.
 */
export type PenpotTrackType = 'flex' | 'fixed' | 'percent' | 'auto';

/**
 * Represents a track configuration in Penpot.
 * This interface includes properties for defining the type and value of a track used in layout configurations.
 */
export interface PenpotTrack {
  /**
   * The type of the track.
   * This can be one of the following values:
   * - 'flex': A flexible track type.
   * - 'fixed': A fixed track type.
   * - 'percent': A track type defined by a percentage.
   * - 'auto': An automatic track type.
   */
  type: PenpotTrackType;
  /**
   * The value of the track.
   * This can be a number representing the size of the track, or null if not applicable.
   */
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
 * Represents a flexible layout configuration in Penpot.
 * This interface extends `PenpotCommonLayout` and includes properties for defining the direction,
 * wrapping behavior, and child management of a flex layout.
 */
export interface PenpotFlexLayout extends PenpotCommonLayout {
  /**
   * The direction of the flex layout.
   * - 'row': Main axis is horizontal, from left to right.
   * - 'row-reverse': Main axis is horizontal, from right to left.
   * - 'column': Main axis is vertical, from top to bottom.
   * - 'column-reverse': Main axis is vertical, from bottom to top.
   */
  dir: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /**
   * The optional wrapping behavior of the flex layout.
   * - 'wrap': Child elements will wrap onto multiple lines.
   * - 'nowrap': Child elements will not wrap.
   */
  wrap?: 'wrap' | 'nowrap';
  /**
   * Appends a child element to the flex layout.
   * @param child The child element to be appended, of type `PenpotShape`.
   */
  appendChild(child: PenpotShape): void;
}

/**
 * Represents a path command in Penpot.
 * This interface includes a property for defining the type of command.
 */
interface PenpotPathCommand {
  /**
   * The type of path command.
   * Possible values include:
   * - 'M' or 'move-to': Move to a new point.
   * - 'Z' or 'close-path': Close the current path.
   * - 'L' or 'line-to': Draw a straight line to a new point.
   * - 'H' or 'line-to-horizontal': Draw a horizontal line to a new point.
   * - 'V' or 'line-to-vertical': Draw a vertical line to a new point.
   * - 'C' or 'curve-to': Draw a cubic Bezier curve to a new point.
   * - 'S' or 'smooth-curve-to': Draw a smooth cubic Bezier curve to a new point.
   * - 'Q' or 'quadratic-bezier-curve-to': Draw a quadratic Bezier curve to a new point.
   * - 'T' or 'smooth-quadratic-bezier-curve-to': Draw a smooth quadratic Bezier curve to a new point.
   * - 'A' or 'elliptical-arc': Draw an elliptical arc to a new point.
   */
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

  /**
   * Optional parameters associated with the path command.
   */
  params?: {
    /**
     * The x-coordinate of the point (or endpoint).
     */
    x?: number;

    /**
     * The y-coordinate of the point (or endpoint).
     */
    y?: number;

    /**
     * The x-coordinate of the first control point for curves.
     */
    c1x: number;

    /**
     * The y-coordinate of the first control point for curves.
     */
    c1y: number;

    /**
     * The x-coordinate of the second control point for curves.
     */
    c2x: number;

    /**
     * The y-coordinate of the second control point for curves.
     */
    c2y: number;

    /**
     * The radius of the ellipse's x-axis.
     */
    rx?: number;

    /**
     * The radius of the ellipse's y-axis.
     */
    ry?: number;

    /**
     * The rotation angle of the ellipse's x-axis.
     */
    xAxisRotation?: number;

    /**
     * A flag indicating whether to use the larger arc.
     */
    largeArcFlag?: boolean;

    /**
     * A flag indicating the direction of the arc.
     */
    sweepFlag?: boolean;
  };
}

/**
 * TODO PenpotLayoutChildProperties
 */
export interface PenpotLayoutChildProperties {
  /**
   * TODO absolute
   */
  absolute: boolean;
  /**
   * TODO zIndex
   */
  zIndex: number;

  /**
   * TODO horizontalSizing
   */
  horizontalSizing: 'auto' | 'fill' | 'fix';
  /**
   * TODO verticalSizing
   */
  verticalSizing: 'auto' | 'fill' | 'fix';

  /**
   * TODO alignSelf
   */
  alignSelf: 'auto' | 'start' | 'center' | 'end' | 'stretch';

  /**
   * TODO horizontalMargin
   */
  horizontalMargin: number;
  /**
   * TODO verticalMargin
   */
  verticalMargin: number;

  /**
   * TODO topMargin
   */
  topMargin: number;
  /**
   * TODO rightMargin
   */
  rightMargin: number;
  /**
   * TODO bottomMargin
   */
  bottomMargin: number;
  /**
   * TODO leftMargin
   */
  leftMargin: number;

  /**
   * TODO maxWidth
   */
  maxWidth: number | null;
  /**
   * TODO maxHeight
   */
  maxHeight: number | null;
  /**
   * TODO minWidth
   */
  minWidth: number | null;
  /**
   * TODO minHeight
   */
  minHeight: number | null;
}

/**
 * TODO PenpotLayoutCellProperties
 */
export interface PenpotLayoutCellProperties {
  /**
   * TODO row
   */
  row?: number;
  /**
   * TODO rowSpan
   */
  rowSpan?: number;
  /**
   * TODO column
   */
  column?: number;
  /**
   * TODO columnSpan
   */
  columnSpan?: number;
  /**
   * TODO areaName
   */
  areaName?: string;
  /**
   * TODO position
   */
  position?: 'auto' | 'manual' | 'area';
}

/**
 * Represents the base properties and methods of a shape in Penpot.
 * This interface provides common properties and methods shared by all shapes.
 */
export interface PenpotShapeBase extends PenpotPluginData {
  /**
   * The unique identifier of the shape.
   */
  readonly id: string;

  /**
   * The name of the shape.
   */
  name: string;

  /**
   * The x-coordinate of the shape's position.
   */
  x: number;

  /**
   * The y-coordinate of the shape's position.
   */
  y: number;

  /**
   * The width of the shape.
   */
  width: number;

  /**
   * The height of the shape.
   */
  height: number;

  /**
   * Indicates whether the shape is blocked.
   */
  blocked: boolean;

  /**
   * Indicates whether the shape is hidden.
   */
  hidden: boolean;

  /**
   * Indicates whether the shape has proportion lock enabled.
   */
  proportionLock: boolean;

  /**
   * The horizontal constraints applied to the shape.
   */
  constraintsHorizontal: 'left' | 'right' | 'leftright' | 'center' | 'scale';

  /**
   * The vertical constraints applied to the shape.
   */
  constraintsVertical: 'top' | 'bottom' | 'topbottom' | 'center' | 'scale';

  /**
   * The border radius of the shape.
   */
  borderRadius: number;

  /**
   * The border radius of the top-left corner of the shape.
   */
  borderRadiusTopLeft: number;

  /**
   * The border radius of the top-right corner of the shape.
   */
  borderRadiusTopRight: number;

  /**
   * The border radius of the bottom-right corner of the shape.
   */
  borderRadiusBottomRight: number;

  /**
   * The border radius of the bottom-left corner of the shape.
   */
  borderRadiusBottomLeft: number;

  /**
   * The opacity of the shape.
   */
  opacity: number;

  /**
   * The blend mode applied to the shape.
   */
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

  /**
   * The shadows applied to the shape.
   */
  shadows: PenpotShadow[];

  /**
   * The blur effect applied to the shape.
   */
  blur?: PenpotBlur;

  /**
   * The export settings of the shape.
   */
  exports: PenpotExport[];

  /**
   * The x-coordinate of the shape relative to its frame.
   */
  frameX: number;

  /**
   * The y-coordinate of the shape relative to its frame.
   */
  frameY: number;

  /**
   * The x-coordinate of the shape relative to its parent.
   */
  parentX: number;

  /**
   * The y-coordinate of the shape relative to its parent.
   */
  parentY: number;

  /**
   * Indicates whether the shape is flipped horizontally.
   */
  flipX: boolean;

  /**
   * Indicates whether the shape is flipped vertically.
   */
  flipY: boolean;

  /**
   * Returns the rotation in degrees of the shape with respect to it's center.
   */
  rotation: number;

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];

  /**
   * The strokes applied to the shape.
   */
  strokes: PenpotStroke[];

  /**
   * Layout properties for children of the shape.
   */
  readonly layoutChild?: PenpotLayoutChildProperties;

  /**
   * Layout properties for cells in a grid layout.
   */
  readonly layoutCell?: PenpotLayoutChildProperties;

  /*
   * Returns true if the current shape is inside a component instance
   */
  isComponentInstance(): boolean;

  /*
   * Returns true if the current shape is inside a component **main** instance
   */
  isComponentMainInstance(): boolean;

  /*
   * Returns true if the current shape is inside a component **copy** instance
   */
  isComponentCopyInstance(): boolean;

  /*
   * Returns true when the current shape is inside a **nested* component instance
   */
  isComponentNestedInstance(): boolean;

  /*
   * Returns true when the current shape is the root of a component tree
   */
  isComponentRoot(): boolean;

  /*
   * Returns true when the current shape is the head of a components tree nested structure
   */
  isComponentHead(): boolean;

  /*
   * Returns the equivalent shape in the component main instance. If the current shape is inside a
   * main instance will return `null`;
   */
  readonly componentRefShape: PenpotShape | null;

  /*
   * Returns the root of the component tree structure for the current shape. If the current shape
   * is already a root will return itself.
   */
  readonly componentRoot: PenpotShape | null;

  /*
   * Returns the head of the component tree structure for the current shape. If the current shape
   * is already a head will return itself.
   */
  readonly componentHead: PenpotShape | null;

  /*
   * If the shape is a component instance, returns the reference to the component associated
   * otherwise will return null
   */
  readonly component: PenpotLibraryComponent | null;

  /**
   * Resizes the shape to the specified width and height.
   * @param width The new width of the shape.
   * @param height The new height of the shape.
   */
  resize(width: number, height: number): void;

  /**
   * Rotates the shape in relation with the given center.
   * @param angle Angle in degrees to rotate.
   * @param center Center of the transform rotation. If not send will use the geometri center of the shapes.
   */
  rotate(angle: number, center?: { x: number; y: number } | null): void;

  /**
   * Creates a clone of the shape.
   * Returns a new instance of the shape with identical properties.
   */
  clone(): PenpotShape;
  /**
   * Removes the shape from its parent.
   */
  remove(): void;
}

/**
 * Represents a frame in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties and methods specific to frames.
 */
export interface PenpotFrame extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'frame' for frames.
   */
  readonly type: 'frame';
  /**
   * The grid layout configuration of the frame, if applicable.
   */
  readonly grid?: PenpotGridLayout;

  /**
   * The flex layout configuration of the frame, if applicable.
   */
  readonly flex?: PenpotFlexLayout;

  /**
   * The guides associated with the frame.
   */
  guides: PenpotFrameGuide;

  /**
   * The horizontal sizing behavior of the frame.
   */
  horizontalSizing?: 'auto' | 'fix';
  /**
   * The vertical sizing behavior of the frame.
   */
  verticalSizing?: 'auto' | 'fix';

  // Container Properties
  /**
   * The children shapes contained within the frame.
   */
  readonly children: PenpotShape[];
  /**
   * Appends a child shape to the frame.
   * @param child The child shape to append.
   */
  appendChild(child: PenpotShape): void;
  /**
   * Inserts a child shape at the specified index within the frame.
   * @param index The index at which to insert the child shape.
   * @param child The child shape to insert.
   */
  insertChild(index: number, child: PenpotShape): void;

  // Grid layout
  /**
   * Adds a flex layout configuration to the frame.
   * Returns the flex layout configuration added to the frame.
   */
  addFlexLayout(): PenpotFlexLayout;
  /**
   * Adds a grid layout configuration to the frame.
   * Returns the grid layout configuration added to the frame.
   */
  addGridLayout(): PenpotGridLayout;
}

/**
 * Represents a group of shapes in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties and methods specific to groups.
 */
export interface PenpotGroup extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'group' for groups.
   */
  readonly type: 'group';

  // Container Properties
  /**
   * The children shapes contained within the group.
   */
  readonly children: PenpotShape[];
  /**
   * Appends a child shape to the group.
   * @param child The child shape to append.
   */
  appendChild(child: PenpotShape): void;
  /**
   * Inserts a child shape at the specified index within the group.
   * @param index The index at which to insert the child shape.
   * @param child The child shape to insert.
   */
  insertChild(index: number, child: PenpotShape): void;

  /**
   * TODO
   */
  isMask(): boolean;

  /**
   * Converts the group into a mask.
   */
  makeMask(): void;
  /**
   * Removes the mask from the group.
   */
  removeMask(): void;
}

/**
 * Represents the boolean operation types available in Penpot.
 * These types define how shapes can be combined or modified using boolean operations.
 */
export type PenpotBoolType =
  | 'union'
  | 'difference'
  | 'exclude'
  | 'intersection';

/**
 * Represents a boolean operation shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties and methods specific to boolean operations.
 */
export interface PenpotBool extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'bool' for boolean operation shapes.
   */
  readonly type: 'bool';

  /**
   * Converts the boolean shape to its path data representation.
   * Returns the path data (d attribute) as a string.
   */
  toD(): string;
  /**
   * The content of the boolean shape, defined as an array of path commands.
   */
  content: Array<PenpotPathCommand>;

  // Container Properties
  /**
   * The children shapes contained within the boolean shape.
   */
  readonly children: PenpotShape[];
  /**
   * Appends a child shape to the boolean shape.
   * @param child The child shape to append.
   */
  appendChild(child: PenpotShape): void;
  /**
   * Inserts a child shape at the specified index within the boolean shape.
   * @param index The index at which to insert the child shape.
   * @param child The child shape to insert.
   */
  insertChild(index: number, child: PenpotShape): void;
}

/**
 * Represents a rectangle shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties specific to rectangles.
 */
export interface PenpotRectangle extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'rect' for rectangle shapes.
   */
  readonly type: 'rect';
}

/**
 * Represents a path shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties and methods specific to paths.
 */
export interface PenpotPath extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'path' for path shapes.
   */
  readonly type: 'path';
  /**
   * Converts the path shape to its path data representation.
   * Returns the path data (d attribute) as a string.
   */
  toD(): string;
  /**
   * The content of the path shape, defined as an array of path commands.
   */
  content: Array<PenpotPathCommand>;
}

/**
 * Represents a range of text within a PenpotText shape.
 * This interface provides properties for styling and formatting text ranges.
 */
export interface PenpotTextRange {
  /**
   * The PenpotText shape to which this text range belongs.
   */
  readonly shape: PenpotText;

  /**
   * The characters associated with the current text range.
   */
  readonly characters: string;

  /**
   * The font ID of the text range. It can be a specific font ID or 'mixed' if multiple fonts are used.
   */
  fontId: string | 'mixed';

  /**
   * The font family of the text range. It can be a specific font family or 'mixed' if multiple font families are used.
   */
  fontFamily: string | 'mixed';

  /**
   * The font variant ID of the text range. It can be a specific font variant ID or 'mixed' if multiple font variants are used.
   */
  fontVariantId: string | 'mixed';

  /**
   * The font size of the text range. It can be a specific font size or 'mixed' if multiple font sizes are used.
   */
  fontSize: string | 'mixed';

  /**
   * The font weight of the text range. It can be a specific font weight or 'mixed' if multiple font weights are used.
   */
  fontWeight: string | 'mixed';

  /**
   * The font style of the text range. It can be a specific font style or 'mixed' if multiple font styles are used.
   */
  fontStyle: string | 'mixed';

  /**
   * The line height of the text range. It can be a specific line height or 'mixed' if multiple line heights are used.
   */
  lineHeight: string | 'mixed';

  /**
   * The letter spacing of the text range. It can be a specific letter spacing or 'mixed' if multiple letter spacings are used.
   */
  letterSpacing: string | 'mixed';

  /**
   * The text transform applied to the text range. It can be a specific text transform or 'mixed' if multiple text transforms are used.
   */
  textTransform: string | 'mixed';

  /**
   * TODO textDecoration
   */
  textDecoration: string | 'mixed';

  /**
   * TODO direction
   */
  direction: string | 'mixed';

  /**
   * TODO fills
   */
  fills: PenpotFill[];

  /**
   * TODO align
   */
  align: string | 'mixed';

  /**
   * TODO verticalAlign
   */
  verticalAlign: string | 'mixed';

  /**
   * TODO applyTypography
   */
  applyTypography(typography: PenpotLibraryTypography): void;
}

/**
 * PenpotText represents a text element in the Penpot application, extending the base shape interface.
 * It includes various properties to define the text content and its styling attributes.
 */
export interface PenpotText extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'text' for text shapes.
   */
  readonly type: 'text';
  /**
   * The characters contained within the text shape.
   */
  characters: string;
  /**
   * The grow type of the text shape, defining how the text box adjusts its size.
   * Possible values are:
   * - 'fixed': Fixed size.
   * - 'auto-width': Adjusts width automatically.
   * - 'auto-height': Adjusts height automatically.
   */
  growType: 'fixed' | 'auto-width' | 'auto-height';

  /**
   * The font ID used in the text shape, or 'mixed' if multiple fonts are used.
   */
  fontId: string | 'mixed';

  /**
   * The font family used in the text shape, or 'mixed' if multiple font families are used.
   */
  fontFamily: string | 'mixed';

  /**
   * The font variant ID used in the text shape, or 'mixed' if multiple font variants are used.
   */
  fontVariantId: string | 'mixed';

  /**
   * The font size used in the text shape, or 'mixed' if multiple font sizes are used.
   */
  fontSize: string | 'mixed';

  /**
   * The font weight used in the text shape, or 'mixed' if multiple font weights are used.
   */
  fontWeight: string | 'mixed';

  /**
   * The font style used in the text shape, or 'mixed' if multiple font styles are used.
   */
  fontStyle: string | 'mixed';

  /**
   * The line height used in the text shape, or 'mixed' if multiple line heights are used.
   */
  lineHeight: string | 'mixed';

  /**
   * The letter spacing used in the text shape, or 'mixed' if multiple letter spacings are used.
   */
  letterSpacing: string | 'mixed';

  /**
   * The text transform applied to the text shape, or 'mixed' if multiple text transforms are used.
   */
  textTransform: string | 'mixed';

  /**
   * TODO textDecoration
   */
  textDecoration: string | 'mixed';

  /**
   * TODO direction
   */
  direction: string | 'mixed';

  /**
   * TODO align
   */
  align: string | 'mixed';

  /**
   * TODO verticalAlign
   */
  verticalAlign: string | 'mixed';

  /**
   * TODO getRange
   */
  getRange(start: number, end: number): PenpotTextRange;

  /**
   * TODO applyTypography
   */
  applyTypography(typography: PenpotLibraryTypography): void;
}

/**
 * Represents a frame shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties specific to frames.
 */
export interface PenpotFrame extends PenpotShapeBase {
  /**
   * The type of the shape, which is always 'frame' for frame shapes.
   */
  readonly type: 'frame';

  /**
   * The children shapes contained within the frame.
   */
  readonly children: PenpotShape[];
}

/**
 * Represents an ellipse shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties specific to ellipses.
 */
export interface PenpotEllipse extends PenpotShapeBase {
  type: 'circle';
}

/**
 * Represents an SVG raw shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties specific to raw SVG shapes.
 */
export interface PenpotSvgRaw extends PenpotShapeBase {
  type: 'svg-raw';
}

/**
 * Represents an image shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties specific to image shapes.
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
 * Represents a mapping of events to their corresponding types in Penpot.
 * This interface provides information about various events that can be triggered in the application.
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
 * This type specifies the possible themes: 'light' or 'dark'.
 */
export type PenpotTheme = 'light' | 'dark';

/**
 * Represents an element in a Penpot library.
 * This interface provides information about a specific element in a library.
 */
export interface PenpotLibraryElement extends PenpotPluginData {
  /**
   * The unique identifier of the library element.
   */
  readonly id: string;

  /**
   * The unique identifier of the library to which the element belongs.
   */
  readonly libraryId: string;

  /**
   * The name of the library element.
   */
  name: string;

  /**
   * The path of the library element.
   */
  path: string;
}

/**
 * Represents a color element from a library in Penpot.
 * This interface extends `PenpotLibraryElement` and includes properties specific to color elements.
 */
export interface PenpotLibraryColor extends PenpotLibraryElement {
  /**
   * The color value of the library color.
   */
  color?: string;

  /**
   * The opacity value of the library color.
   */
  opacity?: number;

  /**
   * The gradient value of the library color, if it's a gradient.
   */
  gradient?: PenpotGradient;

  /**
   * The image data of the library color, if it's an image fill.
   */
  image?: PenpotImageData;

  /**
   * Converts the library color into a fill object.
   * Returns a `PenpotFill` object representing the color as a fill.
   * @example
   * ```js
   * const fill = libraryColor.asFill();
   * ```
   */
  asFill(): PenpotFill;
  /**
   * Converts the library color into a stroke object.
   * Returns a `PenpotStroke` object representing the color as a stroke.
   * @example
   * ```js
   * const stroke = libraryColor.asStroke();
   * ```
   */
  asStroke(): PenpotStroke;
}

/**
 * Represents a typography element from a library in Penpot.
 * This interface extends `PenpotLibraryElement` and includes properties specific to typography elements.
 */
export interface PenpotLibraryTypography extends PenpotLibraryElement {
  /**
   * The unique identifier of the font used in the typography element.
   */
  fontId: string;

  /**
   * The font family of the typography element.
   */
  fontFamily: string;

  /**
   * The unique identifier of the font variant used in the typography element.
   */
  fontVariantId: string;

  /**
   * The font size of the typography element.
   */
  fontSize: string;

  /**
   * The font weight of the typography element.
   */
  fontWeight: string;

  /**
   * The font style of the typography element.
   */
  fontStyle: string;

  /**
   * The line height of the typography element.
   */
  lineHeight: string;

  /**
   * The letter spacing of the typography element.
   */
  letterSpacing: string;

  /**
   * The text transform applied to the typography element.
   */
  textTransform: string;

  /**
   * Applies the typography styles to a text shape.
   * @param shape The text shape to apply the typography styles to.
   * @example
   * ```js
   * typographyElement.applyToText(textShape);
   * ```
   */
  applyToText(shape: PenpotShape): void;

  /**
   * Applies the typography styles to a range of text within a text shape.
   * @param shape The text shape containing the text range to apply the typography styles to.
   * @example
   * ```js
   * typographyElement.applyToTextRange(textShape);
   * ```
   */
  applyToTextRange(range: PenpotTextRange): void;

  /**
   * TODO setFont
   */
  setFont(font: PenpotFont, variant?: PenpotFontVariant): void;
}

/**
 * Represents a component element from a library in Penpot.
 * This interface extends `PenpotLibraryElement` and includes properties specific to component elements.
 */
export interface PenpotLibraryComponent extends PenpotLibraryElement {
  /**
   * Creates an instance of the component.
   * Returns a `PenpotShape` object representing the instance of the component.
   * @example
   * ```js
   * const componentInstance = libraryComponent.instance();
   * ```
   */
  instance(): PenpotShape;

  /*
   * Returns the reference to the main component shape.
   */
  mainInstance: PenpotShape;
}

export interface PenpotLibrarySummary {
  /**
   * TODO id
   */
  readonly id: string;

  /**
   * TODO name
   */
  readonly name: string;

  /**
   * TODO numColors
   */
  readonly numColors: number;

  /**
   * TODO numComponents
   */
  readonly numComponents: number;

  /**
   * TODO numTypographies
   */
  readonly numTypographies: number;
}

/**
 * Represents a library in Penpot, containing colors, typographies, and components.
 * This type provides methods to create new color, typography, and component elements within the library.
 */
export interface PenpotLibrary extends PenpotPluginData {
  /**
   * TODO id
   */
  readonly id: string;

  /**
   * TODO name
   */
  readonly name: string;

  /**
   * An array of color elements in the library.
   */
  colors: PenpotLibraryColor[];

  /**
   * An array of typography elements in the library.
   */
  typographies: PenpotLibraryTypography[];

  /**
   * An array of component elements in the library.
   */
  components: PenpotLibraryComponent[];

  /**
   * Creates a new color element in the library.
   * Returns a new `PenpotLibraryColor` object representing the created color element.
   * @example
   * ```js
   * const newColor = library.createColor();
   * ```
   */
  createColor(): PenpotLibraryColor;

  /**
   * Creates a new typography element in the library.
   * Returns a new `PenpotLibraryTypography` object representing the created typography element.
   * @example
   * ```js
   * const newTypography = library.createTypography();
   * ```
   */
  createTypography(): PenpotLibraryTypography;

  /**
   * Creates a new component element in the library using the provided shapes.
   * @param shapes An array of `PenpotShape` objects representing the shapes to be included in the component.
   * Returns a new `PenpotLibraryComponent` object representing the created component element.
   * @example
   * ```js
   * const newComponent = library.createComponent([shape1, shape2]);
   * ```
   */
  createComponent(shapes: PenpotShape[]): PenpotLibraryComponent;
}

/**
 * Represents the context of Penpot libraries, including both local and connected libraries.
 * This type contains references to the local library and an array of connected libraries.
 */
export type PenpotLibraryContext = {
  /**
   * The local library in the Penpot context.
   * @example
   * ```js
   * const localLibrary = libraryContext.local;
   * ```
   */
  readonly local: PenpotLibrary;

  /**
   * An array of connected libraries in the Penpot context.
   * @example
   * ```js
   * const connectedLibraries = libraryContext.connected;
   * ```
   */
  readonly connected: PenpotLibrary[];

  /**
   * TODO: availableLibraries
   */
  availableLibraries(): Promise<PenpotLibrarySummary[]>;

  /**
   * TODO: linkToFile
   */
  connectLibrary(libraryId: string): Promise<PenpotLibrary>;
};

/**
 * TODO PenpotFontVariant
 */
export interface PenpotFontVariant {
  /**
   * TODO name
   */
  name: string;
  /**
   * TODO fontVariantId
   */
  fontVariantId: string;
  /**
   * TODO fontWeight
   */
  fontWeight: string;
  /**
   * TODO fontStyle
   */
  fontStyle: string;
}

/**
 * TODO PenpotFont
 */
export interface PenpotFont {
  /**
   * TODO name
   */
  name: string;
  /**
   * TODO fontId
   */
  fontId: string;
  /**
   * TODO fontFamily
   */
  fontFamily: string;
  /**
   * TODO fontStyle
   */
  fontStyle: string;
  /**
   * TODO fontVariantId
   */
  fontVariantId: string;
  /**
   * TODO fontWeight
   */
  fontWeight: string;
  /**
   * TODO variants
   */
  variants: PenpotFontVariant[];
  /**
   * TODO applyToText
   */
  applyToText(text: PenpotText, variant?: PenpotFontVariant): void;
  /**
   * TODO applyToRange
   */
  applyToRange(range: PenpotTextRange, variant?: PenpotFontVariant): void;
}

/**
 * TODO PenpotFontsContext
 */
export interface PenpotFontsContext {
  /**
   * TODO all
   */
  all: PenpotFont[];
  /**
   * TODO findById
   */
  findById(id: string): PenpotFont | null;
  /**
   * TODO findByName
   */
  findByName(name: string): PenpotFont | null;
  /**
   * TODO findAllById
   */
  findAllById(id: string): PenpotFont[];
  /**
   * TODO findAllByName
   */
  findAllByName(name: string): PenpotFont[];
}

/**
 * Represents a user in Penpot.
 */
export interface PenpotUser {
  /**
   * The unique identifier of the user.
   * @example
   * ```js
   * const userId = user.id;
   * ```
   */
  readonly id: string;

  /**
   * The name of the user.
   * @example
   * ```js
   * const userName = user.name;
   * ```
   */
  readonly name?: string;

  /**
   * The URL of the user's avatar image.
   * @example
   * ```js
   * const avatarUrl = user.avatarUrl;
   * ```
   */
  readonly avatarUrl?: string;

  /**
   * The color associated with the user.
   * @example
   * ```js
   * const userColor = user.color;
   * ```
   */
  readonly color: string;

  /**
   * The session ID of the user.
   * @example
   * ```js
   * const sessionId = user.sessionId;
   * ```
   */
  readonly sessionId?: string;
}

/**
 * Represents an active user in Penpot, extending the `PenpotUser` interface.
 * This interface includes additional properties specific to active users.
 */
export interface PenpotActiveUser extends PenpotUser {
  /**
   * The position of the active user.
   * @example
   * ```js
   * const userPosition = activeUser.position;
   * ```
   */
  position?: { x: number; y: number };
  /**
   * The zoom level of the active user.
   * @example
   * ```js
   * const userZoom = activeUser.zoom;
   * ```
   */
  readonly zoom?: number;
}

/**
 * Represents the context of Penpot, providing access to various Penpot functionalities and data.
 */
export interface PenpotContext {
  /**
   * The root shape in the current Penpot context.
   * @example
   * ```js
   * const rootShape = context.root;
   * ```
   */
  readonly root: PenpotShape;
  /**
   * The current page in the Penpot context.
   * @example
   * ```js
   * const currentPage = context.currentPage;
   * ```
   */
  readonly currentPage: PenpotPage;
  /**
   * The viewport settings in the Penpot context.
   * @example
   * ```js
   * const viewportSettings = context.viewport;
   * ```
   */
  readonly viewport: PenpotViewport;
  /**
   * The library context in the Penpot context, including both local and connected libraries.
   * @example
   * ```js
   * const libraryContext = context.library;
   * ```
   */
  readonly library: PenpotLibraryContext;
  /**
   * TODO
   */
  readonly fonts: PenpotFontsContext;
  /**
   * The current user in the Penpot context.
   * @example
   * ```js
   * const currentUser = context.currentUser;
   * ```
   */
  readonly currentUser: PenpotUser;
  /**
   * An array of active users in the Penpot context.
   * @example
   * ```js
   * const activeUsers = context.activeUsers;
   * ```
   */
  readonly activeUsers: PenpotActiveUser;

  /**
   * The currently selected shapes in Penpot.
   * @example
   * ```js
   * const selectedShapes = context.selection;
   * ```
   */
  selection: PenpotShape[];

  /**
   * Retrieves file data from the current Penpot context.
   * Returns the file data or `null` if no file is available.
   * @example
   * ```js
   * const fileData = context.getFile();
   * ```
   */
  getFile(): PenpotFile | null;
  /**
   * Retrieves page data from the current Penpot context.
   * Returns the page data or `null` if no page is available.
   * @example
   * ```js
   * const pageData = context.getPage();
   * ```
   */
  getPage(): PenpotPage | null;
  /**
   * Retrieves the IDs of the currently selected elements in Penpot.
   * Returns an array of IDs representing the selected elements.
   * @example
   * ```js
   * const selectedIds = context.getSelected();
   * ```
   */
  getSelected(): string[];
  /**
   * Retrieves the shapes of the currently selected elements in Penpot.
   * Returns an array of shapes representing the selected elements.
   * @example
   * ```js
   * const selectedShapes = context.getSelectedShapes();
   * ```
   */
  getSelectedShapes(): PenpotShape[];

  /**
   * TODO: shapesColors
   */
  shapesColors(shapes: PenpotShape[]): (PenpotColor & PenpotColorShapeInfo)[];

  /**
   * TODO: replaceColor
   */
  replaceColor(
    shapes: PenpotShape[],
    oldColor: PenpotColor,
    newColor: PenpotColor
  ): void;

  /**
   * Retrieves the current theme (light or dark) in Penpot.
   * Returns the current theme.
   * @example
   * ```js
   * const currentTheme = context.getTheme();
   * ```
   */
  getTheme(): PenpotTheme;

  /**
   * Uploads media to Penpot and retrieves its image data.
   * @param name The name of the media.
   * @param url The URL of the media to be uploaded.
   * Returns a promise that resolves to the image data of the uploaded media.
   * @example
   * ```js
   * const imageData = await context.uploadMediaUrl('example', 'https://example.com/image.jpg');
   * ```
   */
  uploadMediaUrl(name: string, url: string): Promise<PenpotImageData>;

  /**
   * Uploads media to penpot and retrieves the image data
   * @param name The name of the media.
   * @param data The image content data
   * Returns a promise that resolves to the image data of the uploaded media.
   */
  uploadMediaData(
    name: string,
    data: Uint8Array,
    mimeType: string
  ): Promise<PenpotImageData>;

  // Methods for creating shapes and components
  group(shapes: PenpotShape[]): PenpotGroup | null;
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
   * Creates a PenpotBoolean shape based on the specified boolean operation and shapes.
   * @param boolType The type of boolean operation ('union', 'difference', 'exclude', 'intersection').
   * @param shapes An array of shapes to perform the boolean operation on.
   * Returns the newly created PenpotBoolean shape resulting from the boolean operation.
   * @example
   * ```js
   * const booleanShape = context.createBoolean('union', [shape1, shape2]);
   * ```
   */
  createBoolean(
    boolType: PenpotBoolType,
    shapes: PenpotShape[]
  ): PenpotBool | null;
  /**
   * Creates a PenpotGroup from an SVG string.
   * @param svgString The SVG string representing the shapes to be converted into a group.
   * Returns the newly created PenpotGroup containing the shapes from the SVG.
   * @example
   * ```js
   * const svgGroup = context.createShapeFromSvg('<svg>...</svg>');
   * ```
   */
  createShapeFromSvg(svgString: string): PenpotGroup | null;
  /**
   * Creates a PenpotText shape with the specified text content.
   * @param text The text content for the PenpotText shape.
   * Returns the new created shape, if the shape wasn't created can return null.
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
   * @document
   * ![example image](https://placehold.co/600x400)
   */
  createText(text: string): PenpotText | null;

  /**
   *
   * @param shapes
   * @param markupType will default to 'html'
   */
  generateMarkup(
    shapes: PenpotShape[],
    options?: { type?: 'html' | 'svg' }
  ): string;

  /**
   *
   * @param shapes
   * @param styleType will default to 'css'
   * @param withPrelude will default to `false`
   * @param includeChildren will default to `true`
   */
  generateStyle(
    shapes: PenpotShape[],
    options?: {
      type?: 'css';
      withPrelude?: boolean;
      includeChildren?: boolean;
    }
  ): string;

  // Event listeners
  addListener<T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void
  ): symbol;
  removeListener(listenerId: symbol): void;
}

/**
 * TODO PenpotContextGeometryUtils
 */
export interface PenpotContextGeometryUtils {
  /**
   * TODO center
   */
  center(shapes: PenpotShape[]): { x: number; y: number } | null;
}

/**
 * TODO PenpotContextTypesUtils
 */
export interface PenpotContextTypesUtils {
  /**
   * TODO isFrame
   */
  isFrame(shape: PenpotShape): shape is PenpotFrame;
  /**
   * TODO isGroup
   */
  isGroup(shape: PenpotShape): shape is PenpotGroup;
  /**
   * TODO isMask
   */
  isMask(shape: PenpotShape): shape is PenpotGroup;
  /**
   * TODO isBool
   */
  isBool(shape: PenpotShape): shape is PenpotBool;
  /**
   * TODO isRectangle
   */
  isRectangle(shape: PenpotShape): shape is PenpotRectangle;
  /**
   * TODO isPath
   */
  isPath(shape: PenpotShape): shape is PenpotPath;
  /**
   * TODO isText
   */
  isText(shape: PenpotShape): shape is PenpotText;
  /**
   * TODO isEllipse
   */
  isEllipse(shape: PenpotShape): shape is PenpotEllipse;
  /**
   * TODO isSVG
   */
  isSVG(shape: PenpotShape): shape is PenpotSvgRaw;
}

/**
 * TODO PenpotContextUtils
 */
export interface PenpotContextUtils {
  /**
   * TODO PenpotContextGeometryUtils
   */
  readonly geometry: PenpotContextGeometryUtils;
  /**
   * TODO PenpotContextTypesUtils
   */
  readonly types: PenpotContextTypesUtils;
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
     * Sends a message to the plugin UI.
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
  /**
   * TODO: utils
   */
  utils: PenpotContextUtils;
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
   * Adds an event listener for the specified event type.
   *
   * @param type The event type to listen for.
   * @param callback The callback function to execute when the event is triggered.
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
   * Removes an event listener for the specified event type.
   *
   * @param type The event type to stop listening for.
   * @param callback The callback function to remove.
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
