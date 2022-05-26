const fetchAsset = async (path, type = 'json') => {
    const res = await fetch(path.replace('../', '/assets/'))
    const loadImage = src =>
        new Promise(async (resolve, reject) => {
            const blob = await res.blob()
            const img = document.createElement('img')
            const objectURL = URL.createObjectURL(blob)
            img.src = objectURL

            img.addEventListener('load', () => resolve(img))

            return img
        })
    switch (type) {
        case 'json': return await res.json()
        case 'img': return await loadImage(path)
    }


}
const indexToCoord = (index, columns, width, height) => {
    height = height ?? width
    return [index % columns * width, Math.floor(index / columns) * height]
}



export { fetchAsset, indexToCoord }