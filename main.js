import './style.css'
import { Engine } from './src/Engine'
import { Run } from './src/Game_States/Run'
(async function () {
	const engine = Engine()
	const run = await Run()
	engine.setState(run)
	engine.start()
})()