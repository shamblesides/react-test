import browserEnv from 'browser-env';
browserEnv();
window.requestAnimationFrame = function requestAnimationFrame(fn) {
    setTimeout(() => fn(performance.now()), 1000/60);
}