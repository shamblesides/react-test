import { drawable } from '../util/drawable';
import { makeCanvas } from '../util/make-canvas';

const lazyUniq = (arr) => arr.length > 20 ? [...arr.reduce((set,x) => set.add(x), new Set)]: arr;

export function multi(width, height, sprites=null) {
    const [canvas, ctx] = makeCanvas(width, height);

    let promise;
    function wait() {
        return promise = promise || Promise.all(
            lazyUniq(sprites.filter(s=>s.wait).map(s=>s.wait()))
        ).then(() => {
            sprites.forEach(sprite => {
                if (typeof sprite === 'function') sprite(ctx);
                else ctx.drawImage(sprite.canvas(), sprite.x, sprite.y);
            });
        })
    }

    function contents(s) {
        promise = null;
        sprites = s;
    }

    const out = drawable(wait, () => canvas);
    out.contents = contents;
    return out;
}
