import PropTypes from 'prop-types';

import { VERTICAL, HORIZONTAL } from './enums';

export function mergeStyles(data, style) {
  data.style = { ...data.style, ...style };
  return data;
}

export function identity(data) {
  return data;
}

export function noop() {}

export function blockEvent(event) {
  event.stopPropagation();
  event.preventDefault();
}

export function composeModifiers(modifiers) {
  const list = Object.keys(modifiers).map(k => modifiers[k]);
  return data => list.reduce((data, mod) => mod(data), data);
}

export const revertedAlignMap = {
  [VERTICAL.TOP]: VERTICAL.BOTTOM,
  [VERTICAL.CENTER]: VERTICAL.CENTER,
  [HORIZONTAL.LEFT]: HORIZONTAL.RIGHT,
  [HORIZONTAL.RIGHT]: HORIZONTAL.LEFT,

  [VERTICAL.BOTTOM]: VERTICAL.TOP,
  [HORIZONTAL.CENTER]: HORIZONTAL.CENTER,
};

export const revertAlign = align => ({
  vertical: revertedAlignMap[align.vertical],
  horizontal: revertedAlignMap[align.horizontal],
});

export function getWindowRect() {
  return {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const ModsPropType = PropTypes.shape({
  size: PropTypes.func,
  position: PropTypes.func,
  overlay: PropTypes.func,
});
