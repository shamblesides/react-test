/** @module pxcan/flip */
import { memoize } from './util/memoize.js';
import { makeCanvas } from './util/make-canvas.js';

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

/**
 * flip - Transformer that can flip a canvas vertically and horizontally, or clockwise at 90 degree intervals.
 * 
 * This takes one argument, a string that shows how the sprite should be flipped. This string should comprise
 * of zero or more of the following characters:
 * 
 * * 'h' - flips horizontally
 * * 'v' - flips vertically
 * * 'c' - rotates clockwise by 90 degrees
 * 
 * The operations specified by the characters in this string are executed in order.
 * 
 * For example, `flip('hccc')` will first flip the sprite horizontally, and then it will rotate the sprite
 * 90 degrees clockwise, three times.
 * 
 * @param {string} flip - How to flip the image
 * @returns {function(HTMLCanvasElement): HTMLCanvasElement} Transform function
 */
export function flip(flip) {
    return (canvas) => flipCanvas(canvas, flip);
}
