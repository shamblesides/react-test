const canvasCss = `
object-fit: contain;
object-position: center top;
touch-action: none;
background-color: black;
image-rendering: optimizeSpeed;
image-rendering: -moz-crisp-edges;
image-rendering: -o-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: pixelated;
image-rendering: optimize-contrast;
-ms-interpolation-mode: nearest-neighbor;`;

function setCanvasStyle(canvas, scale, width, height) {
    canvas.style.cssText = canvasCss;
    // decide whether to show as an inline element, or to fill its host element completely
    const inline = (scale !== 'auto' && width > 0 && height > 0);
    canvas.style.display = inline ? 'inline' : 'block';
    canvas.style.width = inline ? `${width*scale}px` : '100%';
    canvas.style.height = inline ? `${height*scale}px` : '100%';
}

export function screen({ scale='auto', width=160, height=144 }) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.globalCompositeOperation = 'copy';

    setCanvasStyle(canvas, scale, width, height);

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    const tmpCtx = tmpCanvas.getContext('2d', { alpha: false });

    function update(sprites) {
        return Promise.all(
            // wait for all sprites to be ready to be drawn
            sprites.map(sprite => sprite.ready && sprite.ready())
        ).then(() => {
            // draw all sprites to offscreen canvas
            sprites.forEach(sprite => sprite.draw(tmpCtx));

            // copy offscreen canvas to onscreen canvas
            ctx.drawImage(tmpCanvas, 0, 0);
        });
    }

    const at = (x, y) => ({
        draw(ctx) {
            ctx.drawImage(canvas, x, y);
        }
    })

    return { canvas, update, at };
}

export { sprite, fill, multi } from './drawing';

export { flip } from './flip';

export { recolor } from './recolor';

export { crop } from './crop';
