import { memoizeBy } from '../memoize';
import { makeCanvas } from '../util/make-canvas';

const cropCanvas = memoizeBy([([x])=>[x.top,x.bottom,x.left,x.right].join(','), ([,c])=>c], function cropCanvas({top=0,bottom=0,left=0,right=0}, inputCanvas) {
    const [canvas, ctx] = makeCanvas(inputCanvas.width - left - right, inputCanvas.height - top - bottom);

    ctx.drawImage(inputCanvas, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    return canvas;
});

export default (edges) => (canvas) => cropCanvas(edges, canvas);