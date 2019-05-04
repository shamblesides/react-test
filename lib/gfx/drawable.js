function at(x, y) {
    return drawable(this.wait, this.draw, x, y)
}
function move(x, y) {
    return drawable(this.wait, this.draw, this.x+x, this.y+y)
}
export const drawable = (wait, draw, x=0, y=0) => ({
    wait, draw, x, y, at, move
});
