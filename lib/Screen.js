import { Sprite } from './Sprite';
import './Screen.css';
import { ResizeDetector } from './ResizeDetector';

const InnerScreen = ({ sprites, scale='auto', width=null, height=null, showOverflow=false, hostHeight=null, hostWidth=null, fillHost=false, backgroundColor=null, children }) => {
    // no area = no render
    if (fillHost && (!hostHeight || !hostWidth)) return (<div />);

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

    const wrapperClass = fillHost ? 'cancan-wrapper cancan-wrapper-fill' : 'cancan-wrapper cancan-wrapper-inline';

    const panelStyle = {
        backgroundColor,
        overflow: 'hidden',
        position: 'relative',
        width: width*scale,
        height: height*scale,
        transform: `scale(${transform})`,
    };

    return (
        <div className={wrapperClass}>
            <div className="cancan-panel" style={panelStyle}>
                {sprites.map(sprite => (<Sprite {...sprite} scale={scale} />))}
            </div>
            {children}
        </div>
    );
};

export const Screen = (props) => (
    (props.scale >= 1 && props.width && props.height) ? (
        <InnerScreen {...props} />
    ) : (
        <ResizeDetector refreshRate={15}>
            <InnerScreen {...props} fillHost />
        </ResizeDetector>
    )
);
