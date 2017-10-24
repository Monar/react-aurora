import React from 'react';
import PropTypes from 'prop-types';

import { calcPosition, blockEvent } from './utils';

export class Element extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,

      ref: PropTypes.oneOfType([
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        }),
        PropTypes.element.isRequired,
      ]),

      refLinkPoint: PropTypes.shape({
        x: PropTypes.oneOf(['left', 'right', 'center']),
        y: PropTypes.oneOf(['top', 'bottom', 'center']),
      }),
      linkPoint: PropTypes.shape({
        x: PropTypes.oneOf(['left', 'right', 'center']),
        y: PropTypes.oneOf(['top', 'bottom', 'center']),
      }),

      width: PropTypes.number,
      height: PropTypes.number,

      component: PropTypes.node.isRequired,
      props: PropTypes.object,
      sticky: PropTypes.bool,
      overlay: PropTypes.bool,
      blockingOverlay: PropTypes.bool,
      overlayClickCloses: PropTypes.bool,
      overlayColor: PropTypes.string,
    }).isRequired,
    zIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func,
    overlayColor: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      updateSize: !props.data.width && !props.data.height,
      width: props.data.width || 0,
      height: props.data.height || 0,
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

  setRef = node => {
    this.node = node;
  };

  updateSize = () => {
    const { width, height } = this.node.getBoundingClientRect();
    this.setState({ width, height });
  };

  getRefRect = () => {
    const { ref } = this.props.data;
    if (!ref) {
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }

    if (ref.x && ref.y) {
      return { x: ref.x, y: ref.y, width: 0, height: 0 };
    }

    const { x, y, width, height } = ref.getBoundingClientRect();
    return { x, y, width, height };
  };

  getStyle = () => {
    const refRect = this.getRefRect();
    const { refLinkPoint, linkPoint } = this.props.data;
    const { width, height } = this.state;
    const { top, left } = calcPosition({
      refLinkPoint,
      linkPoint,
      width,
      height,
      refRect,
    });

    return {
      position: 'fixed',
      zIndex: this.props.zIndex,
      top,
      left,
      width: this.props.data.width,
      height: this.props.data.height,
    };
  };

  handleClose = () => {
    this.props.onClose(this.props.data.id);
  };

  handleOverlayClick = event => {
    const {
      blockingOverlay = true,
      overlayClickCloses = true,
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

  getOverlay = () => {
    const { data: { id, overlay, overlayColor }, zIndex } = this.props;
    if (!overlay) return null;

    return (
      <Overlay
        key={`overlay: ${id}`}
        color={overlayColor || this.props.overlayColor}
        zIndex={zIndex}
        onClick={this.handleOverlayClick}
      />
    );
  };

  render() {
    const { data } = this.props;
    const { id, component: Component, props = {} } = data;
    return [
      this.getOverlay(),
      <div
        key={id}
        ref={this.setRef}
        onMouseDown={blockEvent}
        style={this.getStyle(data)}
      >
        <Component {...props} onClose={this.handleClose} />
      </div>,
    ];
  }
}

const Overlay = ({ onClick, color, zIndex }) => (
  <div
    onMouseDown={onClick}
    style={{
      backgroundColor: color,
      position: 'fixed',
      zIndex,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }}
  />
);
Overlay.displayName = 'AuroraElementOverlay';
