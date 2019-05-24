export function makeCanvas(width, height, alpha=true) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', {alpha});
    return [canvas, ctx];
}