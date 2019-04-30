import { screen } from './screen/screen';
import { attachPad } from './pad';
import { attachPointer } from './pointer';
import { attachLoop } from './loop';

export function game({ width, height, scale, binds, gameloop, frameSkip=0 }) {
    const myScreen = screen({ scale, width, height });

    const pad = binds ? attachPad(myScreen.canvas, binds) : undefined;
    const pointer = attachPointer(myScreen.canvas);

    let frameNum = 0;

    const stopLoop = attachLoop(myScreen, function doFrame() {
        if (!gameloop) return null;

        const { gameloop: nextGameloop, sprites } = gameloop({ pad, pointer });

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
