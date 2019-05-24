function at(x, y) {
    return drawable(this.wait, this.canvas, x, y)
}
function move(x, y) {
    return drawable(this.wait, this.canvas, this.x+x, this.y+y)
}
function transform(...transforms) {
    let canvas;
    return drawable(this.wait, () => {
        return canvas || (canvas = transforms.reduce((c, t) => t(c), this.canvas()));
    }, this.x, this.y)
}
export const drawable = (wait, canvas, x=0, y=0) => ({
    wait, canvas, x, y, at, move, transform
});
