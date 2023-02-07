import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';
import foundations from './foundations';
import typography from './typography';

export const theme = extendTheme(
  {
    ...foundations,
    ...typography,
  },
  {
    config: defaultTheme.config,
    direction: defaultTheme.direction,
    transition: defaultTheme.transition,
    zIndices: defaultTheme.zIndices,
    components: {},
    styles: {},
    borders: {},
    colors: {},
    radii: {},
    shadows: {},
    sizes: {},
    space: {},
    fonts: {},
    fontSizes: {},
    fontWeights: {},
    letterSpacings: {},
    lineHeights: {},
  }
);
