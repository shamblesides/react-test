import { makeCanvas } from "./util/make-canvas";

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
    const [canvas, ctx] = makeCanvas(width, height, false);
    ctx.globalCompositeOperation = 'copy';

    setCanvasStyle(canvas, scale, width, height);

    const [tmpCanvas, tmpCtx] = makeCanvas(width, height, false);

    function update(sprites) {
        return Promise.all(
            // wait for all sprites to be ready to be drawn
            sprites.map(sprite => sprite.wait && sprite.wait())
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
