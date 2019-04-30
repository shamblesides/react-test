import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

const getFlip = memoize(function getFlip(args) {
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
});

const flipCanvas = memoize(function flipCanvas(sourceCanvas, flipArgs) {
    const { xflip, yflip, cwrot } = getFlip(flipArgs);
    const { width, height } = sourceCanvas;
    const [a, b] = [
        width*+xflip - width*+(xflip) + width*+(cwrot),
        height*+yflip - height*+yflip,
    ];
    const [left, top] = cwrot ? [b, -a] : [a, b];
    
    const [canvas, ctx] = makeCanvas(width, height);

    ctx.save();

    if (cwrot || xflip || yflip) {
        ctx.setTransform(
            +!cwrot && (xflip?-1:1),
            +cwrot && (yflip?-1:1),
            +cwrot && (xflip?1:-1),
            +!cwrot && (yflip?-1:1),
            width*(+xflip),
            height*(+yflip)
        );
    }

    ctx.drawImage(sourceCanvas, left, top);

    if (cwrot || xflip || yflip) {
        ctx.restore();
    }
    
    return canvas;
});

export default (flip) => (canvas) => flipCanvas(canvas, flip);
