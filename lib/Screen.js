import './Screen.css';
import { drawToContext } from './drawing';

export const Screen = ({ sprites, scale='auto', width=null, height=null, backgroundColor='#000000', onKeyDown=null, onKeyUp=null, tabIndex=null }) => {
    // decide whether to show as an inline element, or to fill its host element completely
    const staticSize = (scale !== 'auto' && width > 0 && height > 0);

    // if neither height, width, nor scale are specified, just set scale to 1
    if (scale === 'auto' && !width && !height) scale = 1;

    const style = {
        display: staticSize ? 'inline' : 'block',
        width: staticSize ? width * scale : '100%',
        height: staticSize ? height * scale : '100%',
    };

    const ref = canvas => {
        if (!canvas) return;

        const tmpCanvas = document.createElement('canvas');
        const tmpCtx = tmpCanvas.getContext('2d', { alpha: false });
        tmpCtx.fillStyle = backgroundColor;
        tmpCtx.fillRect(0, 0, width, height);
        sprites.forEach(sprite => drawToContext(tmpCtx, sprite));

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.drawImage(tmpCanvas, 0, 0);
    };

    return (
        <canvas {...{ ref, width, height, style, class: 'cancan', onKeyDown, onKeyUp, tabIndex }} />
    );
};
