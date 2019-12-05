import { drawable } from './util/drawable.js';
import { makeCanvas } from './util/make-canvas.js';

export function imgFromString(/** @type{String} */rawData) {
    const lines = rawData.trim().split(/\s+/);
    const width = lines[0].length;
    const height = lines.length;
    const data = lines.join('');
    if (!lines.every(line => line.length === width)) {
        throw new Error('imgFromString: jagged input')
    }
    return imgFromArray(width, height, data);
}

export function imgFromArray(/** @type{number} */width, /** @type{number} */height, /** @type{Array<string>} */data) {
    if (width * height !== data.length) {
        throw new Error('imgFromArray: width*height !== data.length')
    }
    const letters = new Map(
        [...new Set(data)]
        .sort()
        .map((letter, i) => [letter, i])
    );

    const [canvas, ctx] = makeCanvas(width, height);
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
    let canvas;
    return drawable(
        () => canvas,
    );
}