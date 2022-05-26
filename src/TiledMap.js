import { Rectangle } from './Rectangle'
import { fetchAsset, indexToCoord } from './tools'

import { isColliding, collideBlock } from './collider'


const TiledMap = async function (map) {
	const getMapTileSet = async function (tileset) {
		const source = await fetchAsset(tileset.source)
		const img = await fetchAsset(source.image, 'img')
		return { ...tileset, ...source, img }
	}
	const tilesets = await Promise.all(map.tilesets.map(getMapTileSet))
	const getCorrespondingTileset = tileNb => tilesets.find(x => tileNb >= x.firstgid && tileNb <= x.tilecount)

	const collisionMap = map.layers.flatMap(layer => {
		return layer.data.reduce((acc, v, i) => {
			if (!v) return acc
			const tileset = getCorrespondingTileset(v)
			const tile = tileset.tiles.find(x => x.id == v - tileset.firstgid)
			if (!tile || !tile?.type) return acc
			const [x, y] = indexToCoord(i, layer.width, 16, 16)
			return [...acc, { type: tile.type, ...Rectangle(x, y, 16, 16) }]
		}, [])
	})


	return {
		left: 0,
		right: map.tilewidth * map.width,
		up: 0,
		bottom: map.tileheight * map.height,
		...map,
		tilesets,
		collideWithEntity(entity) {
			if (this.left >= entity.getLeft()) entity.setLeft(this.left)
			if (this.right <= entity.getRight()) entity.setRight(this.right)
			if (this.top >= entity.getTop()) entity.setTop(this.top)
			if (this.bottom <= entity.getBottom()) entity.setBottom(this.bottom)
			collisionMap.filter(x => isColliding(entity, x)).forEach(x => collideBlock(entity, x))
		}
	}
}



export { TiledMap }