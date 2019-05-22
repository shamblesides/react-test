import { makeCanvas } from "./util/make-canvas";
import {pane} from './gfx/pane';

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

export function pxcan({ width=160, height=144, scale='auto', fps=60 }, attachments, gameloop) {
    // make canvas that will be displayed
    const [canvas, ctx] = makeCanvas(width, height, false);
    ctx.globalCompositeOperation = 'copy';
    canvas.style.cssText = canvasCss;
    // decide whether to show as an inline element, or to fill its host element completely
    const inline = (scale !== 'auto' && width > 0 && height > 0);
    canvas.style.display = inline ? 'inline' : 'block';
    canvas.style.width = inline ? `${width*scale}px` : '100%';
    canvas.style.height = inline ? `${height*scale}px` : '100%';

    // function to update the canvas
    const [tmpCanvas,tmpCtx] = makeCanvas(width, height, false);
    function update(sprites) {
        return pane(width, height, sprites, tmpCtx).wait()
            .then(() => ctx.drawImage(tmpCanvas, 0, 0))
    }

    // configure properties of objects that will be passed into each frame
    const stateModifiers = attachments.map(a => a(canvas));
    function getFrameArgs() {
        return stateModifiers
            .map(m => m.next())
            .reduce((state, o) => ({ ...(state || {}), ...o }), undefined)
    }

    // loop
    let lastTimestamp = null;
    window.requestAnimationFrame(function loop(timestamp) {
        // if "lastTimestamp" is not yet set, use now
        if (lastTimestamp == null) lastTimestamp = timestamp;
        // if "lastTimestamp" has fallen more than 3 frames behind, catch it up
        lastTimestamp = Math.max(lastTimestamp, timestamp - (1000/fps)*3)

        // get all the sprites for all the frames we're going to render (usually just 1)
        let frameSprites = [];
        for (; lastTimestamp <= timestamp; lastTimestamp += (1000/fps)) {
            if (!gameloop) break;

            const { gameloop: nextGameloop, sprites } = gameloop(getFrameArgs());

            if (nextGameloop) {
                gameloop = nextGameloop;
                stateModifiers.forEach(m => m.reset());
            }

            if (sprites) frameSprites.push(...sprites);
        }

        // stop if game is over
        if (!gameloop && frameSprites.length === 0) return;

        // TODO if multiple frames were rendered, remove everything before the last "clear screen"

        // render and repeat
        if (frameSprites.length > 0) {
            update(frameSprites).then(() => window.requestAnimationFrame(loop));
        } else {
            window.requestAnimationFrame(loop);
        }
    });

    return {
        canvas,
        fullscreen() {
            document.querySelector('html').style.height = '100%'
            document.body.style.cssText = 'margin:0;height:100%';
            document.body.appendChild(canvas);
            canvas.focus();
        },
        stop() {
            gameloop = null
        },
    };
}
