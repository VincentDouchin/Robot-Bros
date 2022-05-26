
const initializeCtx = height => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d',)
    ctx.canvas.height = height
    ctx.canvas.width = 16 / 9 * height
    ctx.imageSmoothingEnabled = false
    ctx.canvas.style['image-rendering'] = 'pixelated'
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
            // if ((entity.direction == 1) != entity.reversed) {
            //     draw(...img, entity.x, entity.y, entity.width, entity.height)
            // }
            // if ((entity.direction == -1) != entity.reversed) {
            //     drawFlipped(...img, entity.x, entity.y, entity.width, entity.height)
            // }
        },
        drawMap(map) {
            map.layers.forEach(layer => {

                layer.data.forEach((tile, tileIndex) => {

                    if (tile) {
                        const tileset = map.tilesets.find(x => tile >= x.firstgid && tile <= x.firstgid + x.tilecount)

                        const [sx, sy] = indexToCoord(tile - tileset.firstgid, tileset.columns, tileset.tileheight, tileset.tilewidth)
                        const [x, y] = indexToCoord(tileIndex, layer.width, map.tileheight, map.tilewidth)

                        draw(tileset.img, sx, sy, tileset.tileheight, tileset.tilewidth, x, y, map.tileheight, map.tilewidth)
                    }

                })
            })
        },
        drawPlayerHealth(img, { health, maxHealth }) {


            for (let i = 0; i < maxHealth; i++) {

                ctx.drawImage(img, 0, (i < health ? 0 : 8), 8, 8, i * 16, 0, 16, 16)
            }
        }
    }
}

export default Display