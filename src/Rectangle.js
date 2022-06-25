const Rectangle = (x, y, w, h) => ({

    x: x,
    y: y,
    oldY: y,
    height: h,
    width: w,

    getBottom() { return this.y + this.height; },
    getCenterX() { return this.x + this.width * 0.5; },
    getCenterY() { return this.y + this.height * 0.5; },
    getLeft() { return this.x; },
    getRight() { return this.x + this.width; },
    getTop() { return this.y; },

    getOldBottom() { return this.old_y + this.height; },
    getOldTop() { return this.old_y; },

    setBottom(y) { this.y = y - this.height; },
    setLeft(x) { this.x = x; },
    setRight(x) { this.x = x - this.width; },
    setTop(y) { this.y = y; },

    moveX(x) { this.x += x; },
    moveY(y) { this.old_y = this.y; this.y += y; },
})
export { Rectangle }