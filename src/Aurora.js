import React from 'react';
import PropTypes from 'prop-types';

import { Element } from './Element';

export class Aurora extends React.PureComponent {
  static propTypes = {
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ),
    overlayColor: PropTypes.string,
    onClose: PropTypes.func,
    zIndex: PropTypes.number,
  };

  static defaultProps = {
    overlayColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  };

  handleOnClose = id => {
    if (this.props.onClose) {
      this.props.onClose(id);
    }
  };

  createElement = (element, index) => (
    <Element
      key={element.id}
      data={element}
      overlayColor={this.props.overlayColor}
      zIndex={this.props.zIndex + index}
      onClose={this.handleOnClose}
    />
  );

  render() {
    const { elements } = this.props;
    return elements.map(this.createElement);
  }
}
