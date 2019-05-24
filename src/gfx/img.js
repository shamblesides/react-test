import { drawable } from '../util/drawable.js';
import { makeCanvas } from '../util/make-canvas.js';

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
    return drawable(
        () => promise,
        () => canvas,
    );
}