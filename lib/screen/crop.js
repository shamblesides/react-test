import { memoizeBy } from './memoize';

const cropCanvas = memoizeBy([([x])=>[x.top,x.bottom,x.left,x.right].join(','), ([,c])=>c], function cropCanvas({top=0,bottom=0,left=0,right=0}, inputCanvas) {
    const canvas = document.createElement('canvas');
    canvas.width = inputCanvas.width - left - right;
    canvas.height = inputCanvas.height - top - bottom;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(inputCanvas, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    return canvas;
});

export const crop = (edges) => (canvas) => cropCanvas(edges, canvas);