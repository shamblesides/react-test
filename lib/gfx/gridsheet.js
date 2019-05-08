import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';
import { drawable } from '../util/drawable';
import { img } from './img';

function spriteFactory(sheetCanvas, width, height) {
    const numCols = Math.floor(sheetCanvas.width/width);

    return memoize(function getSprite(n) {
        const left = (n % numCols) * width;
        const top = Math.floor(n / numCols) * height;
        
        const [canvas, context] = makeCanvas(width, height)
        context.drawImage(sheetCanvas, left, top, width, height, 0, 0, width, height);
        return canvas;
    });
}

export function gridSheet(sheet, width, height) {
    if (typeof sheet === 'string') sheet = img(sheet);

    let getSprite;
    const sprite = (n, ...transforms) => drawable(
        sheet.wait,
        function() {
            getSprite = getSprite || spriteFactory(sheet.canvas(), width, height);
            return transforms.reduce((canvas, t) => t(canvas), getSprite(n));
        }
    );

    return {
        sprite,
        width,
        height
    };
}