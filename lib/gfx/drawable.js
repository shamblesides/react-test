export class Drawable {
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

