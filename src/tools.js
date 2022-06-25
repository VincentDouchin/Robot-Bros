
const res = import.meta.globEager('../assets/**/*.*')
const fetchAsset = async (path, type = 'json') => {

    // const res = await fetch(new URL(path.replace('../', '/assets/'), import.meta.url))
    const url = res[path.replace('../', '../assets/')].default
    // console.log(new URL(path.replace('../', '/'), import.meta.url).href)
    const loadImage = url =>
        new Promise(async (resolve, reject) => {
            const img = new Image()
            img.src = url

            img.addEventListener('load', () => resolve(img))

            return img
        })
    switch (type) {
        case 'json': return url
        case 'img': return await loadImage(url)
    }


}
const indexToCoord = (index, columns, width, height) => {
    height = height ?? width
    return [index % columns * width, Math.floor(index / columns) * height]
}



export { fetchAsset, indexToCoord }