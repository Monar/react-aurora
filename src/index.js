import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

class Aurora extends ImmutablePureComponent {
  static propTypes = {
    elements: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.string.isRequired,
        justOne: PropTypes.bool,
      })
    ),
    onClose: PropTypes.func,
    overlay: PropTypes.bool,
    overlayColor: PropTypes.string,
    zIndex: PropTypes.number,
  };

  static defaultProps = {
    overlay: true,
    overlayColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  };

  handleOnClose = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.onClose) {
      this.props.onClose(id);
    }
    return false;
  };

  createElement = (element, index) => (
    <Element
      key={element.get('id')}
      data={element}
      zIndex={this.props.zIndex + index}
      onClose={this.handleOnClose}
    />
  );

  getOverlay = (zIndexOffset, node) => {
    const { overlayColor, overlay, zIndex } = this.props;
    return overlay &&
      <Overlay
        key="overlay"
        color={overlayColor}
        onClose={(event) => this.handleOnClose(event, node.get('id'))}
        zIndex={zIndex + zIndexOffset}
      />;
  };

  render() {
    const { elements } = this.props;
    const regural = elements
      .filter(e => !e.get('justOne', false));

    const justOne = elements
      .filter(e => e.get('justOne', false))
      .last() || false;

    return [
      ...regural.map(this.createElement),
      this.getOverlay(regural.size, justOne),
      justOne && this.createElement(justOne, regural.size + 1)
    ]
  }
}

class Element extends React.Component {
  static propTypes = {
    data: ImmutablePropTypes.mapContains({
      id: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      component: PropTypes.node.isRequired,
    }),
    zIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func,
  };

  getStyle = (data) => ({
    position: 'fixed',
    zIndex: this.props.zIndex,
    top: `calc(50vh - ${data.get('height')}px / 2)`,
    left: `calc(50vw - ${data.get('width')}px / 2)`,
    width: data.get('width'),
    height: data.get('height'),
  });

  handleClose = () => {
    this.props.onClose(event, this.props.data.get('id'));
  };

  render() {
    const { onClose, data } = this.props;
    return (
      <div key={data.get('id')} style={this.getStyle(data)} onClick={blockEvent}>
        {React.cloneElement(data.get('component'), { onClose: this.handleClose })}
      </div>
    );
  }
}

const Overlay = ({ onClose, color, zIndex }) => (
  <div
    onClick={onClose}
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
Overlay.displayName = 'AuroraOverlay';

function blockEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

export default Aurora;
