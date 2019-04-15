import { drawToContext, readyToDraw } from './drawing';

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

function setCanvasSize(canvas, scale, width, height) {
    if (height != null) canvas.height = height;
    if (width != null) canvas.width = width;

    // decide whether to show as an inline element, or to fill its host element completely
    const inline = (scale !== 'auto' && width > 0 && height > 0);
    canvas.style.display = inline ? 'inline' : 'block';
    canvas.style.width = inline ? `${width*scale}px` : '100%';
    canvas.style.height = inline ? `${height*scale}px` : '100%';
}

export function screen({ scale='auto', width=null, height=null, backgroundColor='#000000' }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    canvas.style.cssText = canvasCss;

    setCanvasSize(canvas, scale, width, height);

    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d', { alpha: false });

    function updateScreen({ sprites=[] }) {
        return Promise.all(
            // wait for all sprites to be ready to be drawn
            sprites.map(sprite => readyToDraw(sprite))
        ).then(() => {
            // erase offscreen canvas
            tmpCtx.fillStyle = backgroundColor;
            tmpCtx.fillRect(0, 0, width, height);

            // draw all sprites to offscreen canvas
            sprites.forEach(sprite => drawToContext(tmpCtx, sprite));

            // copy offscreen canvas to onscreen canvas
            ctx.drawImage(tmpCanvas, 0, 0);
        });
    }

    return { el: canvas, updateScreen };
}
