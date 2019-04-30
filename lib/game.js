import { screen } from './screen';
import { attachPad } from './attach/pad';
import { attachPointer } from './attach/pointer';
import { attachLoop } from './attach/loop';

/**
 * Initializes and starts a new game.
 * @param {Object} config - Configuration for this game. All optional, except for 'gameloop'.
 * @param {number} [config.width=160] - Width of the game's canvas, in pixels
 * @param {number} [config.height=144] - Height of the game's canvas, in pixels
 * @param {(number|'auto')} [config.scale='auto'] - Determines how the canvas is upscaled. If a number is provided
 * the canvas will be a fixed size, and will be styled as "display: inline-block". If 'auto' is provided, it will be styled as
 * "display: block" and will attempt to fill its parent element.
 * @param {Object.<string, Array.<string>>} [config.binds=] - An optional hash containing keybinds for this game. They keys of this hash should be descriptive
 * names for what the buttons do. The values should be arrays of strings containing the key codes. For example: `{ "accelerate": ["z", " "], "jump": ["ArrowUp", "w", "j"] }`. If
 * @param {gameFrameCallback} [config.gameloop] - Callback to be executed for each frame.
 * @param {number} [config.frameSkip=0] - Skips rendering some frames to the screen. 0 means do not skip any frames. 1 means skip every other frame. 2 means to skip 2 out of 3 frames,
 * and so on. For aging devices, it might be useful to set this to a value higher than 0. By default, no frames are skipped.
 */
export function game({ width, height, scale, binds, gameloop, frameSkip=0 }) {
    const myScreen = screen({ scale, width, height });

    const pad = binds ? attachPad(myScreen.canvas, binds) : undefined;
    const pointer = attachPointer(myScreen.canvas);

    let frameNum = 0;

    const stopLoop = attachLoop(myScreen, function doFrame() {
        if (!gameloop) return null;

        const buttons = pad.next();
        const touches = pointer.next();

        const { gameloop: nextGameloop, sprites } = gameloop({ buttons, touches });

        if (nextGameloop) {
            gameloop = nextGameloop;
            pointer.reset();
        }

        return (frameNum++ % (frameSkip+1) === 0) && sprites || [];
    });

    return {
        canvas: myScreen.canvas,
        stop: stopLoop,
    };
}

/**
 * @callback gameFrameCallback
 * @param {Object} inputs - A hash containing the current state of the keys and touch interactions with the game canvas.
 * @param {Object.<string, } inputs.buttons - Current state of which buttons are being pressed
 */