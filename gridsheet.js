import { memoize } from './util/memoize.js';
import { makeCanvas } from './util/make-canvas.js';
import { drawable } from './util/drawable.js';
import { img } from './img.js';

function spriteFactory(sheetCanvas, width, height) {
    const numCols = Math.floor(sheetCanvas.width/width);

    return function getSprite(n) {
        const left = (n % numCols) * width;
        const top = Math.floor(n / numCols) * height;
        
        const [canvas, context] = makeCanvas(width, height)
        context.drawImage(sheetCanvas, left, top, width, height, 0, 0, width, height);
        return canvas;
    }
}

export function gridSheet(sheet, width, height) {
    if (typeof sheet === 'string') sheet = img(sheet);

    let getSprite;
    const sprite = memoize(function sprite(n) {
        return drawable(
            sheet.wait,
            memoize(function canvas() {
                getSprite = getSprite || spriteFactory(sheet.canvas(), width, height);
                return getSprite(n);
            })
        );
    });

    return {
        sprite,
        width,
        height
    };
}