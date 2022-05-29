
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
    const draw = (img, sx, sy, sw, sh, x, y, w, h) => ctx.drawImage(img, sx, sy, sw, sh, x * scale, y * scale, w * scale, h * scale)
    const drawFlipped = (img, sx, sy, sw, sh, x, y, w, h) => {
        ctx.scale(-1, 1)
        draw(img, sx, sy, sw, sh, -Math.floor(x + w), Math.floor(y), w, h)
        ctx.scale(-1, 1)
    }
    const indexToCoord = (index, columns, width, height) => {
        height = height ?? width
        return [index % columns * width, Math.floor(index / columns) * height]
    }
    const mapBuffers = []
    return {
        ctx,
        drawFrame(frame, pos, direction = 1) {
            if (direction === 1) {
                draw(...frame, ...pos, 16, 16)
            } else {
                drawFlipped(...frame, ...pos, 16, 16)

            }
        },
        drawEntity(entity) {
            const sprite = entity.tiles[entity.state] ?? entity.tiles.idle

            sprite.animate()
            const img = sprite.getFrame()
            this.drawFrame(img, [entity.x, entity.y], entity.direction * (entity.reversed ? -1 : 1))

        },
        drawMap() {
            mapBuffers.forEach(buffer => ctx.drawImage(buffer.canvas, 0, 0))
        },
        createMapBuffer(map, buffer) {
            if (!mapBuffers[buffer]) mapBuffers[buffer] = createBuffer(height * scale)
            const layer = map.layers[buffer]

            layer.forEach((tile) => {

                if (tile) {
                    mapBuffers[buffer].drawImage(tile.img, tile.sx, tile.sy, tile.sh, tile.sw, tile.x, tile.y, tile.h, tile.w)
                    // const tileset = map.tilesets.find(x => tile >= x.firstgid && tile <= x.firstgid + x.tilecount)

                    // const [sx, sy] = indexToCoord(tile - tileset.firstgid, tileset.columns, tileset.tileheight, tileset.tilewidth)
                    // const [x, y] = indexToCoord(tileIndex, layer.width, map.tileheight, map.tilewidth)

                }

            })

        },
        drawPlayerHealth(img, { health, maxHealth }) {
            for (let i = 0; i < maxHealth; i++) {
                ctx.drawImage(img, (i < health ? 0 : 8), 0, 8, 8, i * 16, 268, 16, 16)
            }
        },

    }
}

export default Display