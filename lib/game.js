import { screen } from './screen';
import { pad as padFactory } from './pad';
import { pointer as pointerFactory } from './pointer';

export function game({ binds={}, gameloop=null, width=null, height=null, scale='auto', backgroundColor='#000' }) {
    const { el, updateScreen } = screen({ scale, width, height, backgroundColor });
    const pad = padFactory(el, binds);
    const pointer = pointerFactory(el);

    let destroyed = false;
    let state = { pad, pointer, gameloop };

    let framesToday = 1;

    function loop() {
        window.requestAnimationFrame(() => {
            if (destroyed) return;

            let start = performance.now();

            const oldGameloop = state.gameloop;

            if (state.gameloop) {
                while (framesToday--) {
                    state = { ...state, ...state.gameloop(state) };
                }
            }

            updateScreen({ sprites: state.sprites }).then(() => {
                if (oldGameloop !== state.gameloop) {
                    pointer.reset();
                }

                framesToday = Math.min(4, Math.ceil((performance.now() - start)*(60/1000)));

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
