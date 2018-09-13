import './screen.css';
import { drawToContext } from './drawing';

export function screen({ scale='auto', width=null, height=null, backgroundColor='#000000', onkeydown=null, onkeyup=null, tabIndex=null }) {
    const canvas = document.createElement('canvas');
    const canvasProps = { width, height, className: 'cancan', onkeydown, onkeyup, tabIndex };
    for (const prop in canvasProps) {
        if (prop != null) canvas[prop] = canvasProps[prop];
    }

    // decide whether to show as an inline element, or to fill its host element completely
    canvas.style.cssText = (scale !== 'auto' && width > 0 && height > 0) ?
        `display: inline; width: ${width*scale}px; height: ${height*scale}px;` :
        'display: block; width: 100%; height: 100%;';

    function updateScreen({ sprites=[] }) {
        const tmpCanvas = document.createElement('canvas');
        const tmpCtx = tmpCanvas.getContext('2d', { alpha: false });
        tmpCtx.fillStyle = backgroundColor;
        tmpCtx.fillRect(0, 0, width, height);
        sprites.forEach(sprite => drawToContext(tmpCtx, sprite));

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.drawImage(tmpCanvas, 0, 0);
    }

    return { el: canvas, updateScreen };
}
