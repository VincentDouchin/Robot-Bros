import caveMap from './../../assets/levels/cave-level.json'
import characterTileset from './../../assets/tilesets/Characters.json'

import { TiledMap } from './../../src/TiledMap'
import Display from './../../src/Display'
import { Entity, CharacterTileSet, Animator } from './../../src/Characters'
import { Controller } from './../../src/Controller'
import { isColliding, collide } from './../../src/collider'

const Run = async function () {

    const characterTiles = await CharacterTileSet(characterTileset)
    const ant = characterTiles.getCharacter('Ant')
    const binny = characterTiles.getCharacter('Binny')
    const bumpy = characterTiles.getCharacter('Bumpy')
    const devo = characterTiles.getCharacter('Devo')
    const explosion = characterTiles.getType('explosion').img
    const health = characterTiles.getType('health').img
    const dust = characterTiles.getType('dust').img
    const bulletImg = characterTiles.getType('bullet').img
    const display = Display(288)

    const playerTiles = [ant, binny]
    let selectedPlayer = 0
    const cave = await TiledMap(caveMap)
    const player = Entity({ tiles: ant, x: 32, y: 15 * 16 })
    player.health = 3
    player.maxHealth = 5
    player.dust = Animator(dust, 4)

    const controller = Controller({ left: 'q', right: 'd', up: ' ', shoot: 'z', change: 'p' })
    const charactersOnScreen = [player]
    const enemies = []

    for (let i = 0; i < 5; i++) {
        const enemy = Entity({ tiles: i % 2 ? bumpy : devo, x: i * 100, y: 20, reversed: true, moveForce: 0.2, id: i })
        charactersOnScreen.push(enemy)
        enemies.push(enemy)

    }

    const moveEnemy = enemy => {
        const changeDirection = () => enemy.direction = enemy.direction * -1
        const teleportUp = () => enemy.setBottom(16 * 3)
        if (enemy?.layer != enemy.getBottom() && enemy.grounded) {
            if (Math.random() > 0.5) changeDirection()
            enemy.layer = enemy.getBottom()
        }
        if (enemy.getRight() >= cave.right || enemy.getLeft() <= cave.left) {
            if (enemy.getBottom() == (16 * 16)) teleportUp()
            changeDirection()
        }
        switch (enemy.direction) {
            case -1: return enemy.moveLeft()
            case 1: return enemy.moveRight()
        }
    }
    const movePlayer = () => {
        if (controller.get('left')) {
            player.moveLeft()
        }
        if (controller.get('right')) {
            player.moveRight()
        }
        if (controller.get('up')) {
            player.jump()
            controller.set('up', false)
        }
    }

    display.createMapBuffer(cave, 0)
    return {
        render() {
            display.createMapBuffer(cave, 1)
            display.drawMap()
            enemies.forEach((enemy, enemyIndex) => {
                display.drawEntity(enemy)
                if (enemy?.explosion) {
                    enemy.explosion.animate()
                    if (enemy.explosion.selectedFrame >= enemy.explosion.framesNb - 1) {
                        enemies.splice(enemyIndex, 1)
                        return
                    }
                    display.drawFrame(enemy.explosion.getFrame(), [enemy.x, enemy.y])
                }
            })
            display.drawEntity(player)
            if (player.state == 'moving') {
                player.dust.animate()
                display.drawFrame(player.dust.getFrame(), [player.x - (player.direction * player.width), player.y], player.direction)

            }
            if (player.state == 'idle') {
                player.dust.selectedFrame = 0
            }
            display.drawPlayerHealth(health, player)


        },
        update() {
            if (controller.get('change')) {
                controller.set('change', false)
                selectedPlayer++
                player.tiles = playerTiles[selectedPlayer % playerTiles.length]
            }
            if (!enemies.some(enemy => isColliding(enemy, player))) {
                player.lastEnemyHit = null
            }

            enemies.forEach((enemy, i) => {
                if (isColliding(enemy, player)) {
                    if (player.lastEnemyHit === null) {
                        player.health--
                        player.lastEnemyHit = i
                    }
                }
                if (enemy.state != 'hurt') {
                    moveEnemy(enemy)
                    enemy.update()
                }
                cave.collideWithEntity(enemy)
                if (enemy.state == 'hurt' && !enemy?.explosion) {
                    enemy.explosion = Animator(explosion, 4)
                }

            })
            player.update()
            const blockHits = cave.collideWithEntity(player)
            const blockHitsTop = blockHits.filter(x => x.getTop() < player.getTop())
            blockHitsTop.forEach(x => x.setTop(x.getTop() - 8))




            movePlayer()
        }
    }
}
export { Run }