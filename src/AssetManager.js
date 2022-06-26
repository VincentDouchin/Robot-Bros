const loadImage = (path) => new Promise((resolve, reject) => {
    const image = new Image()
    image.src = path
    image.onload = () => resolve(image)
    image.onerror = () => reject(image)
})
const loadTileSetsImages = async (item, source) => {


    if (item?.image) {
        const img = await loadImage(source[item.image.replace('../', '../assets/')].default)
        return { ...item, img }
    } else if (item.tiles) {
        return { ...item, tiles: await Promise.all(item.tiles.map(async tile => await loadTileSetsImages(tile, source))) }
    } else {
        return item
    }

}
const getFileName = path => path.split(/[\/.]/).at(-2)
const AssetManager = async function () {
    const renameKeys = (item) => Object.entries(item).reduce((acc, [key, val]) => ({ ...acc, [getFileName(key)]: val.default }), {})
    let levels = renameKeys(import.meta.globEager('../assets/levels/*.json'))
    const tilesets = renameKeys(import.meta.globEager('../assets/tilesets/*.json'))
    const allImages = import.meta.globEager('../assets/images/**/*.png')



    const tilesetsLoaded = await Promise.all(Object.values(tilesets).map(async tileset => {
        return await loadTileSetsImages(tileset, allImages)

    }))

    const tilesetsMapped = tilesetsLoaded.reduce((acc, v) => {

        const tileset = (v?.image || !v?.tiles) ? v : v.tiles.reduce((acc2, v2) => {
            const tile = { ...v2, ...v2.properties?.reduce((acc3, v3) => ({ ...acc3, [v3.name]: v3.value }), {}) }
            if (v.tiles.filter(x => x.type === v2.type).length === 1) return { ...acc2, [v2.type]: tile }
            else return { ...acc2, [v2.type]: [...(acc2[v2.type] ?? []), tile] }
        }, {})

        return { ...acc, [v.name]: tileset }
    }, {})

    Object.values(levels).forEach(level => {
        level.tilesets.forEach(tileset => {
            Object.assign(tileset, tilesetsMapped[getFileName(tileset.source)])
        })
    })






    return { levels, tilesets: tilesetsMapped }
}

export default AssetManager