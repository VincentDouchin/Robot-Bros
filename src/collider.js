function isColliding(player, rectangle) {
    if (
        player.getLeft() > rectangle.getRight() ||
        player.getTop() > rectangle.getBottom() ||
        player.getRight() < rectangle.getLeft() ||
        player.getBottom() < rectangle.getTop()
    ) return false

    return true
}
const collide = {
    top: (r1, r2) => r1.getBottom() > r2.getTop() && r1.getTop() < r2.getTop(),
    bottom: (r1, r2) => r1.getTop() < r2.getBottom() && r1.getBottom() > r2.getBottom(),
    left: (r1, r2) => r1.getLeft() < r2.getRight() && r1.getCenterY() > r2.getTop() && r1.getCenterY() < r2.getBottom() && r1.getRight() > r2.getRight(),
    right: (r1, r2) => r1.getRight() > r2.getLeft() && r1.getCenterY() > r2.getTop() && r1.getCenterY() < r2.getBottom() && r1.getLeft() < r2.getLeft(),
}

function collideBlock(player, rectangle) {

    if (collide.top(player, rectangle)) {

        player.setBottom(rectangle.getTop())
        player.grounded = true
        return true
    }
    if (collide.bottom(player, rectangle)) {
        player.setTop(rectangle.getBottom())
        player.velocity.y = 0
        return true
    }

    if (collide.left(player, rectangle)) {
        player.setLeft(rectangle.getRight())
        player.velocity.x = 0
        return true

    }
    if (collide.right(player, rectangle)) {
        player.setRight(rectangle.getLeft())
        player.velocity.x = 0
        return true

    }

    return false
}

export { isColliding, collideBlock, collide }