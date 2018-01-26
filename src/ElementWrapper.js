import React from 'react';
import PropTypes from 'prop-types';

import { identity, ModsPropType } from './utils';

export class ElementWrapper extends React.PureComponent {
  state = { mount: false };

  static propTypes = {
    zIndex: PropTypes.number.isRequired,
    element: PropTypes.shape({
      id: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
        .isRequired,
      props: PropTypes.object,
      mods: ModsPropType,
    }).isRequired,
    modifier: PropTypes.func,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { top, left, width, height } = this.node.getBoundingClientRect();
    this.setState({ top, left, width, height, mount: true });
  }

  componentWillUpdate() {
    const { top, left, width, height } = this.node.getBoundingClientRect();
    this.setState({ top, left, width, height });
  }

  setRef = node => {
    this.node = node;
  };

  getStyle = () => ({
    position: 'fixed',
    zIndex: this.props.zIndex,
  });

  handleClose = () => {
    this.props.onClose(this.props.element.id);
  };

  getComponent = style => {
    const { props, component: Component, id } = this.props.element;
    return (
      <div key={id} ref={this.setRef} style={style}>
        <Component {...props} onClose={this.handleClose} />
      </div>
    );
  };

  render() {
    const data = {
      id: this.props.element.id,
      state: { ...this.state },
      wrapper: identity,
      style: this.getStyle(),
      onClose: this.handleClose,
    };

    const { style, wrapper } = this.props.modifier(data);
    return wrapper(this.getComponent(style));
  }
}
