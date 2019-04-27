import { screen } from './screen/screen';
import { attachPad } from './pad';
import { attachPointer } from './pointer';

export function game({ binds={}, gameloop=null, width=160, height=144, scale='auto', backgroundColor='#000', frameSkip=0 }) {
    const { canvas, update } = screen({ scale, width, height, backgroundColor });
    const pad = attachPad(canvas, binds);
    const pointer = attachPointer(canvas);

    let destroyed = false;
    let state = { pad, pointer, gameloop };

    let frameNum = 0;

    function loop() {
        window.requestAnimationFrame(() => {
            if (destroyed) return;

            const oldGameloop = state.gameloop;

            if (state.gameloop) state = { ...state, ...state.gameloop(state) };

            const doneDrawing = (frameNum++ % (frameSkip+1) === 0) ?
                update(state.sprites) :
                Promise.resolve();

            doneDrawing.then(() => {
                if (oldGameloop !== state.gameloop) {
                    pointer.reset();
                }

                if (state.gameloop) loop();
            })
        });
    }

    function destroy() {
        destroyed = true;
    }

    loop();

    return { canvas, destroy };
}
