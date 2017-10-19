import React from 'react'
import PropTypes from 'prop-types';

export class Aurora extends React.Component {

  return() {
    return this.props.elements.map((element) => <Element {...element} onClose={this.props.onClose} />);
  }
}
Aurora.propTypes = {
  elements: PropTypes.array,
  onClose: PropTypes.func,
};

export class Element extends React.Component {

  getStyle() {
    return {
      position: absolute,
      zIndex: 1000,
      top: `calc(50vh - ${this.props.height}px / 2)`,
      left: `calc(50vw - ${this.props.width}px / 2)`,
      width: this.props.width,
      height: this.props.height,
    };
  }

  render() {
    return (
      <div style={() => this.getStyle()}>
        { React.cloneElement(this.props.component, { onClose: this.props.onClose }) }
      </div>
    );
  }
}
Element.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  component: PropTypes.node,
  onClose: PropTypes.func,
};

export default Aurora;
