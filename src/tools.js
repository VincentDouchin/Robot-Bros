const fetchAsset = async (path, type = 'json') => {
    debugger
    const res = await fetch(new URL(path.replace('../', '/'), import.meta.url))

    // console.log(new URL(path.replace('../', '/'), import.meta.url).href)
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