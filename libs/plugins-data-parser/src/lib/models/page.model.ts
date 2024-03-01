import { Data, ParsedData } from '.';

export type PageDataType = 'options' | 'objects' | 'name' | 'id';

export interface ParsedPage extends Omit<ParsedData, 'data'> {
  data: Pick<Data, PageDataType>;
}
