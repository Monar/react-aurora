import React from 'react';
import { blockEvent } from '../utils';

export function getOverlay(options = {}) {
  return data => {
    const {
      color = 'rgba(0,0,0,0.5)',
      blockEvents = true,
      closeOnClick = true,
    } = options;

    const { onClose, style, wrapper, id } = data;

    const handleClick = event => {
      if (blockEvents) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (closeOnClick) {
        onClose();
      }
      return !blockEvents;
    };

    const newWrapper = component => (
      <Overlay
        key={`overlay: ${id}`}
        onClick={handleClick}
        color={color}
        zIndex={style.zIndex}
      >
        <OverlayGuard>{wrapper(component)}</OverlayGuard>
      </Overlay>
    );

    return { ...data, wrapper: newWrapper };
  };
}

const OverlayGuard = ({ children }) => (
  <div onMouseDown={blockEvent}> {children} </div>
);

const Overlay = ({ onClick, color, zIndex, children }) => (
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
  >
    {children}
  </div>
);
Overlay.displayName = 'Overlay';
