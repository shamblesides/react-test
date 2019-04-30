import { getImage, loadSheet } from './images';
import { memoize } from './memoize';

class Drawable {
    constructor({ wait, draw, x=0, y=0 }) {
        this.wait = wait;
        this.draw = draw;
        this.x = x;
        this.y = y;
    }

    at(x, y) {
        const { wait, draw } = this;
        return new Drawable({ wait, draw, x, y });
    }

    move(px, py) {
        const { wait, draw } = this;
        const x = this.x + px;
        const y = this.y + py;
        return new Drawable({ wait, draw, x, y });
    }
}

export const sprite = (sheet, sprite, ...transforms) => {
    return new Drawable({
        wait() {
            return loadSheet(sheet);
        },
        draw(ctx) {
            const image = getImage(sheet, sprite, ...transforms);

            const left = Math.floor(this.x - (sheet.originX || 0));
            const top = Math.floor(this.y - (sheet.originY || 0));
            ctx.drawImage(image, left, top);
        }
    });
};

export const multi = (width, height, sprites) => {
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

export const fill = (color, x, y, width, height) => new Drawable({
    x,
    y,
    draw(ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x || 0, this.y || 0, width || ctx.canvas.width, height || ctx.canvas.height);
    }
});

// word wrap function by james padolsey
// modified from original
// http://james.padolsey.com/javascript/wordwrap-for-javascript/
function wordwrap(str, width = 80, maxLines = Infinity) {
    const regex = RegExp('.{0,' +width+ '}(\\s|$)|.{' +width+ '}|.+$', 'g');
    let lines = str.match(regex).slice(0, maxLines);
    if (lines[lines.length-1] === '') lines = lines.slice(0, lines.length-1);
    return lines.map(line => line.trim()).join('\n').split('\n');
}

export const letters = memoize((font, str, maxCols=Infinity, maxRows=Infinity) => {
    const lines = wordwrap(str, maxCols, maxRows);

    const w = font.spriteWidth;
    const h = font.spriteHeight;

    const cols = Math.max(...lines.map(line => line.length));
    const rows = lines.length;

    const letters = lines.map(
        (line, row) => line
            .split('')
            .map(letter => letter.charCodeAt(0) - 32)
            .map((s, col) => sprite(font, s).at(col*w, row*h))
    ).reduce((arr, x) => arr.concat(x));

    const asMulti = multi(w*cols, h*rows, letters);

    return {
        separately() {
            return { cols, rows, letters };
        },
        single() {
            return asMulti;
        }
    }
});
