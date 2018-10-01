export function pad(binds) {
    let state = {};
    Object.keys(binds).forEach(button => {
        state[button] = { pressed: false };
    });

    const bindEntries = Object.keys(binds).map((key) => [key, binds[key]]);

    return {
        elementAttributes: {
            onkeydown(event) {
                const entry = bindEntries.find(([_,arr]) => arr.includes(event.key));
                if (!entry) return;
                const [button] = entry;
                if (!state[button].pressed) {
                    state = { ...state, [button]: { ...state[button], pressed: true, justPressed: true } };
                }
            },
            onkeyup(event) {
                const entry = bindEntries.find(([_,arr]) => arr.includes(event.key));
                if (!entry) return;
                const [button] = entry;
                if (state[button].pressed) {
                    state = { ...state, [button]: { ...state[button], pressed: false, justReleased: true } };
                }
            },
            tabIndex: 0,
        },
        pad: {
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
        },
    };
}
