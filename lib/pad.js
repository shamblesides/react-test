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
                state = { ...state, [button]: { ...state[button], pressed: true } };
            },
            onkeyup(event) {
                const entry = bindEntries.find(([_,arr]) => arr.includes(event.key));
                if (!entry) return;
                const [button] = entry;
                state = { ...state, [button]: { ...state[button], pressed: false } };
            },
            tabIndex: 0,
        },
        pad: {
            next: () => ({ ...state }),
        },
    };
}
