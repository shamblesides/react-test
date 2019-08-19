import { makeCanvas } from './util/make-canvas.js';
import {pane} from './pane.js';

export function pxcan({ width=160, height=144, fps=60 }, attachments, gameloop) {
    // make canvas that will be displayed
    const [canvas, ctx] = makeCanvas(width, height, false);
    ctx.globalCompositeOperation = 'copy';
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        // firefox doesn't support 'pixelated'
        canvas.style.imageRendering = '-moz-crisp-edges';
    } else {
        canvas.style.imageRendering = 'pixelated';
    }
    canvas.style.msInterpolationMode = 'nearest-neighbor';

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
        stop() {
            gameloop = null
        },
    };
}
