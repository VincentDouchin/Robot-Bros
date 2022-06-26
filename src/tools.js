
const indexToCoord = (index, columns, width, height) => {
    height = height ?? width
    return [index % columns * width, Math.floor(index / columns) * height]
}

const increment = (x, arr) => (x + 1) % arr.length
const decrement = (x, arr) => x === 0 ? arr.length - 1 : x - 1



export { indexToCoord, increment, decrement }