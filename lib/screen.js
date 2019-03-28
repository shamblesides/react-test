import { drawToContext } from './drawing';

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

export function screen({ scale='auto', width=null, height=null, backgroundColor='#000000' }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const canvasProps = { width, height, className: 'cancan' };
    for (const prop in canvasProps) {
        if (prop != null) canvas[prop] = canvasProps[prop];
    }

    // decide whether to show as an inline element, or to fill its host element completely
    canvas.style.cssText = canvasCss + (
        (scale !== 'auto' && width > 0 && height > 0) ?
            `display: inline; width: ${width*scale}px; height: ${height*scale}px;` :
            'display: block; width: 100%; height: 100%;'
        );

    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d', { alpha: false });

    function updateScreen({ sprites=[] }) {
        tmpCtx.fillStyle = backgroundColor;
        tmpCtx.fillRect(0, 0, width, height);
        sprites.forEach(sprite => drawToContext(tmpCtx, sprite));

        ctx.drawImage(tmpCanvas, 0, 0);
    }

    return { el: canvas, updateScreen };
}
