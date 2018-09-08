import './Screen.css';
import { ResizeDetector } from './ResizeDetector';
import { getImage } from './images';

function getFlip(args) {
    let xflip = false, yflip = false, cwrot = false;
    (args || '')
        .replace('90','c')
        .replace('180','xy')
        .replace('270','xy')
        .split('')
        .forEach(flip => {
            if (flip === 'x' || flip === 'h') xflip = !xflip;
            else if (flip === 'y' || flip === 'v') yflip = !yflip;
            else if (flip === 'c') {
                if (cwrot) {
                    xflip = !xflip;
                    yflip = !yflip;
                }
                cwrot = !cwrot;
                [xflip, yflip] = [yflip, xflip];
            }
        });

    return { xflip, yflip, cwrot };
}

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

    const ref = canvas => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        sprites.forEach(({ sheet, sprite, x, y, flip }) => {
            const image = getImage({ sheet, sprite, scale: 1 });
            const { xflip, yflip, cwrot } = getFlip(flip);
            const [a, b] = [
                width*+xflip + Math.floor(x)*(xflip?-1:1) - (sheet.originX||0)*(xflip?-1:1) - image.width*+(xflip) + image.width*+(cwrot),
                height*+yflip + Math.floor(y)*(yflip?-1:1) - (sheet.originY||0)*(yflip?-1:1) - image.height*+yflip,
            ];
            const [left, top] = cwrot ? [b, -a] : [a, b];
            
            ctx.save();
            ctx.setTransform(
                +!cwrot && (xflip?-1:1),
                +cwrot && (yflip?-1:1),
                +cwrot && (xflip?1:-1),
                +!cwrot && (yflip?-1:1),
                canvas.width*(+xflip),
                canvas.height*(+yflip)
            );

            ctx.drawImage(image, left, top);

            ctx.restore();
        });
    };

    return (
        <div className={wrapperClass}>
            <div className="cancan-panel" style={panelStyle}>
                <canvas ref={ref} width={width} height={height} style={{ width: width * scale, height: height * scale }} />
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
