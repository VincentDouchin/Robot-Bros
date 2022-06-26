
import { Rectangle } from './Rectangle'
const gravity = 1.2
const friction = 0.85

const CharacterTileSet = async function (tileset) {
	const tiles = await Promise.all(tileset.tiles.map(async tile => {
		return {
			...tile,
			...tile.properties?.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {}),
			img: await fetchAsset(tile.image, 'img')
		}
	}))

	return {
		getCharacter(characterName) {
			return tiles.filter(x => x.character == characterName).reduce((acc, v) => {
				return { ...acc, [v.action]: Animator(v.img) }
			}, {})

		},

	}
}
const Animator = function (img, delay = 20) {
	return {
		counter: 0,
		framesNb: img.width / img.height,
		selectedFrame: 0,
		delay,
		cycles: 0,
		getFrame() {
			return [img, this.selectedFrame * img.height, 0, img.height, img.height]
		},
		animate() {
			this.counter++
			if (this.counter >= this.delay) {
				this.selectedFrame = (this.selectedFrame + 1) % this.framesNb
				this.counter = 0
				this.cycles++
			}
		}
	}
}

const Entity = ({ tiles, x, y, reversed = false, moveForce = 0.5, id }) => {

	return {

		...Rectangle(x, y, 16, 16),
		tiles: tiles,
		state: 'idle',
		direction: 1,
		moveForce: moveForce,
		jumpForce: 35,
		reversed: reversed,
		velocity: { x: 0, y: 0 },
		grounded: false,

		id: id,

		moveLeft() {
			this.velocity.x -= this.moveForce
		},
		moveRight() {
			this.velocity.x += this.moveForce
		},
		jump() {
			if (this.grounded) {
				this.grounded = false
				this.velocity.y -= this.jumpForce
			}
		},
		update() {
			if (!this.grounded) {
				this.state = 'jump'
			} else if (Math.abs(this.velocity.x) > 0.1) {
				this.state = 'moving'
			} else if (Math.abs(this.velocity.x) < 0.1) {
				this.state = 'idle'
			}

			this.velocity.x *= friction
			this.velocity.y += gravity
			this.velocity.y *= friction
			this.x += this.velocity.x
			this.moveY(this.velocity.y)
			this.direction = this.velocity.x > 0 ? 1 : -1
		}

	}
}





export { Entity, CharacterTileSet }