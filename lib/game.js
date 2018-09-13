import { screen } from './screen';
import { loadSheets } from './images';
import { pad as padFactory } from './pad';

export function game({ binds, gameloop, sheets, width=null, height=null, scale='auto' }) {
    const { elementAttributes, pad } = padFactory(binds);
    const backgroundColor = '#45283c';
    const { el, updateScreen } = screen({ scale, width, height, backgroundColor, ...elementAttributes });
    let destroyed = false;
    let state = { pad };

    function loop() {
        if (destroyed) return;
        window.requestAnimationFrame(() => {
            state = { ...state, ...gameloop(state) };
            updateScreen({ sprites: state.sprites });
            loop();
        });
    }

    function destroy() {
        destroyed = true;
    }

    loadSheets(sheets).then(() => loop());

    return { el, destroy };
}
