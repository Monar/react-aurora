(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('prop-types'), require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'prop-types', 'react'], factory) :
	(factory((global.Aurora = {}),global.PropTypes,global.React));
}(this, (function (exports,PropTypes,React) { 'use strict';

PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;
React = React && React.hasOwnProperty('default') ? React['default'] : React;

const VERTICAL = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
};

const HORIZONTAL = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};













var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

function mergeStyles(data, style) {
  data.style = _extends({}, data.style, style);
  return data;
}

function identity(data) {
  return data;
}

function noop() {}

function blockEvent(event) {
  event.stopPropagation();
  event.preventDefault();
}

function composeModifiers(modifiers) {
  const list = Object.keys(modifiers).map(k => modifiers[k]);
  return data => list.reduce((data, mod) => mod(data), data);
}

const revertedAlignMap = {
  [VERTICAL.TOP]: VERTICAL.BOTTOM,
  [VERTICAL.CENTER]: VERTICAL.CENTER,
  [HORIZONTAL.LEFT]: HORIZONTAL.RIGHT,
  [HORIZONTAL.RIGHT]: HORIZONTAL.LEFT,

  [VERTICAL.BOTTOM]: VERTICAL.TOP,
  [HORIZONTAL.CENTER]: HORIZONTAL.CENTER
};

const revertAlign = align => ({
  vertical: revertedAlignMap[align.vertical],
  horizontal: revertedAlignMap[align.horizontal]
});

function getWindowRect() {
  return {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  };
}

const ModsPropType = PropTypes.shape({
  size: PropTypes.func,
  position: PropTypes.func,
  overlay: PropTypes.func
});

class ElementWrapper extends React.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = { mount: false }, this.setRef = node => {
      this.node = node;
    }, this.getStyle = () => ({
      position: 'fixed',
      zIndex: this.props.zIndex
    }), this.handleClose = () => {
      this.props.onClose(this.props.element.id);
    }, this.getComponent = style => {
      const { props, component: Component, id } = this.props.element;
      return React.createElement(
        'div',
        { key: id, ref: this.setRef, style: style },
        React.createElement(Component, _extends({}, props, { onClose: this.handleClose }))
      );
    }, _temp;
  }

  componentDidMount() {
    const { top, left, width, height } = this.node.getBoundingClientRect();
    this.setState({ top, left, width, height, mount: true });
  }

  componentWillUpdate() {
    const { top, left, width, height } = this.node.getBoundingClientRect();
    this.setState({ top, left, width, height });
  }

  render() {
    const data = {
      id: this.props.element.id,
      state: _extends({}, this.state),
      wrapper: identity,
      style: this.getStyle(),
      onClose: this.handleClose
    };

    const { style, wrapper } = this.props.modifier(data);
    return wrapper(this.getComponent(style));
  }
}
ElementWrapper.propTypes = {
  zIndex: PropTypes.number.isRequired,
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    props: PropTypes.object,
    mods: ModsPropType
  }).isRequired,
  modifier: PropTypes.func,
  onClose: PropTypes.func.isRequired
};

function getFixed(options = {}) {
  return data => {
    const { width = 0, height = 0 } = options;

    const style = {
      width,
      maxWidth: width,
      height,
      maxHeight: height
    };

    return mergeStyles(data, style);
  };
}

function getAuto() {
  return data => mergeStyles(data, { width: 'auto', height: 'auto' });
}

var size = Object.freeze({
	getFixed: getFixed,
	getAuto: getAuto
});

function getFixed$1(options = {}) {
  return data => {
    const { top = 0, left = 0, overflowWindow = true } = options;
    const { state } = data;

    if (overflowWindow && !state.mount) {
      return mergeStyles(data, { top, left });
    }

    return mergeStyles(data, {
      top: applyLimit(top, state.height, window.innerHeight),
      left: applyLimit(left, state.width, window.innerWidth)
    });
  };
}

function getWindowAligned(options = {}) {
  return data => {
    const { state: { mount, width, height } } = data;

    if (!mount || !width || !height) {
      return data;
    }

    const {
      vertical = VERTICAL.CENTER,
      horizontal = HORIZONTAL.CENTER
    } = options;

    const align = { vertical, horizontal };
    const revertedAlign = revertAlign(align);
    const windowRect = getWindowRect();
    const refPoint = calcReferencePoint(revertedAlign, windowRect);
    const { top, left } = calcPosition(refPoint, align, data.state);

    return mergeStyles(data, { top, left });
  };
}

function getElementAligned(options = {}) {
  return data => {
    const { state: { mount, width, height } } = data;

    if (!mount || !width || !height) {
      return data;
    }

    const {
      element = {},
      vertical = VERTICAL.CENTER,
      horizontal = HORIZONTAL.CENTER
    } = options;

    const align = { vertical, horizontal };
    const {
      rect: elementRect = { top: 0, left: 0, width: 0, height: 0 }
    } = element,
          elementAlign = objectWithoutProperties(element, ['rect']);

    const refPoint = calcReferencePoint(_extends({}, align, elementAlign), elementRect);
    const { top, left } = calcPosition(refPoint, align, data.state);

    return mergeStyles(data, { top, left });
  };
}

function getMovable(options = {}) {
  return data => {
    const { overflowWindow = true } = options;
    const { wrapper, style: { position, left, top } } = data,
          style = objectWithoutProperties(data.style, ['position', 'left', 'top']);

    const moveWrapper = component => React.createElement(
      MoveableWrapper,
      {
        overflowWindow: overflowWindow,
        position: position,
        zIndex: style.zIndex,
        left: left,
        top: top
      },
      wrapper(component)
    );

    return _extends({}, data, { style, wrapper: moveWrapper });
  };
}

class MoveableWrapper extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {}, this.handleMouseDown = event => {
      if (event.button !== 0) {
        return;
      }

      const { left, top } = this.props;
      this.setState({
        start: { x: event.clientX, y: event.clientY },
        prevX: left - (this.state.left || left),
        prevY: top - (this.state.top || top)
      });
      return blockEvent(event);
    }, this.handleMouseMove = event => {
      if (!this.state.start) {
        return;
      }

      const { left, top } = this.props;
      const { start: { x, y }, prevX, prevY } = this.state;

      this.setState({
        left: left - prevX - x + event.clientX,
        top: top - prevY - y + event.clientY
      });

      return blockEvent(event);
    }, this.handleMouseUp = event => {
      this.setState({ start: null });
      return blockEvent(event);
    }, this.getStyle = () => {
      const { left, top } = this.state;

      return {
        position: this.props.position,
        zIndex: this.props.zIndex,
        left: left !== undefined ? left : this.props.left,
        top: top !== undefined ? top : this.props.top
      };
    }, _temp;
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  render() {
    return React.createElement(
      'div',
      {
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        style: this.getStyle()
      },
      this.props.children
    );
  }
}

/*****************************************************************************/
// Helpers below
/*****************************************************************************/

function calcReferencePoint(align, rect) {
  return {
    top: getRefTopMap[align.vertical](rect),
    left: getRefLeftMap[align.horizontal](rect)
  };
}

function calcPosition(refPoint, align, size) {
  const left = getLeftMap[align.horizontal](refPoint, size);
  const top = getTopMap[align.vertical](refPoint, size);

  return {
    top: applyLimit(top, size.height, window.innerHeight),
    left: applyLimit(left, size.width, window.innerWidth)
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
  [HORIZONTAL.RIGHT]: rect => rect.left + rect.width
};

const getRefTopMap = {
  [VERTICAL.TOP]: rect => rect.top,
  [VERTICAL.CENTER]: rect => (rect.top + rect.height) / 2,
  [VERTICAL.BOTTOM]: rect => rect.top + rect.height
};

const getLeftMap = {
  [HORIZONTAL.LEFT]: refPoint => refPoint.left,
  [HORIZONTAL.CENTER]: (refPoint, size) => refPoint.left - size.width / 2,
  [HORIZONTAL.RIGHT]: (refPoint, size) => refPoint.left - size.width
};

const getTopMap = {
  [VERTICAL.TOP]: refPoint => refPoint.top,
  [VERTICAL.CENTER]: (refPoint, size) => refPoint.top - size.height / 2,
  [VERTICAL.BOTTOM]: (refPoint, size) => refPoint.top - size.height
};



var position = Object.freeze({
	getFixed: getFixed$1,
	getWindowAligned: getWindowAligned,
	getElementAligned: getElementAligned,
	getMovable: getMovable
});

function getOverlay(options = {}) {
  return data => {
    const {
      color = 'rgba(0,0,0,0.5)',
      blockEvents = true,
      closeOnClick = true
    } = options;

    const { onClose, style, wrapper, id } = data;

    const handleClick = event => {
      if (blockEvents) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (closeOnClick) {
        onClose();
      }
      return !blockEvents;
    };

    const newWrapper = component => React.createElement(
      Overlay,
      {
        key: `overlay: ${id}`,
        onClick: handleClick,
        color: color,
        zIndex: style.zIndex
      },
      React.createElement(
        OverlayGuard,
        null,
        wrapper(component)
      )
    );

    return _extends({}, data, { wrapper: newWrapper });
  };
}

const OverlayGuard = ({ children }) => React.createElement(
  'div',
  { onMouseDown: blockEvent },
  ' ',
  children,
  ' '
);

const Overlay = ({ onClick, color, zIndex, children }) => React.createElement(
  'div',
  {
    onMouseDown: onClick,
    style: {
      backgroundColor: color,
      position: 'fixed',
      zIndex,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  },
  children
);
Overlay.displayName = 'Overlay';



var overlay = Object.freeze({
	getOverlay: getOverlay
});

const modifiers = {
  size,
  position,
  overlay,
  compose: composeModifiers,
  omit: identity
};

const baseMods = {
  size: modifiers.size.getAuto(),
  position: modifiers.position.getWindowAligned(),
  overlay: modifiers.overlay.getOverlay()
};

const globalTriggers = {
  update() {},
  closeAll() {},
  closeWith() {}
};

const AuroraRemote = {
  update() {
    globalTriggers.update();
  },
  closeAll() {
    globalTriggers.closeAll();
  },
  closeWith(pred) {
    globalTriggers.closeWith(pred);
  }
};

class Aurora extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.update = () => {
      this.forceUpdate();
    }, this.closeAll = () => {
      const { elements, onClose } = this.props;
      if (onClose && elements && elements.length) {
        onClose(elements.map(e => e.id));
      }
    }, this.closeWith = pred => {
      const { elements, onClose } = this.props;
      if (onClose && elements && elements.length) {
        const toClose = elements.filter(pred);
        if (toClose.length) {
          onClose(toClose.map(e => e.id));
        }
      }
    }, this.handleClose = id => {
      if (this.props.onClose) {
        this.props.onClose([id]);
      }
    }, this.getModifier = mods => {
      const config = _extends({}, baseMods, this.props.defaultMods, mods);

      return composeModifiers(config, modifiers);
    }, this.createElement = (element, index) => {
      return React.createElement(ElementWrapper, {
        key: element.id,
        zIndex: this.props.zIndex + index,
        onClose: this.handleClose,
        element: element,
        modifier: this.getModifier(element.mods)
      });
    }, _temp;
  }

  componentDidMount() {
    globalTriggers.update = this.update;
    globalTriggers.closeAll = this.closeAll;
    globalTriggers.closeWith = this.closeWith;
  }

  componentWillUnmount() {
    globalTriggers.update = noop;
    globalTriggers.closeAll = noop;
    globalTriggers.closeWith = noop;
  }

  render() {
    const { elements } = this.props;
    return elements.map(this.createElement);
  }
}
Aurora.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    props: PropTypes.object,
    mods: ModsPropType
  }).isRequired),
  defaultMods: ModsPropType,
  onClose: PropTypes.func,
  zIndex: PropTypes.number
};
Aurora.defaultProps = {
  zIndex: 1000,
  updateOnResize: true
};

exports.Aurora = Aurora;
exports.AuroraRemote = AuroraRemote;
exports.modifiers = modifiers;

Object.defineProperty(exports, '__esModule', { value: true });

})));
