import { Rectangle } from './Rectangle'
import { fetchAsset, indexToCoord } from './tools'

import { isColliding, collideBlock } from './collider'

const getTileset = async function (tileset) {
	if (tileset.source) Object.assign(tileset, { ... await fetchAsset(tileset.source) })
	if (tileset.image) Object.assign(tileset, { img: await fetchAsset(tileset.image, 'img') })

	return tileset
}
const TiledMap = async function (map) {


	const tilesets = await Promise.all(map.tilesets.map(getTileset))
	const getCorrespondingTileset = tileNb => tilesets.find(x => tileNb >= x.firstgid && tileNb <= x.firstgid + x.tilecount)

	const objects = map.layers.find(x => x.type == 'objectgroup').objects.map(x => ({ ...x, ...x.properties?.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {}) }))
	map.layers = map.layers.filter(x => x.type == 'tilelayer').map(layer => {
		return layer.data.map((tile, tileIndex) => {
			if (tile) {
				const tileset = getCorrespondingTileset(tile)
				const [sx, sy] = indexToCoord(tile - tileset.firstgid, tileset.columns, tileset.tileheight, tileset.tilewidth)
				const [x, y] = indexToCoord(tileIndex, layer.width, map.tileheight, map.tilewidth)
				const type = tileset.tiles.find(x => x.id == (tile - tileset.firstgid))?.type
				// debugger
				return { type, img: tileset.img, sx, sy, sh: tileset.tileheight, sw: tileset.tilewidth, ...Rectangle(x, y, map.tileheight, map.tilewidth) }
			}
		})
	})
	const collisionMap = map.layers.flatMap(layer => {
		return layer.filter(x => x?.type)

	})
	let lastSpawn = {}
	return {
		left: 0,
		right: map.tilewidth * map.width,
		top: 0,
		bottom: map.tileheight * map.height,
		items: [],
		...map,
		objects,
		tilesets,
		collideWithEntity(entity) {
			if (this.left >= entity.getLeft()) entity.setLeft(this.left)
			if (this.right <= entity.getRight()) entity.setRight(this.right)
			if (this.top >= entity.getTop()) entity.setTop(this.top)
			if (this.bottom <= entity.getBottom()) entity.setBottom(this.bottom)
			return collisionMap.filter(x => isColliding(entity, x)).filter(x => collideBlock(entity, x))
		},
		getSpawnPoint(type) {
			const possibleSpawns = objects.filter(x => x.spanwPoint == type && x.id != lastSpawn?.[type])
			const { x, y, id } = possibleSpawns[Math.floor(Math.random() * possibleSpawns.length)]
			lastSpawn[type] = id
			return { x, y }
		}

	}
}



export { TiledMap, getTileset }