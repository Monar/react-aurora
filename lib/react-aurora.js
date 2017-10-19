(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
	(factory((global.Aurora = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Aurora extends React.Component {

  return() {
    return this.props.elements.map(element => React.createElement(Element, _extends({}, element, { onClose: this.props.onClose })));
  }
}
Aurora.propTypes = {
  elements: PropTypes.array,
  onClose: PropTypes.func
};

class Element extends React.Component {

  getStyle() {
    return {
      position: absolute,
      zIndex: 1000,
      top: `calc(50vh - ${this.props.height}px / 2)`,
      left: `calc(50vw - ${this.props.width}px / 2)`,
      width: this.props.width,
      height: this.props.height
    };
  }

  render() {
    return React.createElement(
      'div',
      { style: () => this.getStyle() },
      React.cloneElement(this.props.component, { onClose: this.props.onClose })
    );
  }
}
Element.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  component: PropTypes.node,
  onClose: PropTypes.func
};

exports.Aurora = Aurora;
exports.Element = Element;
exports['default'] = Aurora;

Object.defineProperty(exports, '__esModule', { value: true });

})));
