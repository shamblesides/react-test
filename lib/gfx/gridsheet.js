import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';
import { drawable } from './drawable';

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const [canvas, context] = makeCanvas(img.width, img.height);
            context.drawImage(img, 0, 0);
            resolve(canvas);
        };
        img.onerror = reject;
        img.src = src;
    });
}

export function img(src) {
    let canvas;
    const promise = loadImage(src).then(c => canvas = c);
    return new drawable(
        () => promise,
        () => canvas,
    );
}

const createSpriteCanvas = memoize(function createSpriteCanvas(img, width, height, sprite=0) {
    width = width || img.width;
    height = height || img.height;

    const numCols = Math.floor(img.width/width);

    const left = (sprite % numCols) * width;
    const top = Math.floor(sprite / numCols) * height;
    
    const [canvas, context] = makeCanvas(width, height)
    context.drawImage(img, left, top, width, height, 0, 0, width, height);
    return canvas;
});

export function gridSheet(img, width, height) {
    const sprite = (n, ...transforms) => drawable(
        img.wait,
        function() {
            const sheetCanvas = img.canvas();

            const out = transforms.reduce(
                (canvas, t) => t(canvas, sheetCanvas),
                createSpriteCanvas(sheetCanvas, width, height, n)
            );
            return out;
        }
    );

    return {
        sprite,
        width,
        height
    };
}