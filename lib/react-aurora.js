(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['react', 'prop-types'], factory) :
	(global.Aurora = factory(global.React,global.PropTypes));
}(this, (function (React,PropTypes) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

function calcPosition(args) {
  const { refRect, width, height } = args;
  const { refLinkPoint, linkPoint } = args;

  const refPoint = {
    x: calcRefX(refLinkPoint, refRect),
    y: calcRefY(refLinkPoint, refRect)
  };

  return {
    top: calcTop(linkPoint, refPoint, { width, height }),
    left: calcLeft(linkPoint, refPoint, { width, height })
  };
}

function calcRefX(linkPoint = {}, refRect) {
  switch (linkPoint.x) {
    case 'left':
      return refRect.x;
    case 'center':
      return (refRect.x + refRect.width) / 2;
    case 'right':
      return refRect.x + refRect.width;
  }
  return refRect.x;
}

function calcRefY(linkPoint = {}, refRect) {
  switch (linkPoint.y) {
    case 'top':
      return refRect.y;
    case 'center':
      return (refRect.y + refRect.height) / 2;
    case 'bottom':
      return refRect.y + refRect.height;
  }
  return refRect.y;
}

function calcLeft(linkPoint = {}, refPoint, size) {
  switch (linkPoint.x) {
    case 'left':
      return refPoint.x;
    case 'center':
      return refPoint.x - size.width / 2;
    case 'right':
      return refPoint.x - size.width;
  }
  return refPoint.x;
}

function calcTop(linkPoint = {}, refPoint, size) {
  switch (linkPoint.y) {
    case 'top':
      return refPoint.y;
    case 'center':
      return refPoint.y - size.height / 2;
    case 'bottom':
      return refPoint.y - size.height;
  }
  return refPoint.y;
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Element extends React.PureComponent {

  constructor(props) {
    super(props);

    this.setRef = node => {
      this.node = node;
    };

    this.updateSize = () => {
      const { width, height } = this.node.getBoundingClientRect();
      this.setState({ width, height });
    };

    this.getRefRect = () => {
      const { ref } = this.props.data;
      if (!ref) {
        return {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }

      if (ref.x && ref.y) {
        return { x: ref.x, y: ref.y, width: 0, height: 0 };
      }

      const { x, y, width, height } = ref.getBoundingClientRect();
      return { x, y, width, height };
    };

    this.getStyle = () => {
      const refRect = this.getRefRect();
      const { refLinkPoint, linkPoint } = this.props.data;
      const { width, height } = this.state;
      const { top, left } = calcPosition({
        refLinkPoint,
        linkPoint,
        width,
        height,
        refRect
      });

      return {
        position: 'fixed',
        zIndex: this.props.zIndex,
        top,
        left,
        width: this.props.data.width,
        height: this.props.data.height
      };
    };

    this.handleClose = () => {
      this.props.onClose(this.props.data.id);
    };

    this.handleOverlayClick = event => {
      const {
        blockingOverlay = true,
        overlayClickCloses = true
      } = this.props.data;

      if (blockingOverlay) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (overlayClickCloses) {
        this.props.onClose(this.props.data.id);
      }

      return !blockingOverlay;
    };

    this.getOverlay = () => {
      const { data: { id, overlay, overlayColor }, zIndex } = this.props;
      if (!overlay) return null;

      return React.createElement(Overlay, {
        key: `overlay: ${id}`,
        color: overlayColor || this.props.overlayColor,
        zIndex: zIndex,
        onClick: this.handleOverlayClick
      });
    };

    this.state = {
      updateSize: !props.data.width && !props.data.height,
      width: props.data.width || 0,
      height: props.data.height || 0
    };
  }

  componentDidMount() {
    if (this.state.updateSize) {
      this.updateSize();
    }
    if (!this.props.data.sticky) {
      window.addEventListener('mousedown', this.handleClose);
      window.addEventListener('wheel', this.handleClose);
    }
  }

  componentDidUpdate() {
    if (this.state.updateSize) {
      this.updateSize();
    }
  }

  comopnentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClose);
    window.removeEventListener('wheel', this.handleClose);
  }

  render() {
    const { data } = this.props;
    const { id, component: Component, props = {} } = data;
    return [this.getOverlay(), React.createElement(
      'div',
      {
        key: id,
        ref: this.setRef,
        style: this.getStyle(data)
      },
      React.createElement(Component, _extends({}, props, { onClose: this.handleClose }))
    )];
  }
}

Element.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,

    ref: PropTypes.oneOfType([PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }), PropTypes.shape({
      getBoundingClientRect: PropTypes.func.isRequired
    })]),

    refLinkPoint: PropTypes.shape({
      x: PropTypes.oneOf(['left', 'right', 'center']),
      y: PropTypes.oneOf(['top', 'bottom', 'center'])
    }),
    linkPoint: PropTypes.shape({
      x: PropTypes.oneOf(['left', 'right', 'center']),
      y: PropTypes.oneOf(['top', 'bottom', 'center'])
    }),

    width: PropTypes.number,
    height: PropTypes.number,

    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    props: PropTypes.object,
    sticky: PropTypes.bool,
    overlay: PropTypes.bool,
    blockingOverlay: PropTypes.bool,
    overlayClickCloses: PropTypes.bool,
    overlayColor: PropTypes.string
  }).isRequired,
  zIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func,
  overlayColor: PropTypes.string
};
const Overlay = ({ onClick, color, zIndex }) => React.createElement('div', {
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
});
Overlay.displayName = 'AuroraElementOverlay';

class Aurora$1 extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.update = () => {
      this.forceUpdate();
    }, this.handleOnClose = id => {
      if (this.props.onClose) {
        this.props.onClose(id);
      }
    }, this.createElement = (element, index) => React.createElement(Element, {
      key: element.id,
      data: element,
      overlayColor: this.props.overlayColor,
      zIndex: this.props.zIndex + index,
      onClose: this.handleOnClose
    }), _temp;
  }

  componentDidMount() {
    window.addEventListener('resize', this.update);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
  }

  render() {
    const { elements } = this.props;
    return elements.map(this.createElement);
  }
}
Aurora$1.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired),
  overlayColor: PropTypes.string,
  onClose: PropTypes.func,
  zIndex: PropTypes.number
};
Aurora$1.defaultProps = {
  overlayColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000
};

return Aurora$1;

})));
