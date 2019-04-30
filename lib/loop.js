export function attachLoop(screen, doFrame) {
    let stopped = false;

    function loop() {
        window.requestAnimationFrame(() => {
            if (stopped) return;

            const sprites = doFrame();
            if (!sprites) return;

            screen.update(sprites).then(loop);
        });
    };
    loop();

    return function stopLoop() {
        stopped = true;
    };
}
