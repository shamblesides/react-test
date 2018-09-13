import { screen } from './screen';
import { loadSheets } from './images';
import { pad as padFactory } from './pad';

export function game({ binds={}, gameloop=null, sheets, width=null, height=null, scale='auto', backgroundColor='#000' }) {
    const { elementAttributes, pad } = padFactory(binds);
    const { el, updateScreen } = screen({ scale, width, height, backgroundColor, ...elementAttributes });
    let destroyed = false;
    let state = { pad, gameloop };

    function loop() {
        window.requestAnimationFrame(() => {
            if (destroyed) return;
            if (state.gameloop) state = { ...state, ...state.gameloop(state) };
            updateScreen({ sprites: state.sprites });
            if (state.gameloop) loop();
        });
    }

    function destroy() {
        destroyed = true;
    }

    loadSheets(sheets).then(() => loop());

    return { el, destroy };
}
