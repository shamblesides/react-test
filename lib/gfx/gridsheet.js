import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';
import { drawable } from './drawable';
import { img } from './img';

const createSpriteCanvas = memoize(function createSpriteCanvas(sheetCanvas, width, height, sprite=0) {
    width = width || sheetCanvas.width;
    height = height || sheetCanvas.height;

    const numCols = Math.floor(sheetCanvas.width/width);

    const left = (sprite % numCols) * width;
    const top = Math.floor(sprite / numCols) * height;
    
    const [canvas, context] = makeCanvas(width, height)
    context.drawImage(sheetCanvas, left, top, width, height, 0, 0, width, height);
    return canvas;
});

export function gridSheet(sheet, width, height) {
    if (typeof sheet === 'string') sheet = img(sheet);

    const sprite = (n, ...transforms) => drawable(
        sheet.wait,
        function() {
            return transforms.reduce(
                (canvas, t) => t(canvas),
                createSpriteCanvas(sheet.canvas(), width, height, n)
            );
        }
    );

    return {
        sprite,
        width,
        height
    };
}