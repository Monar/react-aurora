import { mergeStyles } from '../utils';

export function getFixed(options = {}) {
  return data => {
    const { width = 0, height = 0 } = options;

    const style = {
      width,
      maxWidth: width,
      height,
      maxHeight: height,
    };

    return mergeStyles(data, style);
  };
}

export function getAuto() {
  return data => {
    if (!data.state.mount) {
      return data;
    }

    const { width, height } = data.state;
    return mergeStyles(data, { width, height });
  };
}
