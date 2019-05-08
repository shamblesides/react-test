function at(x, y) {
    return drawable(this.wait, this.canvas, x, y)
}
function move(x, y) {
    return drawable(this.wait, this.canvas, this.x+x, this.y+y)
}
export const drawable = (wait, canvas, x=0, y=0) => ({
    wait, canvas, x, y, at, move
});
