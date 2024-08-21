import { EventsMap } from '@penpot/plugin-types';

export type RegisterListener = <K extends keyof EventsMap>(
  type: K,
  event: (arg: EventsMap[K]) => void,
  props?: { [key: string]: unknown }
) => symbol;

export type DestroyListener = <K extends keyof EventsMap>(
  id: symbol | K,
  event?: (arg: EventsMap[K]) => void
) => void;
