/**
 * Augment the provided HTMLCanvasElement with the provided key bindings.
 * @param {*} canvas 
 * @param {*} binds 
 */
export function attachPad(canvas, binds) {
    const bindEntries = Object.keys(binds).map((key) => [key, binds[key]]);

    let state = {};

    function initState() {
        Object.keys(binds).forEach(button => {
            state[button] = { pressed: false };
        });
    }

    initState();

    canvas.onkeydown = function(event) {
        const entry = bindEntries.find(([,arr]) => arr.includes(event.key));
        if (!entry) return;
        const [button] = entry;
        if (!state[button].pressed) {
            state = { ...state, [button]: { ...state[button], pressed: true, justPressed: true } };
        }
    };
    canvas.onkeyup = function(event) {
        const entry = bindEntries.find(([,arr]) => arr.includes(event.key));
        if (!entry) return;
        const [button] = entry;
        if (state[button].pressed) {
            state = { ...state, [button]: { ...state[button], pressed: false, justReleased: true } };
        }
    };
    canvas.tabIndex = 0;

    return {
        next: () => {
            const oldState = state;
            for (const button in binds) {
                if (state[button].justPressed || state[button].justReleased) {
                    state = { ...state, [button]: { ...state[button] } };
                    delete state[button].justPressed;
                    delete state[button].justReleased;
                }
            }
            return oldState;
        },
        reset: () => initState(),
    };
}
