import Buffer from "./Buffer"

const Image = function (img, x = 0, y = 0, w, h) {

    const buffer = Buffer(w ?? img.width, h ?? img.height)
    buffer.drawImage(img, x, y,)
    return buffer
}
export default Image
