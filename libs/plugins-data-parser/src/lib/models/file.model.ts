import { Data, ParsedData } from '.';

export type FileDataType =
  | 'colors'
  | 'typographies'
  | 'pages'
  | 'media'
  | 'pagesIndex'
  | 'components';

export interface ParsedFile extends Omit<ParsedData, 'data'> {
  data: Pick<Data, FileDataType>;
}
