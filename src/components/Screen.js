import React from 'react';
import Sprite from './Sprite';
import ReactResizeDetector from 'react-resize-detector';
import './Screen.css'

const Screen = ({sprites, scale='auto', width=null, height=null, showOverflow=false, hostHeight, hostWidth, overlays=null}) => {
  // no area = no render
  if (!hostHeight || !hostWidth) return (<div/>);

  // can't 'show overflow' if scale isn't auto
  showOverflow = showOverflow && (scale === 'auto');

  // if neither height, width, nor scale are specified, just set scale to 1
  if (scale === 'auto' && !width && !height) scale = 1;

  // discover scale
  let transform = 1; // css scale: transform(x)
  if (scale === 'auto') {
    const logicalScale = Math.min(
      width? (hostWidth/width) : Infinity,
      height? (hostHeight/height) : Infinity
    );
    scale = Math.floor(logicalScale);
    transform = logicalScale / scale;
  }

  // determine automatic height/width
  if (!height || showOverflow) height = Math.floor(hostHeight/scale);
  if (!width || showOverflow) width = Math.floor(hostWidth/scale);

  const style = {
    backgroundColor: 'blue',
    overflow: 'hidden',
    position: 'relative',
    width: width*scale,
    height: height*scale,
    transform: `scale(${transform})`
  }

  return (
    <div className="cancan-wrapper">
      <div className="cancan-panel" style={style}>
        {sprites.map(sprite => (<Sprite {...sprite} scale={scale}/>))}
      </div>
      {overlays()}
    </div>
  );
};
 
export default (props) => (
  <ReactResizeDetector handleWidth handleHeight refreshMode="throttle" refreshRate={15} render={({width, height}) => (
    <Screen {...props} hostHeight={height} hostWidth={width}/>
  )}/>
);