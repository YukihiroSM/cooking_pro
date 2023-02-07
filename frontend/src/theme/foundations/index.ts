import { colors } from './colors.const';
import { spaces } from './spaces.const';
import { textStyles } from './textStyles.const';
import { borders } from './borders.const';
import { shadows } from './shadows.const';
import { breakpoints } from './breakpoints.const';

const foundations = {
  global: {
    ':not(.chakra-dont-set-collapse) > .chakra-collapse': {
      overflow: 'initial !important',
    },
  },
  spaces,
  colors,
  textStyles,
  borders,
  shadows,
  breakpoints,
};

export default foundations;
