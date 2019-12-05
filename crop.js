/** @module pxcan/crop */
import { memoize } from './util/memoize.js';
import { makeCanvas } from './util/make-canvas.js';

const cropCanvas = memoize(function cropCanvas(edgesStr, inputCanvas) {
    const {top=0,bottom=0,left=0,right=0} = JSON.parse(edgesStr);
    const [canvas, ctx] = makeCanvas(inputCanvas.width - left - right, inputCanvas.height - top - bottom);

    ctx.drawImage(inputCanvas, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    return canvas;
});

/**
 * crop - Transformer that returns a smaller canvas with edges removed
 * 
 * @param {Object} edges - How much to crop from each edge
 * @param {number} [edges.top=0] - Amount to crop from the top
 * @param {number} [edges.bottom=0] - Amount to crop from the bottom
 * @param {number} [edges.left=0] - Amount to crop from the left
 * @param {number} [edges.right=0] - Amount to crop from the right
 * @returns {function(HTMLCanvasElement): HTMLCanvasElement} Transform function
 */
export function crop(edges) {
    return (canvas) => cropCanvas(JSON.stringify(edges), canvas)
}