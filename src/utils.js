export function blockEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

export function calcPosition(args) {
  const { refRect, width, height } = args;
  const { refLinkPoint, linkPoint } = args;

  const refPoint = {
    x: calcRefX(refLinkPoint, refRect),
    y: calcRefY(refLinkPoint, refRect),
  };

  return {
    top: calcTop(linkPoint, refPoint, { width, height }),
    left: calcLeft(linkPoint, refPoint, { width, height }),
  };
}

function calcRefX(linkPoint = {}, refRect) {
  switch (linkPoint.x) {
    case 'left':
      return refRect.x;
    case 'center':
      return (refRect.x + refRect.width) / 2;
    case 'right':
      return refRect.x + refRect.width;
  }
  return refRect.x;
}

function calcRefY(linkPoint = {}, refRect) {
  switch (linkPoint.y) {
    case 'top':
      return refRect.y;
    case 'center':
      return (refRect.y + refRect.height) / 2;
    case 'bottom':
      return refRect.y + refRect.height;
  }
  return refRect.y;
}

function calcLeft(linkPoint = {}, refPoint, size) {
  switch (linkPoint.x) {
    case 'left':
      return refPoint.x;
    case 'center':
      return refPoint.x - size.width / 2;
    case 'right':
      return refPoint.x - size.width;
  }
  return refPoint.x;
}

function calcTop(linkPoint = {}, refPoint, size) {
  switch (linkPoint.y) {
    case 'top':
      return refPoint.y;
    case 'center':
      return refPoint.y - size.height / 2;
    case 'bottom':
      return refPoint.y - size.height;
  }
  return refPoint.y;
}
