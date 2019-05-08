import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

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
                const idx = Math.floor(((bits&255) + (bits>>8&255) + (bits>>16&255))*(colors.length/255/3));
                ctx.fillStyle = colors[idx];
                ctx.fillRect(x, y, 1, 1);
            }
            ++i;
        }
    }
    
    return canvas;
});

export function recolor(colors) {
    return (canvas) => recolorCanvas(canvas, colors.join());
}