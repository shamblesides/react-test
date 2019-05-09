import { makeCanvas } from "./util/make-canvas";
import {multi} from './gfx/multi';

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

export function pxcan({ width=160, height=144, scale='auto', frameSkip=0 }, attachments, gameloop) {
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
    const [,tmpCtx] = makeCanvas(width, height, false);
    function update(sprites) {
        const pane = multi(width, height, sprites, tmpCtx);
        return pane.wait().then(() => ctx.drawImage(pane.canvas(), 0, 0))
    }

    // configure properties of objects that will be passed into each frame
    const stateModifiers = attachments.map(a => a(canvas));
    function getFrameArgs() {
        return stateModifiers
            .map(m => m.next())
            .reduce((state, o) => ({ ...(state || {}), ...o }), undefined)
    }

    // loop
    let frameNum = 0;
    function loop() {
        window.requestAnimationFrame(() => {
            if (!gameloop) return;

            const { gameloop: nextGameloop, sprites } = gameloop(getFrameArgs());

            if (nextGameloop) {
                gameloop = nextGameloop;
                stateModifiers.forEach(m => m.reset());
            }

            if (frameNum++ % (frameSkip+1) === 0 && sprites && sprites.length > 0) {
                update(sprites).then(loop);
            } else {
                loop();
            }
        });
    };
    loop();

    return {
        canvas,
        fullscreen() {
            document.querySelector('html').style.height = '100%'
            document.body.style.cssText = 'margin:0;height:100%';
            document.body.appendChild(canvas);
        },
        stop() {
            gameloop = null
        },
    };
}
