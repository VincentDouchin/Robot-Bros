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
	const indexToCoord = (index, columns, width, height) => {
		height = height ?? width
		return [index % columns * width, Math.floor(index / columns) * height]
	}
	const layers = map.layers.map(layer => {
		return layer.data.map((tile, tileIndex) => {
			if (tile) {
				const tileset = getCorrespondingTileset(tile)
				const [sx, sy] = indexToCoord(tile - tileset.firstgid, tileset.columns, tileset.tileheight, tileset.tilewidth)
				const [x, y] = indexToCoord(tileIndex, layer.width, map.tileheight, map.tilewidth)
				return { img: tileset.img, sx, sy, sh: tileset.tileheight, sw: tileset.tilewidth, ...Rectangle(x, y, map.tileheight, map.tilewidth) }
			}
		})
	})
	debugger
	const collisionMap = map.layers.flatMap(layer => {
		return layer.data.reduce((acc, v, i) => {
			if (!v) return acc
			const tileset = getCorrespondingTileset(v)
			const tile = tileset?.tiles.find(x => x.id == v - tileset.firstgid)
			if (!tile || !tile?.type) return acc
			const [x, y] = indexToCoord(i, layer.width, 16, 16)
			return [...acc, { type: tile.type, ...Rectangle(x, y, 16, 16) }]
		}, [])
	})


	return {
		left: 0,
		right: map.tilewidth * map.width,
		top: 0,
		bottom: map.tileheight * map.height,
		...map,
		layers,
		tilesets,
		collideWithEntity(entity) {
			if (this.left >= entity.getLeft()) entity.setLeft(this.left)
			if (this.right <= entity.getRight()) entity.setRight(this.right)
			if (this.top >= entity.getTop()) entity.setTop(this.top)
			if (this.bottom <= entity.getBottom()) entity.setBottom(this.bottom)
			return collisionMap.filter(x => isColliding(entity, x)).filter(x => collideBlock(entity, x))
		},

	}
}



export { TiledMap }