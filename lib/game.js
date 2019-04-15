import { screen } from './screen';
import { attachPad } from './pad';
import { attachPointer } from './pointer';

export function game({ binds={}, gameloop=null, width=null, height=null, scale='auto', backgroundColor='#000', frameSkip=1 }) {
    const { el, updateScreen } = screen({ scale, width, height, backgroundColor });
    const pad = attachPad(el, binds);
    const pointer = attachPointer(el);

    let destroyed = false;
    let state = { pad, pointer, gameloop };

    let frameNum = 0;

    function loop() {
        window.requestAnimationFrame(() => {
            if (destroyed) return;

            const oldGameloop = state.gameloop;

            if (state.gameloop) state = { ...state, ...state.gameloop(state) };

            const doneDrawing = (frameNum++ % frameSkip === 0) ?
                updateScreen({ sprites: state.sprites }) :
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

    return { el, destroy };
}
