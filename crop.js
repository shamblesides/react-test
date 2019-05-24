import { memoize } from './util/memoize.js';
import { makeCanvas } from './util/make-canvas.js';

const cropCanvas = memoize(function cropCanvas(edgesStr, inputCanvas) {
    const {top=0,bottom=0,left=0,right=0} = JSON.parse(edgesStr);
    const [canvas, ctx] = makeCanvas(inputCanvas.width - left - right, inputCanvas.height - top - bottom);

    ctx.drawImage(inputCanvas, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    return canvas;
});

export function crop(edges) {
    return (canvas) => cropCanvas(JSON.stringify(edges), canvas)
}