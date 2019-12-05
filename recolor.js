/** @module pxcan/recolor */
import { memoize } from './util/memoize.js';
import { makeCanvas } from './util/make-canvas.js';

const recolorCanvas = memoize(function recolorCanvas(sourceCanvas, colors) {
    colors = colors.split(',');
    const pixelArray = new Uint32Array(sourceCanvas.getContext('2d').getImageData(0,0,sourceCanvas.width,sourceCanvas.height).data.buffer);

    //create sprite
    const [canvas, ctx] = makeCanvas(sourceCanvas.width, sourceCanvas.height);
    let i = 0;
    for (let y = 0; y < sourceCanvas.height; ++y) {
        for (let x = 0; x < sourceCanvas.width; ++x) {
            if (pixelArray[i] & 0xff000000) {
                const bits = pixelArray[i]
                const idx = Math.floor(((bits&255) + (bits>>8&255) + (bits>>16&255))*(colors.length/(255*3+1)));
                ctx.fillStyle = colors[idx];
                ctx.fillRect(x, y, 1, 1);
            }
            ++i;
        }
    }
    
    return canvas;
});

/**
 * recolor - Transformer that can recolor a canvas to conform to a certain palette
 * 
 * This takes one argument, an array of strings, each of which should be a valid CSS color value.
 * 
 * To determine how to recolor the sprite, each pixel's original color value is broken into its
 * individual RGB components, and then summed together. We then create n nearly equally-sized buckets
 * to cover the range of values that these sums may fall into. This determines the index on the
 * provided palette for the replacement color.
 * 
 * Values close to black in original image will map to the first index of the provided array.
 * Values close to white will map to the end of the array.
 * 
 * Completely transparent values on the original image are kept completely transparent. All other
 * pixels are made completely opaque.
 * 
 * @param {string[]} colors - The new palette for the image
 * @returns {function(HTMLCanvasElement): HTMLCanvasElement} Transform function
 */
export function recolor(colors) {
    return (canvas) => recolorCanvas(canvas, colors.join());
}