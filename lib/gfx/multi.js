import { Drawable } from './drawable';
import { makeCanvas } from '../util/make-canvas';

const lazyUniq = (arr) => arr.length > 20 ? [...arr.reduce((set,x) => set.add(x), new Set)]: arr;

export default (width, height, sprites=null) => {
    const [canvas, ctx] = makeCanvas(width, height);

    let promise;
    function wait() {
        return promise = promise || Promise.all(
            lazyUniq(sprites.filter(s=>s.wait).map(s=>s.wait()))
        ).then(() => {
            sprites.forEach(sprite => sprite.draw(ctx));
        })
    }

    function contents(s) {
        promise = null;
        sprites = s;
    }

    const out = new Drawable({
        wait,
        draw(ctx) {
            ctx.drawImage(canvas, this.x, this.y);
        },
    });
    out.contents = contents;
    return out;
}
