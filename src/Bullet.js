import { Rectangle } from "./Rectangle"

const Bullet = function (entity, img) {

    return {
        img,
        ...Rectangle(entity.x, entity.y, img.width, img.height),
        width: img.width,
        height: img.height,
        direction: entity.direction,
        update() {
            this.moveX(4 * this.direction)
        }
    }
}
export { Bullet }