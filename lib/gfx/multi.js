import { Drawable } from './drawable';
import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

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
        const [canvas, ctx] = makeCanvas(width, height);

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
