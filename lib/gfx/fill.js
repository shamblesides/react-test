import { Drawable } from './drawable';

export default (color, x, y, width, height) => new Drawable({
    x,
    y,
    draw(ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x || 0, this.y || 0, width || ctx.canvas.width, height || ctx.canvas.height);
    }
});

