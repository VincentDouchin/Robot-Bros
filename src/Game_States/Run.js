
import { TiledMap, } from './../../src/TiledMap'
import Animator from '../Animator'
import { Entity } from './../../src/Characters'
import { isColliding, collide } from './../../src/collider'
import { Bullet } from '../Bullet'
import { Rectangle } from '../Rectangle'
import { Item } from '../Items'

const Run = function (display, controller, uiManager, engine, assets) {
    const UI = assets.tilesets.UI
    const characters = assets.tilesets.Characters
    const points = assets.tilesets.Points

    const getActions = tiles => tiles.reduce((acc, v) => ({ ...acc, [v.action]: Animator(v.img) }), {})
    const [ant, binny, capp, tanker, bumpy, devo, bushly] = ['Ant', 'Binny', 'Capp', 'Tanker', 'Bumpy', 'Devo', 'Bushly'].map(x => getActions(characters[x]))
    const [explosion, health, dust, bulletImg, smallCoin, bigCoin, heart] = ['explosion', 'health', 'dust', 'bullet', 'small coin', 'big coin', 'heart',].map(x => characters[x].img)




    const items = [Item(bigCoin, 'coin', { amount: 10 }), Item(smallCoin, 'coin', { amount: 5 }), Item(heart, 'heart',)]
    const playerTiles = [ant, binny, capp, tanker]
    const cave = TiledMap(assets.levels['cave-level'])

    let player = {}


    const enemyList = [[bumpy, true], [devo, true], [bushly, false]]
    let enemies = []

    let enemySpawned = 0
    let enemySpawnedTimeStamp = 0
    const spawnEnemy = (map) => {

        const [tiles, reversed] = enemyList[Math.floor(Math.random() * enemyList.length)]
        const { x, y } = map.getSpawnPoint('enemy')
        const direction = enemySpawned % 2 ? 1 : -1
        enemySpawned++
        const enemy = Entity({ tiles, x, y, reversed, moveForce: 0.2, id: enemySpawned, direction })
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
            if (enemy.getBottom() == (16 * 16)) {
                teleportUp()
                player.points -= 5
            }

            changeDirection()
        }
        switch (enemy.direction) {
            case -1: return enemy.moveLeft()
            case 1: return enemy.moveRight()
        }
    }
    const movePlayer = () => {
        if (player.state != 'hurt') {

            player.update()
            cave.collideWithEntity(player)
            if (controller.left.active) {
                player.moveLeft()
            }
            if (controller.right.active) {
                player.moveRight()
            }
            if (controller.jump.once) {
                player.jump()
            }
            if (controller.shoot.once) {
                player.bullets.push(Bullet(player, bulletImg))
            }
        }
    }

    display.createMapBuffer(cave, 0)
    display.createMapBuffer(cave, 1)
    const buttons = cave.objects.ui
    return {
        set({ selectedCharacter = 0, touchSelected = false, clear = false }) {

            if (clear) {

                const { x, y } = cave.getSpawnPoint('player')
                player = Entity({ tiles: playerTiles[selectedCharacter], x, y })

                player.points = 0
                player.health = 5
                player.maxHealth = 5
                player.dust = Animator(dust, 4)
                player.bullets = []
                player.lastEnemyHit = null
                enemies = []
                cave.items = []
            }
            if (touchSelected) {
                uiManager.setUI([
                    { button: buttons.find(x => x.name == 'left'), img: UI.arrowLeft.img, bind: controller.left },
                    { button: buttons.find(x => x.name == 'right'), img: UI.arrowRight.img, bind: controller.right },
                    { button: buttons.find(x => x.name == 'a'), img: UI.a.img, bind: controller.jump },
                    { button: buttons.find(x => x.name == 'b'), img: UI.b.img, bind: controller.shoot },
                ])
            }
        },
        render() {
            display.drawMap(cave)
            enemies.forEach((enemy, enemyIndex) => {
                display.drawEntity(enemy)
                if (enemy?.explosion) {
                    enemy.explosion.animate()

                    display.drawFrame(enemy.explosion.getFrame(), [enemy.x, enemy.y, 16, 16])
                }
            })
            display.drawEntity(player)
            if (player.state == 'moving') {
                player.dust.animate()
                display.drawFrame(player.dust.getFrame(), [player.x - (player.direction * player.width), player.y, 16, 16], player.direction)

            }
            if (player.state == 'idle') {
                player.dust.selectedFrame = 0
            }
            display.drawPlayerHealth(health, player)
            display.drawPlayerPoints(points, player)
            player.bullets.forEach(bullet => display.drawBullet(bullet))
            cave.items.forEach(item => display.drawItem(item))
            uiManager.render()
        },
        update() {
            enemySpawnedTimeStamp++
            if (enemySpawnedTimeStamp >= 180 && enemies.length < 10) {
                enemySpawnedTimeStamp = 0
                spawnEnemy(cave)
            }


            if (!enemies.some(enemy => isColliding(enemy, player))) {
                player.lastEnemyHit = null
            }
            if (player.state == 'hurt') {
                if (player.tiles.hurt.cycles >= 3) {
                    player.tiles.hurt.cycles = 0
                    player.state = 'idle'
                }
            }
            cave.items.forEach((item, itemIndex) => {
                if (isColliding(item, player)) {
                    if (item.type == 'coin') {
                        player.points += item.amount
                        player.points = player.points
                    }
                    if (item.type == 'heart' && player.health < player.maxHealth) {
                        player.health++
                    }

                    cave.items.splice(itemIndex, 1)
                }
                item.img.delay = 20 - item.img.cycles
                if (item.img.delay <= -10) cave.items.splice(itemIndex, 1)
            })
            enemies.forEach((enemy, enemyIndex) => {

                if (isColliding(enemy, player) && enemy.state != 'hurt') {
                    if (player.lastEnemyHit === null) {
                        player.health--
                        player.lastEnemyHit = enemyIndex
                        player.state = 'hurt'
                        player.velocity.x = 0
                        player.velocity.y = 0
                    }
                }
                player.bullets.forEach((bullet, bulletIndex) => {
                    if (isColliding(bullet, enemy)) {
                        player.bullets.splice(bulletIndex, 1)
                        enemy.state = 'hurt'
                    }
                })
                if (enemy.state != 'hurt') {
                    moveEnemy(enemy)
                    enemy.update()
                }
                cave.collideWithEntity(enemy)
                if (enemy.state == 'hurt' && !enemy?.explosion) {
                    enemy.explosion = Animator(explosion, 4)
                }
                if (enemy?.explosion) {
                    if (enemy.explosion.selectedFrame >= enemy.explosion.framesNb - 1) {
                        enemies.splice(enemyIndex, 1)
                        const itemToAdd = items[Math.floor(Math.random() * items.length)]
                        const { x, y } = cave.getSpawnPoint('item')

                        cave.items.push({ ...itemToAdd(), ...Rectangle(x, y, 16, 16) })
                        return
                    }
                }

            })
            player.bullets.forEach(bullet => bullet.update())
            if (player.health === 0 || player.points < 0) engine.setState('lost')
            if (controller.pause.once) {
                engine.setState('pause')
            }







            movePlayer()
        },

    }
}
export default Run