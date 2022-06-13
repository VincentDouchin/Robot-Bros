import './style.css'
import { Engine } from './src/Engine'
import { Run } from './src/Game_States/Run'
import { Pause } from './src/Game_States/Pause'
import { Title } from './src/Game_States/Title'

import Display from './src/Display'
import { Controller } from './src/Controller'
(async function () {
	const controller = await Controller()
	document.addEventListener('keydown', () => console.log(controller.inputs()))
	const display = Display(288)
	const run = await Run(display, controller)
	const pause = Pause(display, controller)
	const title = await Title(display, controller)
	const engine = new Engine({ run, pause, title })
	engine.setState(['title'])
	engine.start()
})()