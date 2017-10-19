(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('prop-types'), require('react-immutable-proptypes'), require('react-immutable-pure-component')) :
	typeof define === 'function' && define.amd ? define(['react', 'prop-types', 'react-immutable-proptypes', 'react-immutable-pure-component'], factory) :
	(global.Aurora = factory(global.React,global.PropTypes,global.ImmutablePropTypes,global.ImmutablePureComponent));
}(this, (function (React,PropTypes,ImmutablePropTypes,ImmutablePureComponent) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;
ImmutablePropTypes = ImmutablePropTypes && ImmutablePropTypes.hasOwnProperty('default') ? ImmutablePropTypes['default'] : ImmutablePropTypes;
ImmutablePureComponent = ImmutablePureComponent && ImmutablePureComponent.hasOwnProperty('default') ? ImmutablePureComponent['default'] : ImmutablePureComponent;

class Aurora extends ImmutablePureComponent {
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
      key: element.get('id'),
      data: element,
      zIndex: this.props.zIndex + index,
      onClose: this.handleOnClose
    }), this.getOverlay = (zIndexOffset, node) => {
      const { overlayColor, overlay, zIndex } = this.props;
      return overlay && React.createElement(Overlay, {
        key: 'overlay',
        color: overlayColor,
        onClose: event => this.handleOnClose(event, node.get('id')),
        zIndex: zIndex + zIndexOffset
      });
    }, _temp;
  }

  render() {
    const { elements } = this.props;
    const regural = elements.filter(e => !e.get('justOne', false));

    const justOne = elements.filter(e => e.get('justOne', false)).last() || false;

    return [...regural.map(this.createElement), this.getOverlay(regural.size, justOne), justOne && this.createElement(justOne, regural.size + 1)];
  }
}

Aurora.propTypes = {
  elements: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    id: PropTypes.string.isRequired,
    justOne: PropTypes.bool
  })),
  onClose: PropTypes.func,
  overlay: PropTypes.bool,
  overlayColor: PropTypes.string,
  zIndex: PropTypes.number
};
Aurora.defaultProps = {
  overlay: true,
  overlayColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000
};
class Element extends React.Component {
  constructor(...args) {
    var _temp2;

    return _temp2 = super(...args), this.getStyle = data => ({
      position: 'fixed',
      zIndex: this.props.zIndex,
      top: `calc(50vh - ${data.get('height')}px / 2)`,
      left: `calc(50vw - ${data.get('width')}px / 2)`,
      width: data.get('width'),
      height: data.get('height')
    }), this.handleClose = () => {
      this.props.onClose(event, this.props.data.get('id'));
    }, _temp2;
  }

  render() {
    const { onClose, data } = this.props;
    return React.createElement(
      'div',
      { key: data.get('id'), style: this.getStyle(data), onClick: blockEvent },
      React.cloneElement(data.get('component'), { onClose: this.handleClose })
    );
  }
}

Element.propTypes = {
  data: ImmutablePropTypes.mapContains({
    id: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    component: PropTypes.node.isRequired
  }),
  zIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func
};
const Overlay = ({ onClose, color, zIndex }) => React.createElement('div', {
  onClick: onClose,
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
Overlay.displayName = 'AuroraOverlay';

function blockEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

return Aurora;

})));
