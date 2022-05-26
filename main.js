import './style.css'
import caveMap from './assets/levels/cave-level.json'
import characterTileset from './assets/tilesets/Characters.json'

import { TiledMap } from './src/TiledMap'
import Display from './src/Display'
import { Entity, CharacterTileSet, Animator } from './src/Characters'
import { Controller } from './src/Controller'
import { isColliding } from './src/collider'
(async function () {

	const characterTiles = await CharacterTileSet(characterTileset)
	const playerTiles = characterTiles.getCharacter('Ant')
	const bumpy = characterTiles.getCharacter('Bumpy')
	const devo = characterTiles.getCharacter('Devo')
	const explosion = characterTiles.getType('explosion').img
	const health = characterTiles.getType('health').img
	const dust = characterTiles.getType('dust', 1).img
	const display = Display(288)

	const cave = await TiledMap(caveMap)
	const player = Entity({ tiles: playerTiles, x: 32, y: 15 * 16 })
	player.health = 3
	player.maxHealth = 3
	player.dust = Animator(dust)


	const controller = Controller('q', 'd', ' ', 's')
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
		if (controller.left()) {
			player.moveLeft()
		}
		if (controller.right()) {
			player.moveRight()
		}
		if (controller.up()) {
			player.jump()
			controller.setUp(false)
		}
	}

	const cycle = () => {

		display.drawMap(cave)
		requestAnimationFrame(cycle)

		enemies.forEach((enemy, i) => {

			if (isColliding(enemy, player)) {
				enemy.state = 'hurt'
			}

			cave.collideWithEntity(enemy)
			display.drawEntity(enemy)
			if (enemy.state != 'hurt') {
				moveEnemy(enemy)
				enemy.update()
			}
			if (enemy.state == 'hurt' && !enemy?.explosion) {
				enemy.explosion = Animator(explosion, 4)
			}
			if (enemy?.explosion) {
				enemy.explosion.animate()
				if (enemy.explosion.selectedFrame >= enemy.explosion.framesNb - 1) {
					enemies.splice(i, 1)
					return
				}
				display.drawFrame(enemy.explosion.getFrame(), [enemy.x, enemy.y])
			}
		})
		display.drawEntity(player)
		player.update()
		cave.collideWithEntity(player)
		if (player.state == 'moving') {
			player.dust.animate()
			display.drawFrame(player.dust.getFrame(), [player.x - (player.direction * player.width), player.y], player.direction)

		}
		if (player.state == 'idle') {
			player.dust.selectedFrame = 0
		}
		display.drawPlayerHealth(health, player)




		movePlayer()




	}
	cycle()



})()