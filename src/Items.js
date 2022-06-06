import { Animator } from "./Characters"

const Item = function (img, type, properties = {}) {

    return () => ({
        img: Animator(img),
        type,
        ...properties

    })
}

export { Item }