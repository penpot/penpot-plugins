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
     @param callback - A function that will be called whenever a message is received.
     * The function receives a single argument, `message`, which is of type `T`.
     *
     * @example
     * ```js
     * penpot.ui.onMessage((message) => {if(message.type === 'example-type' { ...do something })});
     * ```
     */
    onMessage: <T>(callback: (message: T) => void) => void;
  };
  /**
   * Provides access to utility functions and context-specific operations.
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
   * Subscribing to events requires `content:read` permission.
   *
   * The following are the posible event types:
   *  - pagechange: event emitted when the current page changes. The callback will receive the new page.
   *  - shapechange: event emitted when the shape changes. This event requires to send inside the `props` object the shape
   *  that will be observed. For example:
   *  ```javascript
   *  // Observe the current selected shape
   *  penpot.on('shapechange', (shape) => console.log(shape.name), { shapeId: penpot.selection[0].id });
   *  ```
   *  - selectionchange: event emitted when the current selection changes. The callback will receive the list of ids for the new selection
   *  - themechange: event emitted when the user changes its theme. The callback will receive the new theme (currentlly: either `dark` or `light`)
   *  - documentsaved: event emitted afther the document is saved in the backend.
   *
   * @param type The event type to listen for.
   * @param callback The callback function to execute when the event is triggered.
   * @param props The properties for the current event handler. Only makes sense for specific events.
   * @return the listener id that can be used to call `off` and cancel the listener
   *
   * @example
   * ```js
   * penpot.on('pagechange', () => {...do something}).
   * ```
   */
  on<T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void,
    props?: { [key: string]: unknown }
  ): symbol;

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
   * @deprecated this method should not be used. Use instead off sending the `listenerId` (return value from `on` method)
   */
  off<T extends keyof EventsMap>(
    type: T,
    callback?: (event: EventsMap[T]) => void
  ): void;

  /**
   * Removes an event listener for the specified event type.
   *
   * @param listenerId the id returned by the `on` method when the callback was set
   *
   * @example
   * ```js
   * const listenerId = penpot.on('contentsave', () => console.log("Changed"));
   * penpot.off(listenerId);
   * ```
   */
  off(listenerId: symbol): void;
}

/**
 * Provides methods for managing plugin-specific data associated with a Penpot shape.
 */
export interface PenpotPluginData {
  /**
   * Retrieves the data for our own plugin, given a specific key.
   *
   * @param key The key for which to retrieve the data.
   * @return Returns the data associated with the key as a string.
   *
   * @example
   * ```js
   * const data = shape.getPluginData('exampleKey');
   * console.log(data);
   * ```
   */
  getPluginData(key: string): string;

  /**
   * Sets the plugin-specific data for the given key.
   *
   * @param key The key for which to set the data.
   * @param value The data to set for the key.
   *
   * @example
   * ```js
   * shape.setPluginData('exampleKey', 'exampleValue');
   * ```
   */
  setPluginData(key: string, value: string): void;

  /**
   * Retrieves all the keys for the plugin-specific data.
   *
   * @return Returns an array of strings representing all the keys.
   *
   * @example
   * ```js
   * const keys = shape.getPluginDataKeys();
   * console.log(keys);
   * ```
   */
  getPluginDataKeys(): string[];

  /**
   * If we know the namespace of an external plugin, this is the way to get their data.
   *
   * @param namespace The namespace for the shared data.
   * @param key The key for which to retrieve the data.
   * @return Returns the shared data associated with the key as a string.
   *
   * @example
   * ```js
   * const sharedData = shape.getSharedPluginData('exampleNamespace', 'exampleKey');
   * console.log(sharedData);
   * ```
   */
  getSharedPluginData(namespace: string, key: string): string;

  /**
   * Sets the shared plugin-specific data for the given namespace and key.
   *
   * @param namespace The namespace for the shared data.
   * @param key The key for which to set the data.
   * @param value The data to set for the key.
   *
   * @example
   * ```js
   * shape.setSharedPluginData('exampleNamespace', 'exampleKey', 'exampleValue');
   * ```
   */
  setSharedPluginData(namespace: string, key: string, value: string): void;

  /**
   * Retrieves all the keys for the shared plugin-specific data in the given namespace.
   *
   * @param namespace The namespace for the shared data.
   * @return Returns an array of strings representing all the keys in the namespace.
   *
   * @example
   * ```js
   * const sharedKeys = shape.getSharedPluginDataKeys('exampleNamespace');
   * console.log(sharedKeys);
   * ```
   */
  getSharedPluginDataKeys(namespace: string): string[];
}

/**
 * PenpotFile represents a file in the Penpot application.
 * It includes properties for the file's identifier, name, and revision number.
 */
export interface PenpotFile extends PenpotPluginData {
  /**
   * The `id` property is a unique identifier for the file.
   */
  readonly id: string;

  /**
   * The `name` for the file
   */
  name: string;

  /**
   * The `revn` will change for every document update
   */
  revn: number;

  /**
   * List all the pages for the current file
   */
  pages: PenpotPage[];

  /*
   * Export the current file to an archive.
   * @param `exportType` indicates the type of file to generate.
   * - `'penpot'` will create a *.penpot file with a binary representation of the file
   * - `'zip'` will create a *.zip with the file exported in several SVG files with some JSON metadata
   * @param `libraryExportType` indicates what to do with the linked libraries of the file when
   * exporting it. Defaults to `all` if not sent.
   * - `'all'` will include the libraries as external files that will be exported in a single bundle
   * - `'merge'` will add all the assets into the main file and only one file will be imported
   * - `'detach'` will unlink all the external assets and no libraries will be imported
   * @param `progressCallback` for `zip` export can be pass this callback so a progress report is sent.
   *
   * @example
   * ```js
   * const exportedData = await file.export('penpot', 'all');
   * ```
   */
  export(
    exportType: 'penpot' | 'zip',
    libraryExportType?: 'all' | 'merge' | 'detach'
  ): Promise<Uint8Array>;
}

/**
 * PenpotPage represents a page in the Penpot application.
 * It includes properties for the page's identifier and name, as well as methods for managing shapes on the page.
 */
export interface PenpotPage extends PenpotPluginData {
  /**
   * The `id` property is a unique identifier for the page.
   */
  readonly id: string;
  /**
   * The `name` property is the name of the page.
   */
  name: string;

  /**
   * The root shape of the current page. Will be the parent shape of all the shapes inside the document.
   * Requires `content:read` permission.
   */
  root: PenpotShape;

  /**
   * Retrieves a shape by its unique identifier.
   * @param id The unique identifier of the shape.
   *
   * @example
   * ```js
   * const shape = penpot.getPage().getShapeById('shapeId');
   * ```
   */
  getShapeById(id: string): PenpotShape | null;

  /**
   * Finds all shapes on the page.
   * Optionaly it gets a criteria object to search for specific criteria
   * @param criteria
   * @example
   * ```js
   * const shapes = penpot.getPage().findShapes({ name: 'exampleName' });
   * ```
   */
  findShapes(criteria?: {
    name?: string;
    nameLike?: string;
    type?:
      | 'frame'
      | 'group'
      | 'bool'
      | 'rect'
      | 'path'
      | 'text'
      | 'circle'
      | 'svg-raw'
      | 'image';
  }): PenpotShape[];

  /**
   * The interaction flows defined for the page.
   */
  readonly flows: PenpotFlow[];

  /**
   * Creates a new flow in the page.
   * @param name the name identifying the flow
   * @param frame the starting frame for the current flow
   *
   * @example
   * ```js
   * const flow = penpot.getPage().createFlow('exampleFlow', frame);
   * ```
   */
  createFlow(name: string, frame: PenpotFrame): PenpotFlow;

  /**
   * Removes the flow from the page
   * @param flow the flow to be removed from the page
   */
  removeFlow(flow: PenpotFlow): void;
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
   *
   * @example
   * ```js
   * const gradient: PenpotGradient = { type: 'linear', startX: 0, startY: 0, endX: 100, endY: 100, width: 100, stops: [{ color: '#FF5733', offset: 0 }] };
   * ```
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
 * Represents fill properties in Penpot. You can add a fill to any shape except for groups.
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
 * Represents stroke properties in Penpot. You can add a stroke to any shape except for groups.
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
   * The type of the guide, which is always 'square' for square guides.
   */
  type: 'square';
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
  scale?: number;
  /**
   * Suffix that will be appended to the resulting exported file
   */
  suffix?: string;
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
   *
   * @example
   * ```js
   * const frame = penpot.createFrame();
   * const grid = frame.addGridLayout();
   * grid.addRow("flex", 1);
   * ```
   */
  addRow(type: PenpotTrackType, value?: number): void;
  /**
   * Adds a new row to the grid at the specified index.
   * @param index The index at which to add the row.
   * @param type The type of the row to add.
   * @param value The value associated with the row type (optional).
   *
   * @example
   * ```js
   * gridLayout.addRowAtIndex(0, 'fixed', 100);
   * ```
   */
  addRowAtIndex(index: number, type: PenpotTrackType, value?: number): void;
  /**
   * Adds a new column to the grid.
   * @param type The type of the column to add.
   * @param value The value associated with the column type (optional).
   *
   * @example
   * ```js
   * const frame = penpot.createFrame();
   * const grid = frame.addGridLayout();
   * grid.addColumn('percent', 50);
   * ```
   */
  addColumn(type: PenpotTrackType, value?: number): void;
  /**
   * Adds a new column to the grid at the specified index.
   * @param index The index at which to add the column.
   * @param type The type of the column to add.
   * @param value The value associated with the column type.
   *
   * @example
   * ```js
   * gridLayout.addColumnAtIndex(1, 'auto');
   * ```
   */
  addColumnAtIndex(index: number, type: PenpotTrackType, value: number): void;
  /**
   * Removes a row from the grid at the specified index.
   * @param index The index of the row to remove.
   *
   * @example
   * ```js
   * gridLayout.removeRow(2);
   * ```
   */
  removeRow(index: number): void;
  /**
   * Removes a column from the grid at the specified index.
   * @param index The index of the column to remove.
   *
   * @example
   * ```js
   * gridLayout.removeColumn(3);
   * ```
   */
  removeColumn(index: number): void;
  /**
   * Sets the properties of a column at the specified index.
   * @param index The index of the column to set.
   * @param type The type of the column.
   * @param value The value associated with the column type (optional).
   *
   * @example
   * ```js
   * gridLayout.setColumn(0, 'fixed', 200);
   * ```
   */
  setColumn(index: number, type: PenpotTrackType, value?: number): void;
  /**
   * Sets the properties of a row at the specified index.
   * @param index The index of the row to set.
   * @param type The type of the row.
   * @param value The value associated with the row type (optional).
   *
   * @example
   * ```js
   * gridLayout.setRow(1, 'flex');
   * ```
   */
  setRow(index: number, type: PenpotTrackType, value?: number): void;

  /**
   * Appends a child element to the grid at the specified row and column.
   * @param child The child element to append.
   * @param row The row index where the child will be placed.
   * @param column The column index where the child will be placed.
   *
   * @example
   * ```js
   * gridLayout.appendChild(childShape, 0, 1);
   * ```
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
   *
   * @example
   * ```js
   * flexLayout.appendChild(childShape);
   * ```
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
   *
   * @example
   * ```js
   * const pathCommand: PenpotPathCommand = { command: 'M', params: { x: 0, y: 0 } };
   * ```
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
    c1x?: number;

    /**
     * The y-coordinate of the first control point for curves.
     */
    c1y?: number;

    /**
     * The x-coordinate of the second control point for curves.
     */
    c2x?: number;

    /**
     * The y-coordinate of the second control point for curves.
     */
    c2y?: number;

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
 * Properties for defining the layout of a child element in Penpot.
 */
export interface PenpotLayoutChildProperties {
  /**
   * Specifies whether the child element is positioned absolutely.
   * When set to true, the element is taken out of the normal document flow and positioned relative to its nearest positioned ancestor.
   */
  absolute: boolean;

  /**
   * Defines the stack order of the child element
   * Elements with a higher zIndex will be displayed in front of those with a lower zIndex.
   */
  zIndex: number;

  /**
   * Determines the horizontal sizing behavior of the child element
   * - 'auto': The width is determined by the content.
   * - 'fill': The element takes up the available width.
   * - 'fix': The width is fixed.
   */
  horizontalSizing: 'auto' | 'fill' | 'fix';

  /**
   * Determines the vertical sizing behavior of the child element.
   * - 'auto': The height is determined by the content.
   * - 'fill': The element takes up the available height.
   * - 'fix': The height is fixed.
   */
  verticalSizing: 'auto' | 'fill' | 'fix';

  /**
   * Aligns the child element within its container.
   * - 'auto': Default alignment.
   * - 'start': Aligns the element at the start of the container.
   * - 'center': Centers the element within the container.
   * - 'end': Aligns the element at the end of the container.
   * - 'stretch': Stretches the element to fill the container.
   */
  alignSelf: 'auto' | 'start' | 'center' | 'end' | 'stretch';

  /**
   * Sets the horizontal margin of the child element.
   * This is the space on the left and right sides of the element.
   */
  horizontalMargin: number;

  /**
   * Sets the vertical margin of the child element.
   * This is the space on the top and bottom sides of the element.
   */
  verticalMargin: number;

  /**
   * Sets the top margin of the child element.
   * This is the space above the element.
   */
  topMargin: number;

  /**
   * Sets the right margin of the child element.
   * This is the space to the right of the element.
   */
  rightMargin: number;

  /**
   * Sets the bottom margin of the child element.
   * This is the space below the element.
   */
  bottomMargin: number;

  /**
   * Sets the left margin of the child element.
   * This is the space to the left of the element.
   */
  leftMargin: number;

  /**
   * Defines the maximum width of the child element.
   * If set to null, there is no maximum width constraint.
   */
  maxWidth: number | null;

  /**
   * Defines the maximum height of the child element.
   * If set to null, there is no maximum height constraint.
   */
  maxHeight: number | null;
  /**
   * Defines the minimum width of the child element.
   * If set to null, there is no minimum width constraint.
   */
  minWidth: number | null;

  /**
   * Defines the minimum height of the child element.
   * If set to null, there is no minimum height constraint.
   */
  minHeight: number | null;
}

/**
 * Properties for defining the layout of a cell in Penpot.
 */
export interface PenpotLayoutCellProperties {
  /**
   * The row index of the cell.
   * This value is optional and indicates the starting row of the cell.
   */
  row?: number;

  /**
   * The number of rows the cell should span.
   * This value is optional and determines the vertical span of the cell.
   */
  rowSpan?: number;

  /**
   * The column index of the cell.
   * This value is optional and indicates the starting column of the cell.
   */
  column?: number;

  /**
   * The number of columns the cell should span.
   * This value is optional and determines the horizontal span of the cell.
   */
  columnSpan?: number;

  /**
   * The name of the grid area that this cell belongs to.
   * This value is optional and can be used to define named grid areas.
   */
  areaName?: string;

  /**
   * The positioning mode of the cell.
   * This value can be 'auto', 'manual', or 'area' and determines how the cell is positioned within the layout.
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
   * The parent shape. If the shape is the first level the parent will be the root shape.
   * For the root shape the parent is null
   */
  readonly parent: PenpotShape | null;

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
  readonly width: number;

  /**
   * The height of the shape.
   */
  readonly height: number;

  /**
   * @return Returns the bounding box surrounding the current shape
   */
  readonly bounds: PenpotBounds;

  /**
   * @return Returns the geometric center of the shape
   */
  readonly center: PenpotPoint;

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
   * @return Returns the rotation in degrees of the shape with respect to it's center.
   */
  rotation: number;

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[] | 'mixed';

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

  /**
   * @return Returns true if the current shape is inside a component instance
   */
  isComponentInstance(): boolean;

  /**
   * @return Returns true if the current shape is inside a component **main** instance
   */
  isComponentMainInstance(): boolean;

  /**
   * @return Returns true if the current shape is inside a component **copy** instance
   */
  isComponentCopyInstance(): boolean;

  /**
   * @return Returns true when the current shape is inside a **nested* component instance
   */
  isComponentNestedInstance(): boolean;

  /**
   * @return Returns true when the current shape is the root of a component tree
   */
  isComponentRoot(): boolean;

  /**
   * @return Returns true when the current shape is the head of a components tree nested structure
   */
  isComponentHead(): boolean;

  /**
   * @return Returns the equivalent shape in the component main instance. If the current shape is inside a
   * main instance will return `null`;
   */
  componentRefShape(): PenpotShape | null;

  /**
   * @return Returns the root of the component tree structure for the current shape. If the current shape
   * is already a root will return itself.
   */
  componentRoot(): PenpotShape | null;

  /**
   * @return Returns the head of the component tree structure for the current shape. If the current shape
   * is already a head will return itself.
   */
  componentHead(): PenpotShape | null;

  /**
   * @return If the shape is a component instance, returns the reference to the component associated
   * otherwise will return null
   */
  component(): PenpotLibraryComponent | null;

  /**
   * If the current shape is a component it will remove the component information and leave the
   * shape as a "basic shape"
   */
  detach(): void;

  /**
   * Resizes the shape to the specified width and height.
   * @param width The new width of the shape.
   * @param height The new height of the shape.
   *
   * @example
   * ```js
   * shape.resize(200, 100);
   * ```
   */
  resize(width: number, height: number): void;

  /**
   * Rotates the shape in relation with the given center.
   * @param angle Angle in degrees to rotate.
   * @param center Center of the transform rotation. If not send will use the geometri center of the shapes.
   *
   * @example
   * ```js
   * shape.rotate(45);
   * ```
   */
  rotate(angle: number, center?: { x: number; y: number } | null): void;

  /**
   * Generates an export from the current shape.
   *
   * @example
   * ```js
   * shape.export({ type: 'png', scale: 2 });
   * ```
   */
  export(config: PenpotExport): Promise<Uint8Array>;

  /**
   * The interactions for the current shape.
   */
  readonly interactions: PenpotInteraction[];

  /**
   * Adds a new interaction to the shape.
   * @param trigger defines the conditions under which the action will be triggered
   * @param action defines what will be executed when the trigger happens
   * @param delay for the type of trigger `after-delay` will specify the time after triggered. Ignored otherwise.
   *
   * @example
   * ```js
   * shape.addInteraction('click', { type: 'navigate-to', destination: anotherFrame });
   * ```
   */
  addInteraction(
    trigger: PenpotTrigger,
    action: PenpotAction,
    delay?: number
  ): PenpotInteraction;

  /**
   * Removes the interaction from the shape.
   * @param interaction is the interaction to remove from the shape
   *
   * @example
   * ```js
   * shape.removeInteraction(interaction);
   * ```
   */
  removeInteraction(interaction: PenpotInteraction): void;

  /**
   * Creates a clone of the shape.
   * @return Returns a new instance of the shape with identical properties.
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

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];

  // Container Properties
  /**
   * The children shapes contained within the frame.
   */
  readonly children: PenpotShape[];
  /**
   * Appends a child shape to the frame.
   * @param child The child shape to append.
   *
   * @example
   * ```js
   * frame.appendChild(childShape);
   * ```
   */
  appendChild(child: PenpotShape): void;
  /**
   * Inserts a child shape at the specified index within the frame.
   * @param index The index at which to insert the child shape.
   * @param child The child shape to insert.
   *
   * @example
   * ```js
   * frame.insertChild(0, childShape);
   * ```
   */
  insertChild(index: number, child: PenpotShape): void;

  /**
   * Adds a flex layout configuration to the frame (so it's necessary to create a frame first of all).
   * @return Returns the flex layout configuration added to the frame.
   * @example
   * ```js
   * const frame = penpot.createFrame();
   * const flex = frame.addGridLayout();
   *
   * // You can change the flex properties as follows.
   * flex.dir = "column";
   * flex.wrap = "wrap";
   * flex.alignItems = "center";
   * lex.justifyContent = "center";
   * flex.horizontalSizing = "fill";
   * flex.verticalSizing = "fill";
   * ```
   */
  addFlexLayout(): PenpotFlexLayout;
  /**
   * Adds a grid layout configuration to the frame (so it's necessary to create a frame first of all). You can add rows and columns, check addRow/addColumn.
   * @return Returns the grid layout configuration added to the frame.
   * @example
   * ```js
   * const frame = penpot.createFrame();
   * const grid = frame.addGridLayout();
   *
   * // You can change the grid properties as follows.
   * grid.alignItems = "center";
   * grid.justifyItems = "start";
   * grid.rowGap = 10;
   * grid.columnGap = 10;
   * grid.verticalPadding = 5;
   * grid.horizontalPadding = 5;
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
   *
   * @example
   * ```js
   * group.appendChild(childShape);
   * ```
   */
  appendChild(child: PenpotShape): void;
  /**
   * Inserts a child shape at the specified index within the group.
   * @param index The index at which to insert the child shape.
   * @param child The child shape to insert.
   *
   * @example
   * ```js
   * group.insertChild(0, childShape);
   * ```
   */
  insertChild(index: number, child: PenpotShape): void;

  /**
   * Checks if the group is currently a mask.
   * A mask defines a clipping path for its child shapes.
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
   * @return Returns the path data (d attribute) as a string.
   */
  toD(): string;
  /**
   * The content of the boolean shape, defined as an array of path commands.
   */
  content: Array<PenpotPathCommand>;

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];

  // Container Properties
  /**
   * The children shapes contained within the boolean shape.
   */
  readonly children: PenpotShape[];
  /**
   * Appends a child shape to the boolean shape.
   * @param child The child shape to append.
   *
   * @example
   * ```js
   * boolShape.appendChild(childShape);
   * ```
   */
  appendChild(child: PenpotShape): void;
  /**
   * Inserts a child shape at the specified index within the boolean shape.
   * @param index The index at which to insert the child shape.
   * @param child The child shape to insert.
   *
   * @example
   * ```js
   * boolShape.insertChild(0, childShape);
   * ```
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

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];
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
   * @return Returns the path data (d attribute) as a string.
   */
  toD(): string;
  /**
   * The content of the path shape, defined as an array of path commands.
   */
  content: Array<PenpotPathCommand>;

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];
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
  fontStyle: 'normal' | 'italic' | 'mixed' | null;

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
  textTransform:
    | 'uppercase'
    | 'capitalize'
    | 'lowercase'
    | 'none'
    | 'mixed'
    | null;

  /**
   * The text decoration applied to the text range. It can be a specific text decoration or 'mixed' if multiple text decorations are used.
   */
  textDecoration: 'underline' | 'line-through' | 'none' | 'mixed' | null;

  /**
   * The text direction for the text range. It can be a specific direction or 'mixed' if multiple directions are used.
   */
  direction: 'ltr' | 'rtl' | 'mixed' | null;

  /**
   * The fill styles applied to the text range.
   */
  fills: PenpotFill[] | 'mixed';

  /**
   * The horizontal alignment of the text range. It can be a specific alignment or 'mixed' if multiple alignments are used.
   */
  align: 'left' | 'center' | 'right' | 'justify' | 'mixed' | null;

  /**
   * The vertical alignment of the text range. It can be a specific alignment or 'mixed' if multiple alignments are used.
   */
  verticalAlign: 'top' | 'center' | 'bottom' | 'mixed' | null;

  /**
   * Applies a typography style to the text range.
   * This method sets various typography properties for the text range according to the given typography style.
   * @param typography - The typography style to apply.
   *
   * @example
   * ```js
   * textRange.applyTypography(typography);
   * ```
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
  fontStyle: 'normal' | 'italic' | 'mixed' | null;

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
  textTransform: 'uppercase' | 'capitalize' | 'lowercase' | 'mixed' | null;

  /**
   * The text decoration applied to the text shape, or 'mixed' if multiple text decorations are used.
   */
  textDecoration: 'underline' | 'line-through' | 'mixed' | null;

  /**
   * The text direction for the text shape, or 'mixed' if multiple directions are used.
   */
  direction: 'ltr' | 'rtl' | 'mixed' | null;

  /**
   * The horizontal alignment of the text shape. It can be a specific alignment or 'mixed' if multiple alignments are used.
   */
  align: 'left' | 'center' | 'right' | 'justify' | 'mixed' | null;

  /**
   * The vertical alignment of the text shape. It can be a specific alignment or 'mixed' if multiple alignments are used.
   */
  verticalAlign: 'top' | 'center' | 'bottom' | null;

  /**
   * Gets a text range within the text shape.
   * @param start - The start index of the text range.
   * @param end - The end index of the text range.
   * @return Returns a PenpotTextRange object representing the specified text range.
   *
   * @example
   * ```js
   * const textRange = textShape.getRange(0, 10);
   * console.log(textRange.characters);
   * ```
   */
  getRange(start: number, end: number): PenpotTextRange;

  /**
   * Applies a typography style to the text shape.
   * @param typography - The typography style to apply.
   * @remarks
   * This method sets various typography properties for the text shape according to the given typography style.
   *
   * @example
   * ```js
   * textShape.applyTypography(typography);
   * ```
   */
  applyTypography(typography: PenpotLibraryTypography): void;
}

/**
 * Represents an ellipse shape in Penpot.
 * This interface extends `PenpotShapeBase` and includes properties specific to ellipses.
 */
export interface PenpotEllipse extends PenpotShapeBase {
  type: 'circle';

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];
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

  /**
   * The fills applied to the shape.
   */
  fills: PenpotFill[];
}

/**
 * PenpotPoint represents a point in 2D space, typically with x and y coordinates.
 */
export type PenpotPoint = { x: number; y: number };

/**
 * PenpotBounds represents the boundaries of a rectangular area,
 * defined by the coordinates of the top-left corner and the dimensions of the rectangle.
 *
 * @example
 * ```js
 * const bounds = { x: 50, y: 50, width: 200, height: 100 };
 * console.log(bounds);
 * ```
 */
export type PenpotBounds = {
  /**
   * Top-left x position of the rectangular area defined
   */
  x: number;
  /**
   * Top-left y position of the rectangular area defined
   */
  y: number;
  /**
   * Width of the represented area
   */
  width: number;
  /**
   * Height of the represented area
   */
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
 *
 * @example
 * ```js
 * let shape: PenpotShape;
 * if (penpot.utils.types.isRectangle(shape)) {
 *   console.log(shape.type);
 * }
 * ```
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
 *
 * @example
 * ```js
 * penpot.on('pagechange', (event) => {
 *   console.log(event);
 * });
 * ```
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

  /**
   * This event will triger whenever the shape in the props change. It's mandatory to send
   * with the props an object like `{ shapeId: '<id>' }`
   */
  shapechange: PenpotShape;

  /**
   * The `contentsave` event will trigger when the content file changes.
   */
  contentsave: void;
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
   * @return Returns a `PenpotFill` object representing the color as a fill.
   *
   * @example
   * ```js
   * const fill = libraryColor.asFill();
   * ```
   */
  asFill(): PenpotFill;
  /**
   * Converts the library color into a stroke object.
   * @return Returns a `PenpotStroke` object representing the color as a stroke.
   *
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
  fontStyle?: 'normal' | 'italic' | null;

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
  textTransform?: 'uppercase' | 'capitalize' | 'lowercase' | null;

  /**
   * Applies the typography styles to a text shape.
   * @param shape The text shape to apply the typography styles to.
   *
   * @example
   * ```js
   * typographyElement.applyToText(textShape);
   * ```
   */
  applyToText(shape: PenpotShape): void;

  /**
   * Applies the typography styles to a range of text within a text shape.
   * @param range Represents a range of text within a PenpotText shape. This interface provides properties for styling and formatting text ranges.
   *
   * @example
   * ```js
   * typographyElement.applyToTextRange(textShape);
   * ```
   */
  applyToTextRange(range: PenpotTextRange): void;

  /**
   * Sets the font and optionally its variant for the typography element.
   * @param font - The font to set.
   * @param variant - The font variant to set (optional).
   *
   * @example
   * ```js
   * typographyElement.setFont(newFont, newVariant);
   * ```
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
   * @return Returns a `PenpotShape` object representing the instance of the component.
   *
   * @example
   * ```js
   * const componentInstance = libraryComponent.instance();
   * ```
   */
  instance(): PenpotShape;

  /**
   * @return Returns the reference to the main component shape.
   */
  mainInstance(): PenpotShape;
}

/**
 * Represents a summary of a Penpot library.
 * This interface provides properties for summarizing various aspects of a Penpot library.
 */
export interface PenpotLibrarySummary {
  /**
   * The unique identifier of the library.
   */
  readonly id: string;

  /**
   * The name of the library.
   */
  readonly name: string;

  /**
   * The number of colors in the library.
   */
  readonly numColors: number;

  /**
   * The number of components in the library.
   */
  readonly numComponents: number;

  /**
   * The number of typographies in the library.
   */
  readonly numTypographies: number;
}

/**
 * Represents a library in Penpot, containing colors, typographies, and components.
 */
export interface PenpotLibrary extends PenpotPluginData {
  /**
   * The unique identifier of the library.
   */
  readonly id: string;

  /**
   * The name of the library.
   */
  readonly name: string;

  /**
   * An array of color elements in the library.
   * @example
   * ```js
   * console.log(penpot.library.local.colors);
   * ```
   */
  colors: PenpotLibraryColor[];

  /**
   * An array of typography elements in the library.
   */
  typographies: PenpotLibraryTypography[];

  /**
   * An array of component elements in the library.
   * @example
   * ```js
   * console.log(penpot.library.local.components);
   */
  components: PenpotLibraryComponent[];

  /**
   * Creates a new color element in the library.
   * @return Returns a new `PenpotLibraryColor` object representing the created color element.
   *
   * @example
   * ```js
   * const newColor = penpot.library.local.createColor();
   * console.log(newColor);
   * ```
   */
  createColor(): PenpotLibraryColor;

  /**
   * Creates a new typography element in the library.
   * @return Returns a new `PenpotLibraryTypography` object representing the created typography element.
   *
   * @example
   * ```js
   * const newTypography = library.createTypography();
   * ```
   */
  createTypography(): PenpotLibraryTypography;

  /**
   * Creates a new component element in the library using the provided shapes.
   * @param shapes An array of `PenpotShape` objects representing the shapes to be included in the component.
   * @return Returns a new `PenpotLibraryComponent` object representing the created component element.
   *
   * @example
   * ```js
   * const newComponent = penpot.library.local.createComponent([shape1, shape2]);
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
   *
   * @example
   * ```js
   * const localLibrary = libraryContext.local;
   * ```
   */
  readonly local: PenpotLibrary;

  /**
   * An array of connected libraries in the Penpot context.
   *
   * @example
   * ```js
   * const connectedLibraries = libraryContext.connected;
   * ```
   */
  readonly connected: PenpotLibrary[];

  /**
   * Retrieves a summary of available libraries that can be connected to.
   * @return Returns a promise that resolves to an array of `PenpotLibrarySummary` objects representing available libraries.
   *
   * @example
   * ```js
   * const availableLibraries = await libraryContext.availableLibraries();
   * ```
   */
  availableLibraries(): Promise<PenpotLibrarySummary[]>;

  /**
   * Connects to a specific library identified by its ID.
   * @return Returns a promise that resolves to the `PenpotLibrary` object representing the connected library.
   * @param libraryId - The ID of the library to connect to.
   *
   * @example
   * ```js
   * const connectedLibrary = await libraryContext.connectLibrary('library-id');
   * ```
   */
  connectLibrary(libraryId: string): Promise<PenpotLibrary>;
};

/**
 * Represents a font variant in Penpot, which defines a specific style variation of a font.
 * This interface provides properties for describing the characteristics of a font variant.
 */
export interface PenpotFontVariant {
  /**
   * The name of the font variant.
   */
  name: string;

  /**
   * The unique identifier of the font variant.
   */
  fontVariantId: string;

  /**
   * The font weight of the font variant.
   */
  fontWeight: string;

  /**
   * The font style of the font variant.
   */
  fontStyle: 'normal' | 'italic';
}

/**
 * Represents a font in Penpot, which includes details about the font family, variants, and styling options.
 * This interface provides properties and methods for describing and applying fonts within Penpot.
 */
export interface PenpotFont {
  /**
   * This property holds the human-readable name of the font.
   */
  name: string;

  /**
   * The unique identifier of the font.
   */
  fontId: string;

  /**
   * The font family of the font.
   */
  fontFamily: string;

  /**
   * The default font style of the font.
   */
  fontStyle?: 'normal' | 'italic' | null;

  /**
   * The default font variant ID of the font.
   */
  fontVariantId: string;

  /**
   * The default font weight of the font.
   */
  fontWeight: string;

  /**
   * An array of font variants available for the font.
   */
  variants: PenpotFontVariant[];

  /**
   * Applies the font styles to a text shape.
   * @param text - The text shape to apply the font styles to.
   * @param variant - Optional. The specific font variant to apply. If not provided, applies the default variant.
   *
   * @example
   * ```js
   * font.applyToText(textShape, fontVariant);
   * ```
   */
  applyToText(text: PenpotText, variant?: PenpotFontVariant): void;

  /**
   * Applies the font styles to a text range within a text shape.
   * @param range - The text range to apply the font styles to.
   * @param variant - Optional. The specific font variant to apply. If not provided, applies the default variant.
   *
   * @example
   * ```js
   * font.applyToRange(textRange, fontVariant);
   * ```
   */
  applyToRange(range: PenpotTextRange, variant?: PenpotFontVariant): void;
}

/**
 * Represents the context for managing fonts in Penpot.
 * This interface provides methods to interact with fonts, such as retrieving fonts by ID or name.
 */
export interface PenpotFontsContext {
  /**
   * An array containing all available fonts.
   */
  all: PenpotFont[];

  /**
   * Finds a font by its unique identifier.
   * @param id - The ID of the font to find.
   * @return Returns the `PenpotFont` object if found, otherwise `null`.
   *
   * @example
   * ```js
   * const font = fontsContext.findById('font-id');
   * if (font) {
   *   console.log(font.name);
   * }
   * ```
   */
  findById(id: string): PenpotFont | null;

  /**
   * Finds a font by its name.
   * @param name - The name of the font to find.
   * @return Returns the `PenpotFont` object if found, otherwise `null`.
   *
   * @example
   * ```js
   * const font = fontsContext.findByName('font-name');
   * if (font) {
   *   console.log(font.name);
   * }
   * ```
   */
  findByName(name: string): PenpotFont | null;

  /**
   * Finds all fonts matching a specific ID.
   * @param id - The ID to match against.
   * @return Returns an array of `PenpotFont` objects matching the provided ID.
   *
   * @example
   * ```js
   * const fonts = fontsContext.findAllById('font-id');
   * console.log(fonts);
   * ```
   */
  findAllById(id: string): PenpotFont[];

  /**
   * Finds all fonts matching a specific name.
   * @param name - The name to match against.
   * @return Returns an array of `PenpotFont` objects matching the provided name.
   *
   * @example
   * ```js
   * const fonts = fontsContext.findAllByName('font-name');
   * console.log(fonts);
   * ```
   */
  findAllByName(name: string): PenpotFont[];
}

/**
 * Represents a user in Penpot.
 */
export interface PenpotUser {
  /**
   * The unique identifier of the user.
   *
   * @example
   * ```js
   * const userId = user.id;
   * console.log(userId);
   * ```
   */
  readonly id: string;

  /**
   * The name of the user.
   *
   * @example
   * ```js
   * const userName = user.name;
   * console.log(userName);
   * ```
   */
  readonly name?: string;

  /**
   * The URL of the user's avatar image.
   *
   * @example
   * ```js
   * const avatarUrl = user.avatarUrl;
   * console.log(avatarUrl);
   * ```
   */
  readonly avatarUrl?: string;

  /**
   * The color associated with the user.
   *
   * @example
   * ```js
   * const userColor = user.color;
   * console.log(userColor);
   * ```
   */
  readonly color: string;

  /**
   * The session ID of the user.
   *
   * @example
   * ```js
   * const sessionId = user.sessionId;
   * console.log(sessionId);
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
   *
   * @example
   * ```js
   * const userPosition = activeUser.position;
   * console.log(userPosition);
   * ```
   */
  position?: { x: number; y: number };
  /**
   * The zoom level of the active user.
   *
   * @example
   * ```js
   * const userZoom = activeUser.zoom;
   * console.log(userZoom);
   * ```
   */
  readonly zoom?: number;
}

/**
 * Represents the context of Penpot, providing access to various Penpot functionalities and data.
 */
export interface PenpotContext {
  /**
   * The root shape in the current Penpot context. Requires `content:read` permission.
   *
   * @example
   * ```js
   * const rootShape = context.root;
   * console.log(rootShape);
   * ```
   */
  readonly root: PenpotShape;
  /**
   * The current page in the Penpot context. Requires `content:read` permission.
   *
   * @example
   * ```js
   * const currentPage = context.currentPage;
   * console.log(currentPage);
   * ```
   */
  readonly currentPage: PenpotPage;
  /**
   * The viewport settings in the Penpot context.
   *
   * @example
   * ```js
   * const viewportSettings = context.viewport;
   * console.log(viewportSettings);
   * ```
   */
  readonly viewport: PenpotViewport;

  /**
   * Context encapsulating the history operations
   *
   * @example
   * ```js
   * const historyContext = context.history;
   * console.log(historyContext);
   * ```
   */
  readonly history: PenpotHistoryContext;

  /**
   * The library context in the Penpot context, including both local and connected libraries. Requires `library:read` permission.
   *
   * @example
   * ```js
   * const libraryContext = context.library;
   * console.log(libraryContext);
   * ```
   */
  readonly library: PenpotLibraryContext;
  /**
   * The fonts context in the Penpot context, providing methods to manage fonts. Requires `content:read` permission.
   *
   * @example
   * ```js
   * const fontsContext = context.fonts;
   * console.log(fontsContext);
   * ```
   */
  readonly fonts: PenpotFontsContext;
  /**
   * The current user in the Penpot context. Requires `user:read` permission.
   *
   * @example
   * ```js
   * const currentUser = context.currentUser;
   * console.log(currentUser);
   * ```
   */
  readonly currentUser: PenpotUser;
  /**
   * An array of active users in the Penpot context. Requires `user:read` permission.
   *
   * @example
   * ```js
   * const activeUsers = context.activeUsers;
   * console.log(activeUsers);
   * ```
   */
  readonly activeUsers: PenpotActiveUser[];

  /**
   * The currently selected shapes in Penpot. Requires `content:read` permission.
   *
   * @example
   * ```js
   * const selectedShapes = context.selection;
   * console.log(selectedShapes);
   * ```
   */
  selection: PenpotShape[];

  /**
   * Retrieves file data from the current Penpot context. Requires `content:read` permission.
   * @return Returns the file data or `null` if no file is available.
   *
   * @example
   * ```js
   * const fileData = context.getFile();
   * console.log(fileData);
   * ```
   */
  getFile(): PenpotFile | null;
  /**
   * Retrieves page data from the current Penpot context. Requires `content:read` permission.
   * @return Returns the page data or `null` if no page is available.
   *
   * @example
   * ```js
   * const pageData = context.getPage();
   * console.log(pageData);
   * ```
   */
  getPage(): PenpotPage | null;
  /**
   * Retrieves the IDs of the currently selected elements in Penpot. Requires `content:read` permission.
   * @return Returns an array of IDs representing the selected elements.
   *
   * @example
   * ```js
   * const selectedIds = context.getSelected();
   * console.log(selectedIds);
   * ```
   */
  getSelected(): string[];
  /**
   * Retrieves the shapes of the currently selected elements in Penpot. Requires `content:read` permission.
   * @return Returns an array of shapes representing the selected elements.
   *
   * @example
   * ```js
   * const selectedShapes = context.getSelectedShapes();
   * console.log(selectedShapes);
   * ```
   */
  getSelectedShapes(): PenpotShape[];

  /**
   * Retrieves colors applied to the given shapes in Penpot. Requires `content:read` permission.
   * @return Returns an array of colors and their shape information.
   *
   * @example
   * ```js
   * const colors = context.shapesColors(shapes);
   * console.log(colors);
   * ```
   */
  shapesColors(shapes: PenpotShape[]): (PenpotColor & PenpotColorShapeInfo)[];

  /**
   * Replaces a specified old color with a new color in the given shapes. Requires `content:write` permission.
   *
   * @example
   * ```js
   * context.replaceColor(shapes, oldColor, newColor);
   * ```
   */
  replaceColor(
    shapes: PenpotShape[],
    oldColor: PenpotColor,
    newColor: PenpotColor
  ): void;

  /**
   * Retrieves the current theme (light or dark) in Penpot.
   * @return Returns the current theme.
   *
   * @example
   * ```js
   * const currentTheme = context.getTheme();
   * console.log(currentTheme);
   * ```
   */
  getTheme(): PenpotTheme;

  /**
   * Uploads media to Penpot and retrieves its image data. Requires `content:write` permission.
   * @param name The name of the media.
   * @param url The URL of the media to be uploaded.
   * @return Returns a promise that resolves to the image data of the uploaded media.
   *
   * @example
   * ```js
   * const imageData = await context.uploadMediaUrl('example', 'https://example.com/image.jpg');
   * console.log(imageData);
   *
   * // to insert the image in a shape we can do
   * const frame = penpot.createFrame();
   * const shape = penpot.createRectangle();
   * frame.appendChild(shape);
   * shape.fills = [{ fillOpacity: 1, fillImage: imageData }];
   * ```
   */
  uploadMediaUrl(name: string, url: string): Promise<PenpotImageData>;

  /**
   * Uploads media to penpot and retrieves the image data. Requires `content:write` permission.
   * @param name The name of the media.
   * @param data The image content data
   * @return Returns a promise that resolves to the image data of the uploaded media.
   *
   * @example
   * ```js
   * const imageData = await context.uploadMediaData('example', imageData, 'image/jpeg');
   * console.log(imageData);
   * ```
   */
  uploadMediaData(
    name: string,
    data: Uint8Array,
    mimeType: string
  ): Promise<PenpotImageData>;

  /**
   * Groups the specified shapes. Requires `content:write` permission.
   * @param shapes - An array of shapes to group.
   * @return Returns the newly created group or `null` if the group could not be created.
   * @example
   * ```js
   * const penpotShapesArray = penpot.selection;
   * penpot.group(penpotShapesArray);
   * ```
   */
  group(shapes: PenpotShape[]): PenpotGroup | null;
  /**
   * Ungroups the specified group. Requires `content:write` permission.
   * @param group - The group to ungroup.
   * @param other - Additional groups to ungroup.
   *
   * @example
   * ```js
   * const penpotShapesArray = penpot.selection;
   * // We need to make sure that something is selected, and if the selected shape is a group,
   * if (selected.length && penpot.utils.types.isGroup(penpotShapesArray[0])) {
   *   penpot.group(penpotShapesArray[0]);
   * }
   * ```
   */
  ungroup(group: PenpotGroup, ...other: PenpotGroup[]): void;

  /**
   * Use this method to create the shape of a rectangle. Requires `content:write` permission.
   *
   * @example
   * ```js
   * const shape = penpot.createRectangle();
   * // just change the values like this
   * shape.name = "Example rectangle";
   *
   * // for solid color
   * shape.fills = [{ fillColor: "#7EFFF5" }];
   * // for linear gradient color
   * shape.fills = [{
   *  fillColorGradient: {
   *    "type": "linear",
   *    "startX": 0.5,
   *    "startY": 0,
   *    "endX": 0.5,
   *    "endY": 1,
   *    "width": 1,
   *    "stops": [
   *      {
   *        "color": "#003ae9",
   *        "opacity": 1,
   *        "offset": 0
   *      },
   *      {
   *        "color": "#003ae9",
   *        "opacity": 0,
   *        "offset": 1
   *      }
   *    ]
   *  }
   *}];
   * // for a image fill
   * const imageData = await context.uploadMediaUrl('example', 'https://example.com/image.jpg');
   * shape.fills = [{ fillOpacity: 1, fillImage: imageData }];
   *
   * shape.borderRadius = 8;
   * shape.strokes = [
   *  {
   *    strokeColor: "#2e3434",
   *    strokeStyle: "solid",
   *    strokeWidth: 2,
   *    strokeAlignment: "center",
   *  },
   *];
   * ```
   */
  createRectangle(): PenpotRectangle;
  /**
   * Use this method to create a frame. This is the first step before anything else, the container. Requires `content:write` permission.
   * Then you can add a gridlayout, flexlayout or add a shape inside the frame.
   * Just a heads-up: frame is a board in Penpot UI.
   *
   * @example
   * ```js
   * const frame = penpot.createFrame();
   *
   * // to add grid layout
   * frame.addGridLayout();
   * // to add flex layout
   * frame.addFlexLayout();
   *
   * // to create a shape inside the frame
   * const shape = penpot.createRectangle();
   * frame.appendChild(shape);
   * ```
   */
  createFrame(): PenpotFrame;
  /**
   * Use this method to create the shape of a ellipse. Requires `content:write` permission.
   *
   * @example
   * ```js
   * const shape = penpot.createEllipse();
   * // just change the values like this
   * shape.name = "Example ellipse";
   * 
   * // for solid color
   * shape.fills = [{ fillColor: "#7EFFF5" }];
   * // for linear gradient color
   * shape.fills = [{
   *  fillColorGradient: {
   *    "type": "linear",
   *    "startX": 0.5,
   *    "startY": 0,
   *    "endX": 0.5,
   *    "endY": 1,
   *    "width": 1,
   *    "stops": [
   *      {
   *        "color": "#003ae9",
   *        "opacity": 1,
   *        "offset": 0
   *      },
   *      {
   *        "color": "#003ae9",
   *        "opacity": 0,
   *        "offset": 1
   *      }
   *    ]
   *  }
   *}];
   * // for a image fill
   * const imageData = await context.uploadMediaUrl('example', 'https://example.com/image.jpg');
   * shape.fills = [{ fillOpacity: 1, fillImage: imageData }];
   *
   * shape.strokes = [
   *  {
   *    strokeColor: "#2e3434",
   *    strokeStyle: "solid",
   *    strokeWidth: 2,
   *    strokeAlignment: "center",
   *  },
   *];
   * ```
   */
  createEllipse(): PenpotEllipse;
  /**
   * Use this method to create a path. Requires `content:write` permission.
   *
   * @example
   * ```js
   * const path = penpot.createPath();
   * path.name = "My path";
   *
   * // for solid color
   * path.fills = [{ fillColor: "#7EFFF5" }];
   *
   * ```
   */
  createPath(): PenpotPath;
  /**
   * Creates a PenpotBoolean shape based on the specified boolean operation and shapes. Requires `content:write` permission.
   * @param boolType The type of boolean operation ('union', 'difference', 'exclude', 'intersection').
   * @param shapes An array of shapes to perform the boolean operation on.
   * @return Returns the newly created PenpotBoolean shape resulting from the boolean operation.
   *
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
   * Creates a PenpotGroup from an SVG string. Requires `content:write` permission.
   * @param svgString The SVG string representing the shapes to be converted into a group.
   * @return Returns the newly created PenpotGroup containing the shapes from the SVG.
   *
   * @example
   * ```js
   * const svgGroup = context.createShapeFromSvg('<svg>...</svg>');
   * ```
   */
  createShapeFromSvg(svgString: string): PenpotGroup | null;
  /**
   * Creates a PenpotText shape with the specified text content. Requires `content:write` permission.
   * @param text The text content for the PenpotText shape.
   * @return Returns the new created shape, if the shape wasn't created can return null.
   *
   * @example
   * ```js
   * const board = penpot.createFrame();
   * let text;
   * text = penpot.createText();
   * // just change the values like this
   * text.growType = 'auto-height';
   * text.fontFamily = 'Work Sans';
   * text.fontSize = '12';
   * text.fills = [{fillColor: '#9f05ff', fillOpacity: 1}];
   * text.strokes = [{strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 2, strokeColor: '#deabff', strokeAlignment: 'outer'}];
   * board.appendChild(text);
   * ```
   */
  createText(text: string): PenpotText | null;

  /**
   * Generates markup for the given shapes. Requires `content:read` permission
   * @param shapes
   * @param options
   *
   * @example
   * ```js
   * const markup = context.generateMarkup(shapes, { type: 'html' });
   * console.log(markup);
   * ```
   */
  generateMarkup(
    shapes: PenpotShape[],
    options?: { type?: 'html' | 'svg' }
  ): string;

  /**
   * Generates styles for the given shapes. Requires `content:read` permission
   * @param shapes
   * @param options
   *
   * @example
   * ```js
   * const styles = context.generateStyle(shapes, { type: 'css' });
   * console.log(styles);
   * ```
   */
  generateStyle(
    shapes: PenpotShape[],
    options?: {
      type?: 'css';
      withPrelude?: boolean;
      includeChildren?: boolean;
    }
  ): string;

  /**
   * Adds the current callback as an event listener
   *
   * @example
   * ```js
   * const listenerId = context.addListener('selectionchange', (event) => {
   *   console.log(event);
   * });
   * ```
   */
  addListener<T extends keyof EventsMap>(
    type: T,
    callback: (event: EventsMap[T]) => void,
    props?: { [key: string]: unknown }
  ): symbol;

  /**
   * Removes the listenerId from the list of listeners
   *
   * @example
   * ```js
   * context.removeListener(listenerId);
   * ```
   */
  removeListener(listenerId: symbol): void;

  /**
   * Opens the viewer section. Requires `content:read` permission.
   */
  openViewer(): void;

  /**
   * Creates a new page. Requires `content:write` permission.
   */
  createPage(): PenpotPage;

  /**
   * Changes the current open page to given page. Requires `content:read` permission.
   * @param page the page to open
   *
   * @example
   * ```js
   * context.openPage(page);
   * ```
   */
  openPage(page: PenpotPage): void;
}

/**
 * Defines an interaction flow inside penpot. A flow is defined by a starting board for an interaction.
 */
export interface PenpotFlow {
  /**
   * The page in which the flow is defined
   */
  readonly page: PenpotPage;

  /**
   * The name for the current flow
   */
  name: string;

  /**
   * The starting frame for this interaction flow
   */
  startingFrame: PenpotFrame;

  /**
   * Remvoes the flow from the page
   */
  remove(): void;
}

/**
 * Penpot allows you to prototype interactions by connecting boards, which can act as screens.
 */
export interface PenpotInteraction {
  /**
   * The shape that owns the interaction
   */
  readonly shape?: PenpotShape;

  /**
   * The user action that will start the interaction.
   */
  trigger: PenpotTrigger;

  /**
   * Time in **milliseconds** after the action will happen. Only applies to `after-delay` triggers.
   */
  delay?: number | null;

  /**
   * The action that will execute after the trigger happens.
   */
  action: PenpotAction;

  /**
   * Removes the interaction
   */
  remove(): void;
}

/**
 * Types of triggers defined:
 * - `click` triggers when the user uses the mouse to click on a shape
 * - `mouse-enter` triggers when the user moves the mouse inside the shape (even if no mouse button is pressed)
 * - `mouse-leave` triggers when the user moves the mouse outside the shape.
 * - `after-delay` triggers after the `delay` time has passed even if no interaction from the user happens.
 */
export type PenpotTrigger =
  | 'click'
  | 'mouse-enter'
  | 'mouse-leave'
  | 'after-delay';

/**
 * It takes the user from one board to the destination set in the interaction.
 */
export interface PenpotNavigateTo {
  /**
   * Type of action
   */
  readonly type: 'navigate-to';

  /**
   * Board to which the action targets
   */
  readonly destination: PenpotFrame;

  /**
   * When true the scroll will be preserved.
   */
  readonly preserveScrollPosition?: boolean;

  /**
   * Animation displayed with this interaction.
   */
  readonly animation?: PenpotAnimation;
}

/**
 * Base type for the actions "open-overlay" and "toggle-overlay" that share most of their properties
 */
export interface PenpotOverlayAction {
  /**
   * Overlay board that will be openned.
   */
  readonly destination: PenpotFrame;

  /**
   * Base shape to which the overlay will be positioned taking constraints into account.
   */
  readonly relativeTo?: PenpotShape;

  /**
   * Positioning of the overlay.
   */
  readonly position?:
    | 'manual'
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center';

  /**
   * For `position = 'manual'` the location of the overlay.
   */
  readonly manualPositionLocation?: PenpotPoint;

  /**
   * When true the overlay will be closed when clicking outside
   */
  readonly closeWhenClickOutside?: boolean;

  /**
   * When true a background will be added to the overlay.
   */
  readonly addBackgroundOverlay?: boolean;

  /**
   * Animation displayed with this interaction.
   */
  readonly animation?: PenpotAnimation;
}

/**
 * It opens a board right over the current board.
 */
export interface PenpotOpenOverlay extends PenpotOverlayAction {
  /**
   * The action type
   */
  readonly type: 'open-overlay';
}

/**
 * It opens an overlay if it is not already opened or closes it if it is already opened.
 */
export interface PenpotToggleOverlay extends PenpotOverlayAction {
  /**
   * The action type
   */
  readonly type: 'toggle-overlay';
}

/**
 * This action will close a targeted board that is opened as an overlay.
 */
export interface PenpotCloseOverlay {
  /**
   * The action type
   */
  readonly type: 'close-overlay';

  /**
   * The overlay to be closed with this action.
   */
  readonly destination?: PenpotFrame;

  /**
   * Animation displayed with this interaction.
   */
  readonly animation: PenpotAnimation;
}

/**
 * It takes back to the last board shown.
 */
export interface PenpotPreviousScreen {
  /**
   * The action type
   */
  readonly type: 'previous-screen';
}

/**
 * This action opens an URL in a new tab.
 */
export interface PenpotOpenUrl {
  /**
   * The action type
   */
  readonly type: 'open-url';
  /**
   * The URL to open when the action is executed
   */
  readonly url: string;
}

/**
 * Type for all the possible types of actions in an interaction.
 */
export type PenpotAction =
  | PenpotNavigateTo
  | PenpotOpenOverlay
  | PenpotToggleOverlay
  | PenpotCloseOverlay
  | PenpotPreviousScreen
  | PenpotOpenUrl;

/**
 * Dissolve animation
 */
export interface PenpotDissolve {
  /**
   * Type of the animation
   */
  readonly type: 'dissolve';

  /**
   * Duration of the animation effect
   */
  readonly duration: number;

  /**
   * Function that the dissolve effect will follow for the interpolation.
   * Defaults to `linear`
   */
  readonly easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Slide animation
 */
export interface PenpotSlide {
  /**
   * Type of the animation.
   */
  readonly type: 'slide';

  /**
   * Indicate if the slide will be either in-to-out `in` or out-to-in `out`.
   */
  readonly way: 'in' | 'out';

  /**
   * Direction for the slide animaton.
   */
  readonly direction: 'right' | 'left' | 'up' | 'down';

  /**
   * Duration of the animation effect.
   */
  readonly duration: number;

  /**
   * If `true` the offset effect will be used.
   */
  readonly offsetEffect?: boolean;

  /**
   * Function that the dissolve effect will follow for the interpolation.
   * Defaults to `linear`
   */
  readonly easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Push animation
 */
export interface PenpotPush {
  /**
   * Type of the animation
   */
  readonly type: 'push';

  /**
   * Direction for the push animaton
   */
  readonly direction: 'right' | 'left' | 'up' | 'down';

  /**
   * Duration of the animation effect
   */
  readonly duration: number;

  /**
   * Function that the dissolve effect will follow for the interpolation.
   * Defaults to `linear`
   */
  readonly easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Type of all the animations that can be added to an interaction.
 */
export type PenpotAnimation = PenpotDissolve | PenpotSlide | PenpotPush;

/**
 * This object allows to access to some history functions
 */
export interface PenpotHistoryContext {
  /**
   * Starts an undo block. All operations done inside this block will be undone together until
   * a call to `undoBlockFinish` is called.
   * @returns the block identifier
   */
  undoBlockBegin(): Symbol;

  /**
   * Ends the undo block started with `undoBlockBegin`
   * @param blockId is the id returned by `undoBlockBegin`
   *
   * @example
   * ```js
   * historyContext.undoBlockFinish(blockId);
   * ```
   */
  undoBlockFinish(blockId: Symbol): void;
}

/**
 * Utility methods for geometric calculations in Penpot.
 *
 * @example
 * ```js
 * const centerPoint = geometryUtils.center(shapes);
 * console.log(centerPoint);
 * ```
 */
export interface PenpotContextGeometryUtils {
  /**
   * Calculates the center point of a given array of shapes.
   * This method computes the geometric center (centroid) of the bounding boxes of the provided shapes.
   * @param shapes - The array of shapes to calculate the center for.
   * @return Returns the center point as an object with `x` and `y` coordinates, or null if the array is empty.
   *
   * @example
   * ```js
   * const centerPoint = geometryUtils.center(shapes);
   * console.log(centerPoint);
   * ```
   */
  center(shapes: PenpotShape[]): { x: number; y: number } | null;
}

/**
 * Utility methods for determining the types of Penpot shapes.
 *
 * @example
 * ```js
 * const isFrame = typesUtils.isFrame(shape);
 * console.log(isFrame);
 * ```
 */
export interface PenpotContextTypesUtils {
  /**
   * Checks if the given shape is a frame.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotFrame, otherwise false.
   */
  isFrame(shape: PenpotShape): shape is PenpotFrame;

  /**
   * Checks if the given shape is a group.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotGroup, otherwise false.
   */
  isGroup(shape: PenpotShape): shape is PenpotGroup;

  /**
   * Checks if the given shape is a mask.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotGroup (acting as a mask), otherwise false.
   */
  isMask(shape: PenpotShape): shape is PenpotGroup;

  /**
   * Checks if the given shape is a boolean operation.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotBool, otherwise false.
   */
  isBool(shape: PenpotShape): shape is PenpotBool;

  /**
   * Checks if the given shape is a rectangle.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotRectangle, otherwise false.
   */
  isRectangle(shape: PenpotShape): shape is PenpotRectangle;

  /**
   * Checks if the given shape is a path.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotPath, otherwise false.
   */
  isPath(shape: PenpotShape): shape is PenpotPath;

  /**
   * Checks if the given shape is a text element.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotText, otherwise false.
   */
  isText(shape: PenpotShape): shape is PenpotText;

  /**
   * Checks if the given shape is an ellipse.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotEllipse, otherwise false.
   */
  isEllipse(shape: PenpotShape): shape is PenpotEllipse;

  /**
   * Checks if the given shape is an SVG.
   * @param shape - The shape to check.
   * @return Returns true if the shape is a PenpotSvgRaw, otherwise false.
   */
  isSVG(shape: PenpotShape): shape is PenpotSvgRaw;
}

/**
 * Utility methods for various operations in Penpot.
 */
export interface PenpotContextUtils {
  /**
   * Geometry utility methods for Penpot.
   * Provides methods for geometric calculations, such as finding the center of a group of shapes.
   *
   * @example
   * ```js
   * const centerPoint = penpot.utils.geometry.center(shapes);
   * console.log(centerPoint);
   * ```
   */
  readonly geometry: PenpotContextGeometryUtils;
  /**
   * Type utility methods for Penpot.
   * Provides methods for determining the types of various shapes in Penpot.
   *
   * @example
   * ```js
   * const isFrame = utils.types.isFrame(shape);
   * console.log(isFrame);
   * ```
   */
  readonly types: PenpotContextTypesUtils;
}

declare global {
  const penpot: Penpot;
}
