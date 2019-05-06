import { drawable } from './drawable';
import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

const imgs = new Map(); // sheet{} -> canvas

function imgToCanvas(img) {
    const [canvas, context] = makeCanvas(img.width, img.height);
    context.drawImage(img, 0, 0);
    return canvas;
}

const loadSheet = memoize(function loadSheet(sheet) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imgs.set(sheet, imgToCanvas(img));
            resolve();
        };
        img.onerror = reject;
        img.src = sheet.src;
    });
});

const createSpriteCanvas = memoize(function createSpriteCanvas(sheet, sprite=0) {
    const img = imgs.get(sheet);
    const width = sheet.spriteWidth || img.width;
    const height = sheet.spriteHeight || img.height;

    const numCols = Math.floor(img.width/width);

    const left = (sprite % numCols) * width;
    const top = Math.floor(sprite / numCols) * height;
    
    const [canvas, context] = makeCanvas(width, height)
    context.drawImage(img, left, top, width, height, 0, 0, width, height);
    return canvas;
});

export function sprite(sheet, sprite, ...transforms) {
    return drawable(
        () => loadSheet(sheet),
        function(ctx) {
            const canvas = transforms.reduce(
                (canvas, t) => t(canvas, imgs.get(sheet)),
                createSpriteCanvas(sheet, sprite)
            );

            const left = Math.floor(this.x - (sheet.originX || 0));
            const top = Math.floor(this.y - (sheet.originY || 0));
            ctx.drawImage(canvas, left, top);
        }
    );
}
