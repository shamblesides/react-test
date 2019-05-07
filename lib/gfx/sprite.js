import { drawable } from './drawable';
import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

const imgs = new Map(); // src -> canvas

function imgToCanvas(img) {
    const [canvas, context] = makeCanvas(img.width, img.height);
    context.drawImage(img, 0, 0);
    return canvas;
}

const loadImage = memoize(function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imgs.set(src, imgToCanvas(img));
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    });
});

const createSpriteCanvas = memoize(function createSpriteCanvas(
    img, width=img.width, height=img.height, sprite=0
) {
    const numCols = Math.floor(img.width/width);

    const left = (sprite % numCols) * width;
    const top = Math.floor(sprite / numCols) * height;
    
    const [canvas, context] = makeCanvas(width, height)
    context.drawImage(img, left, top, width, height, 0, 0, width, height);
    return canvas;
});

export function sprite({ src, spriteWidth, spriteHeight }, sprite, ...transforms) {
    return drawable(
        () => loadImage(src),
        function(ctx) {
            const sheetCanvas = imgs.get(src);

            const canvas = transforms.reduce(
                (canvas, t) => t(canvas, sheetCanvas),
                createSpriteCanvas(sheetCanvas, spriteWidth, spriteHeight, sprite)
            );

            const left = Math.floor(this.x);
            const top = Math.floor(this.y);
            ctx.drawImage(canvas, left, top);
        }
    );
}
