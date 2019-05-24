import { drawable } from './util/drawable.js';
import { makeCanvas } from './util/make-canvas.js';

const lazyUniq = (arr) => arr.length > 20 ? [...arr.reduce((set,x) => set.add(x), new Set)]: arr;

export function pane(width, height, sprites, context2d=makeCanvas(width, height)[1]) {
    let promise;
    function wait() {
        return promise = promise || Promise.all(
            lazyUniq(sprites.filter(s=>s.wait).map(s=>s.wait()))
        ).then(() => {
            sprites.forEach(sprite => {
                if (typeof sprite === 'function') sprite(context2d);
                else context2d.drawImage(sprite.canvas(), sprite.x|0, sprite.y|0);
            });
        })
    }

    return drawable(wait, () => context2d.canvas);
}
