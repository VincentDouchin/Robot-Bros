
import { indexToCoord } from "./tools"

const initializeCtx = height => {
    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d', { alpha: true })
    // ctx.canvas.height = height
    // ctx.canvas.width = 16 / 9 * height
    // ctx.imageSmoothingEnabled = false
    // ctx.canvas.style['image-rendering'] = 'pixelated'
    const ctx = createBuffer(height)
    const canvas = ctx.canvas
    document.body.append(canvas)
    const resize = () => {



        const width_ratio = document.documentElement.clientWidth / ctx.canvas.width;
        const height_ratio = document.documentElement.clientHeight / ctx.canvas.height;

        const scale = width_ratio < height_ratio ? width_ratio : height_ratio;

        ctx.canvas.style.height = Math.floor(ctx.canvas.height * scale) + 'px';
        ctx.canvas.style.width = Math.floor(ctx.canvas.width * scale) + 'px';

    }

    window.addEventListener('resize', resize);
    resize()
    return ctx
}
const createBuffer = height => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: true })
    ctx.canvas.height = height
    ctx.canvas.width = 16 / 9 * height
    ctx.imageSmoothingEnabled = false
    ctx.canvas.style['image-rendering'] = 'pixelated'
    return ctx
}
const Display = function (height, scale = 1) {
    const ctx = initializeCtx(height * scale)
    const draw = (img, sx, sy, sw, sh, x, y, w, h, factor = 1) => ctx.drawImage(img, sx, sy, sw, sh, x * scale, y * scale, w * scale * factor, h * scale * factor)
    const drawFlipped = (img, sx, sy, sw, sh, x, y, w, h) => {
        ctx.scale(-1, 1)
        draw(img, sx, sy, sw, sh, -Math.floor(x + w), Math.floor(y), w, h)
        ctx.scale(-1, 1)
    }

    const mapBuffers = []
    return {
        ctx,
        scale,
        draw,

        drawCentered(frame1, frame2, factor = 1) {

            draw(frame1, 0, 0, frame1.width, frame1.height, frame2.x + frame2.width / 2 - frame1.width * factor / 2, frame2.y + frame2.height / 2 - frame1.height * factor / 2, frame1.width * factor, frame1.height * factor)
        },
        drawImg(pos, img) {
            draw(img, 0, 0, img.width, img.height, pos.x, pos.y, pos.width, pos.height, 1)
        },
        drawFrame(frame, pos, direction = 1) {
            if (direction === 1) {
                draw(...frame, ...pos)
            } else {
                drawFlipped(...frame, ...pos)

            }
        },
        drawEntity(entity) {
            const sprite = entity.tiles[entity.state] ?? entity.tiles.idle

            sprite.animate()
            const img = sprite.getFrame()
            this.drawFrame(img, [entity.x, entity.y, 16, 16], entity.direction * (entity.reversed ? -1 : 1))

        },
        drawMap(map) {
            map?.buffers.forEach(buffer => ctx.drawImage(buffer.canvas, 0, 0))
        },
        createMapBuffer(map, buffer) {

            if (!map?.buffers) map.buffers = []
            if (!map.buffers?.[buffer]) map.buffers[buffer] = createBuffer(height * scale)
            const layer = map.layers[buffer]

            layer.forEach((tile) => {
                if (tile) {
                    map.buffers[buffer].drawImage(tile.img, tile.sx, tile.sy, tile.sh, tile.sw, tile.x, tile.y, tile.height, tile.width)
                }
            })

        },
        drawPlayerHealth(img, { health, maxHealth }) {
            for (let i = 0; i < maxHealth; i++) {
                ctx.drawImage(img, (i < health ? 0 : 8), 0, 8, 8, i * 16, 268, 16, 16)
            }
        },
        drawPlayerPoints(tileset, { points = 0 }) {
            const getCoord = tile => indexToCoord(tileset.tiles.find(x => x.type == tile).id, tileset.columns, tileset.tilewidth, tileset.tileheight)
            const coin = getCoord('coin')
            const pointsString = points.toString()
            const fullPointsString = new Array(6 - pointsString.length).fill(0).join('') + pointsString
            for (let i = 0; i < fullPointsString.length; i++) {
                draw(tileset.img, ...getCoord(fullPointsString[i]), tileset.tilewidth, tileset.tileheight, (25 + i) * 16, 268, 16, 16)

            }
            draw(tileset.img, ...coin, tileset.tilewidth, tileset.tileheight, 25 * 16, 268, 16, 16)
        },
        drawBullet(bullet) {
            draw(bullet.img, 0, 0, bullet.width, bullet.height, bullet.x, bullet.y, bullet.width, bullet.height)
        },
        drawItem(item) {

            item.img.animate()
            const sprite = item.img.getFrame()
            this.drawFrame(sprite, [item.x, item.y, 16, 16])
        }

    }
}

export default Display