import { LibraryColor } from '@penpot/plugin-types';
import { TokenStructure } from '../../model';

export function transformToToken(colors: LibraryColor[]) {
  const result: TokenStructure = {};

  colors.forEach((data) => {
    const currentOpacity = data.opacity ?? 1;
    const opacity = currentOpacity < 1 ? Math.floor(currentOpacity * 100) : '';
    const value = `${data.color}${opacity}`;
    const names: string[] = data.name.split(' ');

    const key: string = data.path.replace(' \\/ ', '/').replace(/ /g, '');

    if (!result[key]) {
      result[key] = {};
    }

    const props = [key, ...names];
    let acc = result;

    props.forEach((prop, index) => {
      if (!acc[prop]) {
        acc[prop] = {};
      }

      if (index === props.length - 1) {
        let propIndex = 1;
        const initialProp = prop;

        while (acc[prop]?.$value) {
          prop = `${initialProp}${propIndex}`;
          propIndex++;
        }

        acc[prop] = {
          $value: value,
          $type: 'color',
        };
      }

      acc = acc[prop] as TokenStructure;
    });
  });

  return result;
}
