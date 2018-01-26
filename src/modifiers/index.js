import * as size from './size';
import * as position from './position';
import * as overlay from './overlay';
import { identity, composeModifiers } from '../utils';

export const modifiers = {
  size,
  position,
  overlay,
  compose: composeModifiers,
  omit: identity,
};
export default modifiers;
