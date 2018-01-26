import React from 'react';
import PropTypes from 'prop-types';

import { ElementWrapper } from './ElementWrapper';
import modifiers from './modifiers';

import { ModsPropType, composeModifiers, noop } from './utils';

const baseMods = {
  size: modifiers.size.getAuto(),
  position: modifiers.position.getWindowAligned(),
  overlay: modifiers.overlay.getOverlay(),
};

const globalTriggers = {
  update() {},
  closeAll() {},
  closeWith() {},
};

export const AuroraRemote = {
  update() {
    globalTriggers.update();
  },
  closeAll() {
    globalTriggers.closeAll();
  },
  closeWith(pred) {
    globalTriggers.closeWith(pred);
  },
};

export class Aurora extends React.Component {
  static propTypes = {
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
          .isRequired,
        props: PropTypes.object,
        mods: ModsPropType,
      }).isRequired,
    ),
    defaultMods: ModsPropType,
    onClose: PropTypes.func,
    zIndex: PropTypes.number,
  };

  static defaultProps = {
    zIndex: 1000,
    updateOnResize: true,
  };

  componentDidMount() {
    globalTriggers.update = this.update;
    globalTriggers.closeAll = this.closeAll;
    globalTriggers.closeWith = this.closeWith;
  }

  componentWillUnmount() {
    globalTriggers.update = noop;
    globalTriggers.closeAll = noop;
    globalTriggers.closeWith = noop;
  }

  update = () => {
    this.forceUpdate();
  };

  closeAll = () => {
    const { elements, onClose } = this.props;
    if (onClose && elements && elements.length) {
      onClose(elements.map(e => e.id));
    }
  };

  closeWith = pred => {
    const { elements, onClose } = this.props;
    if (onClose && elements && elements.length) {
      const toClose = elements.filter(pred);
      if (toClose.length) {
        onClose(toClose.map(e => e.id));
      }
    }
  };

  handleClose = id => {
    if (this.props.onClose) {
      this.props.onClose([id]);
    }
  };

  getModifier = mods => {
    const config = {
      ...baseMods,
      ...this.props.defaultMods,
      ...mods,
    };

    return composeModifiers(config, modifiers);
  };

  createElement = (element, index) => {
    return (
      <ElementWrapper
        key={element.id}
        zIndex={this.props.zIndex + index}
        onClose={this.handleClose}
        element={element}
        modifier={this.getModifier(element.mods)}
      />
    );
  };

  render() {
    const { elements } = this.props;
    return elements.map(this.createElement);
  }
}
