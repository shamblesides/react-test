import { Drawable } from './drawable';
import { memoize } from '../util/memoize';

export default (width, height, sprites) => {
    const wait = memoize(function wait() {
        const promises = sprites.reduce((set, s) => {
            if (s.wait) {
                return set.add(s.wait());
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

    return new Drawable({
        wait,
        draw(ctx) {
            const image = getCompositeCanvas();
            ctx.drawImage(image, this.x, this.y);
        },
    });
}
