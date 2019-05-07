import { memoizeBy } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

const cropCanvas = memoizeBy([([x])=>[x.top,x.bottom,x.left,x.right,x.width,x.height].join(), ([,c])=>c], function cropCanvas({top=0,bottom=0,left=0,right=0,width=null,height=null}, inputCanvas) {
    if (width == null) width = inputCanvas.width - left - right;
    if (height == null) height = inputCanvas.height - top - bottom;

    const [canvas, ctx] = makeCanvas(width, height);

    ctx.drawImage(inputCanvas, left, top, width, height, 0, 0, width, height);

    return canvas;
});

export function crop(edges) {
    return (canvas) => cropCanvas(edges, canvas)
};