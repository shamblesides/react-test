import { getImage, loadSheet } from './images';
import { memoize } from './memoize';

export const sprite = (sheet, sprite, ...transforms) => {
    return {
        at: (x, y) => ({
            ready() {
                return loadSheet(sheet);
            },
            draw(ctx) {
                const image = getImage(sheet, sprite, ...transforms);

                const left = Math.floor(x - (sheet.originX || 0));
                const top = Math.floor(y - (sheet.originY || 0));
                ctx.drawImage(image, left, top);
            }
        })
    };
};

export const multi = (width, height, sprites) => {
    const ready = memoize(function ready() {
        const promises = sprites.reduce((set, s) => {
            if (s.ready) {
                return set.add(s.ready());
            } else {
                return set;
            }
        }, new Set());
        return Promise.all([...promises]).then(() => {});
    });
    const getCompositeCanvas = memoize(function getCompositeCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        sprites.forEach(sprite => sprite.draw(ctx));

        return canvas;
    });

    return {
        at: (x, y) => ({
            ready,
            draw(ctx) {
                const image = getCompositeCanvas();
                ctx.drawImage(image, x, y);
            }
        })
    };
}

export const fill = (color, x, y, width, height) => ({
    draw(ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x || 0, y || 0, width || ctx.canvas.width, height || ctx.canvas.height);
    }
});
