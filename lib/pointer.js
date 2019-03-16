function coords(evt, canvas) {
    const pageX = evt.clientX - (canvas.clientLeft||0) - (canvas.offsetLeft||0) + window.scrollX;
    const pageY = evt.clientY - (canvas.clientTop||0) - (canvas.offsetTop||0) + window.scrollY;

    const upscaling = Math.min(canvas.clientWidth/canvas.width, canvas.clientHeight/canvas.height);

    const { offsetX, offsetY } = (canvas.width/canvas.height > canvas.clientWidth/canvas.clientHeight) ?
        // canvas aspect ratio wider than screen aspect ratio -> leftovers on top and bottom
        { offsetX: 0, offsetY: (canvas.clientHeight - canvas.height*upscaling)/2 } :
        // canvas aspect ratio taller than screen aspect ratio -> leftovers on sides
        { offsetY: 0, offsetX: (canvas.clientWidth - canvas.width*upscaling)/2 };

    return {
        x: Math.floor((pageX - offsetX) / upscaling),
        y: Math.floor((pageY - offsetY) / upscaling),
    };
}

export function pointer() {
    let canvas = null;
    let touches = [];

    return {
        elementAttributes: {
            onmousedown(event) {
                canvas = this;
                // remove previous mouse touches
                touches = touches.filter(t => !t.isMouse);
                // add touch
                const touch = {
                    ...coords(event, canvas),
                    isMouse: true,
                    isRightClick: event.button === 2,
                    justPressed: true,
                }
                touches.push(touch);
            },
            ontouchstart(event) {
                event.preventDefault();
                canvas = this;
                [].forEach.call(event.changedTouches, touchevt => {
                    const touch = {
                        ...coords(touchevt, canvas),
                        isMouse: false,
                        id: touchevt.identifier,
                        // isDrag: false,
                        // justHeld: false,
                        // justClicked: false,
                        justPressed: true,
                    }
                    touches.push(touch);
                })
            },
            oncontextmenu(event) {
                // event.preventDefault();
            },
        },
        windowAttributes: {
            onmousemove(event) {
                const touch = touches.find(t => t.isMouse)
                if (!touch) return;
                const touchCoords = coords(event, canvas);
                touch.x = touchCoords.x;
                touch.y = touchCoords.y;
            },
            onmouseup(event) {
                const touch = touches.find(t => t.isMouse)
                if (!touch) return;
                touch.justReleased = true;
            },
            ontouchmove(event) {
                event.preventDefault();
                [].forEach.call(event.changedTouches, touchevt => {
                    const touch = touches.find(({ id }) => id === touchevt.identifier);
                    if (!touch) return;
                    const touchCoords = coords(touchevt, canvas);
                    touch.x = touchCoords.x;
                    touch.y = touchCoords.y;
                });
            },
            ontouchend(event) {
                event.preventDefault();
                [].forEach.call(event.changedTouches, touchevt => {
                    const touch = touches.find(({ id }) => id === touchevt.identifier);
                    if (!touch) return;
                    touch.justReleased = true;
                });
            },
            ontouchcancel(event) {
                console.log(event.type, event);
            },
        },
        pointer: {
            next: () => {
                const oldTouches = touches;
                touches = touches.map(touch => {
                    const { justPressed, justReleased, ...nextTouch } = touch;
                    if (justReleased) return null;
                    else return nextTouch;
                }).filter(touch => touch != null)
                return oldTouches;
            },
        },
    };
}
