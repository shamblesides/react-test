import { drawable } from '../util/drawable';
import { makeCanvas } from '../util/make-canvas';

const lazyUniq = (arr) => arr.length > 20 ? [...arr.reduce((set,x) => set.add(x), new Set)]: arr;

export function multi(width, height, sprites, context2d=makeCanvas(width, height)[1]) {
    let promise;
    function wait() {
        return promise = promise || Promise.all(
            lazyUniq(sprites.filter(s=>s.wait).map(s=>s.wait()))
        ).then(() => {
            sprites.forEach(sprite => {
                if (typeof sprite === 'function') sprite(context2d);
                else context2d.drawImage(sprite.canvas(), sprite.x, sprite.y);
            });
        })
    }

    return drawable(wait, () => context2d.canvas);
}
