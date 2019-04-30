import { memoize, memoizeBy } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

const getRgbToIndexMap = memoize(function getRgbToIndexMap(sheetImagedata) {
    // 0x[alpha][blue][green][red]
    const pixelArray = new Uint32Array(sheetImagedata.data.buffer);

    // get all colors
    const imgColors = new Set();
    Array.prototype.forEach.call(pixelArray, rgba => {
        // ignore transparent
        if ((rgba & 0xff000000) !== 0) {
            imgColors.add(rgba);
        }
    });

    // calculate brightness, sort by brightness, and map to our designated palette
    const imgColorsArray = [];
    imgColors.forEach(value => imgColorsArray.push(value));
    const sheetRgbToIndex = new Map();
    imgColorsArray
        .map((rgba) => {
            const brightness = (rgba & 0xff) + ((rgba & 0xff00)>>8) + ((rgba & 0xff0000)>>16);
            return [rgba, brightness];
        }).sort(([, b1], [, b2]) => b1 - b2)
        .forEach(([rgba], i) => sheetRgbToIndex.set(rgba, i));

    return sheetRgbToIndex;
});

const recolorCanvas = memoizeBy([args=>args[0], args=>args[2].join(',')], function recolorCanvas(sourceCanvas, rgbToIndexMap, colors) {
    const pixelArray = new Uint32Array(sourceCanvas.getContext('2d').getImageData(0,0,sourceCanvas.width,sourceCanvas.height).data.buffer);

    const palette = Array(rgbToIndexMap.size).fill(0).map((_,i) => colors[Math.floor(colors.length / rgbToIndexMap.size * i)]);

    //create sprite
    const [canvas, ctx] = makeCanvas(sourceCanvas.width, sourceCanvas.height);
    let i = 0;
    for (let y = 0; y < sourceCanvas.height; ++y) {
        for (let x = 0; x < sourceCanvas.width; ++x) {
            if ((pixelArray[i] & 0xff000000) !== 0) {
                ctx.fillStyle = palette[rgbToIndexMap.get(pixelArray[i])];
                ctx.fillRect(x, y, 1, 1);
            }
            ++i;
        }
    }
    
    return canvas;
});

export default (colors) => (canvas, sheetImagedata) => recolorCanvas(canvas, getRgbToIndexMap(sheetImagedata), colors);