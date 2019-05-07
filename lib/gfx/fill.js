export const fill = (color, x, y, width, height) => (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(x || 0, y || 0, width || ctx.canvas.width, height || ctx.canvas.height);
}
