import React from 'react';
import { mergeStyles, revertAlign, getWindowRect, blockEvent } from '../utils';
import { VERTICAL, HORIZONTAL } from '../enums';

export function getFixed(options = {}) {
  return data => {
    const { top = 0, left = 0, overflowWindow = true } = options;
    const { state } = data;

    if (overflowWindow && !state.mount) {
      return mergeStyles(data, { top, left });
    }

    return mergeStyles(data, {
      top: applyLimit(top, state.height, window.innerHeight),
      left: applyLimit(left, state.width, window.innerWidth),
    });
  };
}

export function getWindowAligned(options = {}) {
  return data => {
    const { state: { mount, width, height } } = data;

    if (!mount || !width || !height) {
      return data;
    }

    const {
      vertical = VERTICAL.CENTER,
      horizontal = HORIZONTAL.CENTER,
    } = options;

    const align = { vertical, horizontal };
    const revertedAlign = revertAlign(align);
    const windowRect = getWindowRect();
    const refPoint = calcReferencePoint(revertedAlign, windowRect);
    const { top, left } = calcPosition(refPoint, align, data.state);

    return mergeStyles(data, { top, left });
  };
}

export function getElementAligned(options = {}) {
  return data => {
    const { state: { mount, width, height } } = data;

    if (!mount || !width || !height) {
      return data;
    }

    const {
      element = {},
      vertical = VERTICAL.CENTER,
      horizontal = HORIZONTAL.CENTER,
    } = options;

    const align = { vertical, horizontal };
    const {
      rect: elementRect = { top: 0, left: 0, width: 0, height: 0 },
      ...elementAlign
    } = element;

    const refPoint = calcReferencePoint(
      { ...align, ...elementAlign },
      elementRect,
    );
    const { top, left } = calcPosition(refPoint, align, data.state);

    return mergeStyles(data, { top, left });
  };
}

export function getMovable(options = {}) {
  return data => {
    const { overflowWindow = true } = options;
    const { wrapper, style: { position, left, top, ...style } } = data;

    const moveWrapper = component => (
      <MoveableWrapper
        overflowWindow={overflowWindow}
        position={position}
        zIndex={style.zIndex}
        left={left}
        top={top}
      >
        {wrapper(component)}
      </MoveableWrapper>
    );

    return { ...data, style, wrapper: moveWrapper };
  };
}

class MoveableWrapper extends React.Component {
  state = {};

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseDown = event => {
    if (event.button !== 0) {
      return;
    }

    const { left, top } = this.props;
    this.setState({
      start: { x: event.clientX, y: event.clientY },
      prevX: left - (this.state.left || left),
      prevY: top - (this.state.top || top),
    });
    return blockEvent(event);
  };

  handleMouseMove = event => {
    if (!this.state.start) {
      return;
    }

    const { left, top } = this.props;
    const { start: { x, y }, prevX, prevY } = this.state;

    this.setState({
      left: left - prevX - x + event.clientX,
      top: top - prevY - y + event.clientY,
    });

    return blockEvent(event);
  };

  handleMouseUp = event => {
    this.setState({ start: null });
    return blockEvent(event);
  };

  getStyle = () => {
    const { left, top } = this.state;

    return {
      position: this.props.position,
      zIndex: this.props.zIndex,
      left: left !== undefined ? left : this.props.left,
      top: top !== undefined ? top : this.props.top,
    };
  };

  render() {
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        style={this.getStyle()}
      >
        {this.props.children}
      </div>
    );
  }
}

/*****************************************************************************/
// Helpers below
/*****************************************************************************/

function calcReferencePoint(align, rect) {
  return {
    top: getRefTopMap[align.vertical](rect),
    left: getRefLeftMap[align.horizontal](rect),
  };
}

function calcPosition(refPoint, align, size) {
  const left = getLeftMap[align.horizontal](refPoint, size);
  const top = getTopMap[align.vertical](refPoint, size);

  return {
    top: applyLimit(top, size.height, window.innerHeight),
    left: applyLimit(left, size.width, window.innerWidth),
  };
}

function applyLimit(point, size, limit) {
  if (point + size > limit) {
    return Math.max(0, point - (point + size - limit));
  }
  return point;
}

const getRefLeftMap = {
  [HORIZONTAL.LEFT]: rect => rect.left,
  [HORIZONTAL.CENTER]: rect => (rect.left + rect.width) / 2,
  [HORIZONTAL.RIGHT]: rect => rect.left + rect.width,
};

const getRefTopMap = {
  [VERTICAL.TOP]: rect => rect.top,
  [VERTICAL.CENTER]: rect => (rect.top + rect.height) / 2,
  [VERTICAL.BOTTOM]: rect => rect.top + rect.height,
};

const getLeftMap = {
  [HORIZONTAL.LEFT]: refPoint => refPoint.left,
  [HORIZONTAL.CENTER]: (refPoint, size) => refPoint.left - size.width / 2,
  [HORIZONTAL.RIGHT]: (refPoint, size) => refPoint.left - size.width,
};

const getTopMap = {
  [VERTICAL.TOP]: refPoint => refPoint.top,
  [VERTICAL.CENTER]: (refPoint, size) => refPoint.top - size.height / 2,
  [VERTICAL.BOTTOM]: (refPoint, size) => refPoint.top - size.height,
};
