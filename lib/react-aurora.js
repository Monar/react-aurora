(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['react', 'prop-types'], factory) :
	(global.Aurora = factory(global.React,global.PropTypes));
}(this, (function (React,PropTypes) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Element extends React.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.getStyle = data => ({
      position: 'fixed',
      zIndex: this.props.zIndex,
      top: `calc(50vh - ${data.height}px / 2)`,
      left: `calc(50vw - ${data.width}px / 2)`,
      width: data.width,
      height: data.height
    }), this.handleClose = event => {
      this.props.onClose(event, this.props.data.id);
    }, this.getOverlay = () => {
      const { data: { id, overlay, overlayColor }, zIndex } = this.props;
      if (!overlay) return null;

      return React.createElement(Overlay, {
        key: `overlay: ${id}`,
        color: overlayColor || this.props.overlayColor,
        zIndex: zIndex,
        onClick: this.handleClose
      });
    }, _temp;
  }

  render() {
    const { data } = this.props;
    const { id, component: Component, props = {} } = data;
    return [this.getOverlay(), React.createElement(
      'div',
      { key: id, style: this.getStyle(data), onClick: blockEvent },
      React.createElement(Component, _extends({}, props, { onClose: this.handleClose }))
    )];
  }
}

Element.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    props: PropTypes.object,
    overlay: PropTypes.bool,
    overlayColor: PropTypes.string
  }),
  zIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func,
  overlayColor: PropTypes.string
};
const Overlay = ({ onClick, color, zIndex }) => React.createElement('div', {
  onClick: onClick,
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

function blockEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

class Aurora$1 extends React.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.handleOnClose = (event, id) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.props.onClose) {
        this.props.onClose(id);
      }
      return false;
    }, this.createElement = (element, index) => React.createElement(Element, {
      key: element.id,
      data: element,
      overlayColor: this.props.overlayColor,
      zIndex: this.props.zIndex + index,
      onClose: this.handleOnClose
    }), _temp;
  }

  render() {
    const { elements } = this.props;
    return elements.map(this.createElement);
  }
}
Aurora$1.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })),
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
