export interface Selection extends CljValues {
  linked_map: SelLinkedMap;
}

export interface SelLinkedMap extends CljValues {
  head: SelUuid | null;
  delegate_map: SelDelegateMap;
}

export interface SelDelegateMap extends CljValues, UnderscoreValues, NilValues {
  meta: unknown;
  cnt: number;
  root: SelRoot | null;
}

export interface SelRoot extends CljValues {
  edit: unknown;
  bitmap: number;
  arr: SelArr[];
}

export interface SelArr extends UnderscoreValues, CljValues {
  uuid?: string;
  value: unknown;
  left?: SelUuid;
  right?: SelUuid;
}

export interface SelUuid extends CljValues, UnderscoreValues {
  uuid: string;
}

export interface CljValues {
  cljs$lang$protocol_mask$partition0$: number;
  cljs$lang$protocol_mask$partition1$: number;
}

export interface UnderscoreValues {
  __meta?: null | number;
  __extmap?: null | number;
  __hash: null | number;
}

export interface NilValues {
  nil_val: null | boolean;
  has_nil_QMARK_: null | boolean;
}
