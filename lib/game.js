import { screen } from './screen';
import { loadSheets } from './images';
import { pad as padFactory } from './pad';
import { pointer as pointerFactory } from './pointer';

export function game({ binds={}, gameloop=null, sheets, width=null, height=null, scale='auto', backgroundColor='#000' }) {
    const { pad, ...padStuff } = padFactory(binds);
    const { pointer, ...pointerStuff } = pointerFactory();
    const { el, updateScreen } = screen({ scale, width, height, backgroundColor, ...padStuff.elementAttributes, ...pointerStuff.elementAttributes });
    for (const attr in pointerStuff.windowAttributes) {
        window[attr] = pointerStuff.windowAttributes[attr];
    }
    let destroyed = false;
    let state = { pad, pointer, gameloop };

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
