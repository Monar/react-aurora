import React from 'react';
import PropTypes from 'prop-types';

export class Element extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
        .isRequired,
      props: PropTypes.object,
      overlay: PropTypes.bool,
      overlayColor: PropTypes.string,
    }),
    zIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func,
    overlayColor: PropTypes.string,
  };

  getStyle = data => ({
    position: 'fixed',
    zIndex: this.props.zIndex,
    top: `calc(50vh - ${data.height}px / 2)`,
    left: `calc(50vw - ${data.width}px / 2)`,
    width: data.width,
    height: data.height,
  });

  handleClose = () => {
    this.props.onClose(this.props.data.id);
  };

  handleOverlayClick = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onClose(this.props.data.id);
    return false;
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
      <div key={id} style={this.getStyle(data)}>
        <Component {...props} onClose={this.handleClose} />
      </div>,
    ];
  }
}

const Overlay = ({ onClick, color, zIndex }) => (
  <div
    onClick={onClick}
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
