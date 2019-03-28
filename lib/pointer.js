function coords(evt, canvas, zero = false) {
    const pageX = evt.clientX - (canvas.clientLeft||0) - (canvas.offsetLeft||0) + window.scrollX;
    const pageY = evt.clientY - (canvas.clientTop||0) - (canvas.offsetTop||0) + window.scrollY;

    const upscaling = Math.min(canvas.clientWidth/canvas.width, canvas.clientHeight/canvas.height);

    const { offsetX, offsetY } = (canvas.width/canvas.height > canvas.clientWidth/canvas.clientHeight) ?
        // canvas aspect ratio wider than screen aspect ratio -> leftovers on top and bottom
        { offsetX: 0, offsetY: (canvas.clientHeight - canvas.height*upscaling)/2 } :
        // canvas aspect ratio taller than screen aspect ratio -> leftovers on sides
        { offsetY: 0, offsetX: (canvas.clientWidth - canvas.width*upscaling)/2 };

    const coords = {
        x: Math.floor((pageX - offsetX) / upscaling),
        y: Math.floor((pageY - offsetY) / upscaling),
    };
    if (zero) {
        coords.x0 = coords.x;
        coords.y0 = coords.y;
    }
    return coords;
}

export function pointer(canvas) {
    let touches = [];

    canvas.onmousedown = function (event) {
        // remove previous mouse touches
        touches = touches.filter(t => !t.isMouse);
        // add touch
        const _holdid = Math.random();
        const touch = {
            _holdid,
            ...coords(event, canvas, true),
            isMouse: true,
            isRightClick: event.button === 2,
            justPressed: true,
        }
        touches.push(touch);
        setTimeout(() => {
            touches.filter(x => x._holdid === _holdid && !x.isDrag)
                .forEach(x => x.isHeld = x.justHeld = true);
        }, 1000)
    };
    canvas.ontouchstart = function(event) {
        event.preventDefault();
        [].forEach.call(event.changedTouches, touchevt => {
            const _holdid = Math.random();
            const touch = {
                _holdid,
                ...coords(touchevt, canvas, true),
                isMouse: false,
                id: touchevt.identifier,
                justPressed: true,
            }
            touches.push(touch);
            setTimeout(() => {
                touches.filter(x => x._holdid === _holdid && !x.isDrag)
                    .forEach(x => x.isHeld = x.justHeld = true);
            }, 1000)
        })
    };
    canvas.oncontextmenu = function(/*event*/) {
        // event.preventDefault();
    };
    window.onmousemove = function(event) {
        const touch = touches.find(t => t.isMouse)
        if (!touch) return;
        const touchCoords = coords(event, canvas);
        touch.dx = (touch.dx || 0) + touchCoords.x - touch.x;
        touch.dy = (touch.dy || 0) + touchCoords.y - touch.y;
        if (touch.dx !== 0 || touch.dy !== 0) touch.isDrag = true;
        touch.x = touchCoords.x;
        touch.y = touchCoords.y;
    };
    window.onmouseup = function() {
        const touch = touches.find(t => t.isMouse)
        if (!touch) return;
        touch.justReleased = true;
        if (!touch.isDrag && !touch.isHeld) touch.justClicked = true;
    };
    window.ontouchmove = function(event) {
        event.preventDefault();
        [].forEach.call(event.changedTouches, touchevt => {
            const touch = touches.find(({ id }) => id === touchevt.identifier);
            if (!touch) return;
            const touchCoords = coords(touchevt, canvas);
            touch.dx = (touch.dx || 0) + touchCoords.x - touch.x;
            touch.dy = (touch.dy || 0) + touchCoords.y - touch.y;
            if (touch.dx !== 0 || touch.dy !== 0) touch.isDrag = true;
            touch.x = touchCoords.x;
            touch.y = touchCoords.y;
        });
    };
    window.ontouchend = function(event) {
        event.preventDefault();
        [].forEach.call(event.changedTouches, touchevt => {
            const touch = touches.find(({ id }) => id === touchevt.identifier);
            if (!touch) return;
            touch.justReleased = true;
            if (!touch.isDrag && !touch.isHeld) touch.justClicked = true;
        });
    };
    window.ontouchcancel = function(/*event*/) {
        // TODO implement touchcancel
        // console.log(event.type, event);
    };

    return {
        next: () => {
            const oldTouches = touches;
            touches = touches.map(touch => {
                // eslint-disable-next-line no-unused-vars
                const { justPressed, justReleased, justHeld, justClicked, dx, dy, ...nextTouch } = touch;
                if (justReleased) return null;
                else return { dx: 0, dy: 0, ...nextTouch };
            }).filter(touch => touch != null)
            return oldTouches;
        },
        reset: () => {
            touches = [];
        },
    };
}
