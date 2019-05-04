import { drawable } from './drawable';

export function fill(color, x, y, width, height) {
    return drawable(null, function(ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x || 0, this.y || 0, width || ctx.canvas.width, height || ctx.canvas.height);
    }, x, y);
}
