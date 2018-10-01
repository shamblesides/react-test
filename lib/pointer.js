export function pointer() {
    let touches = [];

    return {
        elementAttributes: {
            onmousedown(event) {
                touches = [ ...touches, { justPressed: true, isMouse: true } ];
            },
            ontouchstart(event) {
                touches = [ ...touches, { justPressed: true, isMouse: false } ];
            },
            oncontextmenu(event) {
                event.preventDefault();
            },
        },
        windowAttributes: {
            onmousemove(event) {
                // console.log(event);
            },
            onmouseup(event) {
                touches = touches.filter(touch => !touch.isMouse);
            },
        },
        pointer: {
            next: () => {
                const oldTouches = touches;
                touches = touches.map(touch => {
                    if (!touch.justPressed && !touch.justReleased) return touch;
                    touch = { ... touch };
                    delete touch.justPressed;
                    delete touch.justReleased;
                    return touch;
                })
                return oldTouches;
            },
        },
    };
}
