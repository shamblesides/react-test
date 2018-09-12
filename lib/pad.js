export function pad(binds) {
    let state = {};
    Object.keys(binds).forEach(button => {
        state[button] = { pressed: false };
    });

    const bindEntries = Object.entries(binds);

    return {
        elementAttributes: {
            onKeyDown(event) {
                const entry = bindEntries.find(([_,arr]) => arr.includes(event.key));
                if (!entry) return;
                const [button] = entry;
                state = { ...state, [button]: { ...state[button], pressed: true } };
            },
            onKeyUp(event) {
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
