import './Screen.css';
import { ResizeDetector } from './ResizeDetector';
import { drawToContext } from './drawing';

const InnerScreen = ({ sprites, scale='auto', width=null, height=null, showOverflow=false, hostHeight=null, hostWidth=null, fillHost=false, backgroundColor='#000000', children }) => {
    // no area = no render
    if (fillHost && (!hostHeight || !hostWidth)) return (<div />);

    // can't 'show overflow' if scale isn't auto
    // showOverflow = showOverflow && (scale === 'auto');

    // if neither height, width, nor scale are specified, just set scale to 1
    if (scale === 'auto' && !width && !height) scale = 1;

    // determine automatic height/width
    // if (!height || showOverflow) height = Math.floor(hostHeight/realScale);
    // if (!width || showOverflow) width = Math.floor(hostWidth/realScale);

    const wrapperClass = fillHost ? 'cancan-wrapper cancan-wrapper-fill' : 'cancan-wrapper cancan-wrapper-inline';

    const canvasStyle = {
        width: (scale === 'auto') ? '100%' : width*scale,
        height: (scale === 'auto') ? '100%' : height*scale,
        objectFit: 'contain',
        backgroundColor: 'black',
    };

    const ref = canvas => {
        if (!canvas) return;
        const tmpCanvas = document.createElement('canvas');
        const tmpCtx = tmpCanvas.getContext('2d', { alpha: false });
        tmpCtx.fillStyle = backgroundColor;
        tmpCtx.fillRect(0, 0, width, height);
        sprites.forEach(sprite => drawToContext(tmpCtx, sprite));

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.drawImage(tmpCanvas, 0, 0);
    };

    return (
        <div className={wrapperClass}>
            <canvas ref={ref} width={width} height={height} style={canvasStyle} />
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
