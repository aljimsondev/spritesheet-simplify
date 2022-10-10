/**
 * CODE FROM kwdowik
 * https://github.com/kwdowik/zoom-pan.git
 *
 */

//! FIX ME ADD SOME TYPES
//!REVISE FORMAT
const hasPositionChanged: (props: {
  pos: number;
  prevPos: number;
}) => boolean = ({ pos, prevPos }) => {
  return pos !== prevPos;
};

const valueInRange: (props: {
  minScale: number;
  maxScale: number;
  scale: number;
}) => boolean = ({ minScale, maxScale, scale }) => {
  return scale <= maxScale && scale >= minScale;
};

const getTranslate: (props: {
  minScale: number;
  maxScale: number;
  scale: number;
}) => (props: { pos: number; prevPos: number; translate: number }) => any =
  ({ minScale, maxScale, scale }) =>
  ({ pos, prevPos, translate }) =>
    valueInRange({ minScale, maxScale, scale }) &&
    hasPositionChanged({ pos, prevPos })
      ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
      : translate;

const getScale: (props: {
  scale: number;
  minScale: number;
  maxScale: number;
  scaleSensitivity: number;
  deltaScale: number;
}) => any = ({ scale, minScale, maxScale, scaleSensitivity, deltaScale }) => {
  let newScale = scale + deltaScale / (scaleSensitivity / scale);
  newScale = Math.max(minScale, Math.min(newScale, maxScale));
  return [scale, newScale];
};

const getMatrix: (props: {
  scale: number;
  translateX: number;
  translateY: number;
}) => string = ({ scale, translateX, translateY }) => {
  return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
};

const pan: (props: { state: any; originX: number; originY: number }) => any = ({
  state,
  originX,
  originY,
}) => {
  state.transformation.translateX += originX;
  state.transformation.translateY += originY;
  state.element.style.transform = getMatrix({
    scale: state.transformation.scale,
    translateX: state.transformation.translateX,
    translateY: state.transformation.translateY,
  });
};

const makePan: (state: any) => {
  panBy: (props: {
    originX: number;
    originY: number;
  }) => (props: { state: any; originX: number; originY: number }) => any;
  panTo: (props: { originX: number; originY: number; scale: number }) => void;
} = (state: any) => ({
  panBy: ({ originX, originY }) => pan({ state, originX, originY }),
  panTo: ({ originX, originY, scale }) => {
    state.transformation.scale = scale;
    pan({
      state,
      originX: originX - state.transformation.translateX,
      originY: originY - state.transformation.translateY,
    });
  },
});

const makeZoom: (state: any) => {
  zoom: (props: { x: number; y: number; deltaScale: number }) => void;
} = (state: any) => ({
  zoom: ({ x, y, deltaScale }) => {
    const { left, top } = state.element.getBoundingClientRect();
    const { minScale, maxScale, scaleSensitivity } = state;
    const [scale, newScale] = getScale({
      scale: state.transformation.scale,
      deltaScale,
      minScale,
      maxScale,
      scaleSensitivity,
    });
    const originX = x - left;
    const originY = y - top;
    const newOriginX = originX / scale;
    const newOriginY = originY / scale;
    const translate = getTranslate({ scale, minScale, maxScale });
    const translateX = translate({
      pos: originX,
      prevPos: state.transformation.originX,
      translate: state.transformation.translateX,
    });
    const translateY = translate({
      pos: originY,
      prevPos: state.transformation.originY,
      translate: state.transformation.translateY,
    });

    state.element.style.transformOrigin = `${newOriginX}px ${newOriginY}px`;
    state.element.style.transform = getMatrix({
      scale: newScale,
      translateX,
      translateY,
    });
    state.transformation = {
      originX: newOriginX,
      originY: newOriginY,
      translateX,
      translateY,
      scale: newScale,
    };
  },
});

const renderer: (props: {
  minScale: number;
  maxScale: number;
  element: HTMLElement;
  scaleSensitivity: number;
}) => {
  zoom: (props: { x: number; y: number; deltaScale: number }) => void;
  panBy: ({ originX, originY }: { originX: any; originY: any }) => any;
  panTo: ({
    originX,
    originY,
    scale,
  }: {
    originX: any;
    originY: any;
    scale: any;
  }) => void;
} = ({ minScale, maxScale, element, scaleSensitivity = 10 }) => {
  const state = {
    element,
    minScale,
    maxScale,
    scaleSensitivity,
    transformation: {
      originX: 0,
      originY: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
  };
  return Object.assign({}, makeZoom(state), makePan(state));
};

export default renderer;
