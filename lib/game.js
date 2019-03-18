import { screen } from './screen';
import { loadSheets } from './images';
import { pad as padFactory } from './pad';
import { pointer as pointerFactory } from './pointer';

export function game({ binds={}, gameloop=null, sheets, width=null, height=null, scale='auto', backgroundColor='#000', frameSkip=1 }) {
    const { el, updateScreen } = screen({ scale, width, height, backgroundColor });
    const pad = padFactory(el, binds);
    const pointer = pointerFactory(el);

    let destroyed = false;
    let state = { pad, pointer, gameloop };

    let frameNum = 0;

    function loop() {
        window.requestAnimationFrame(() => {
            if (destroyed) return;

            const oldGameloop = state.gameloop;

            if (state.gameloop) state = { ...state, ...state.gameloop(state) };
            if (frameNum++ % frameSkip === 0) updateScreen({ sprites: state.sprites });

            if (oldGameloop !== state.gameloop) {
                pointer.reset();
            }

            if (state.gameloop) loop();
        });
    }

    function destroy() {
        destroyed = true;
    }

    loadSheets(sheets).then(() => loop());

    return { el, destroy };
}
