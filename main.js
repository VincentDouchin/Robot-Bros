import './style.css'
import { Engine } from './src/Engine'
import { Run } from './src/Game_States/Run'
import { Pause } from './src/Game_States/Pause'
import { Controller } from './src/Controller'
(async function () {
	const engine = new Engine()
	const controller = Controller({ left: 'q', right: 'd', up: ' ', shoot: 'z', change: 'c', pause: 'p', shoot: 'z' })
	const run = await Run(controller)
	const pause = Pause(controller)

	engine.setStates({ run, pause })
	engine.setState('run')
	engine.start()
})()