import './style.css'
import UIManager from './src/UiManager'
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
	const uiManager = UIManager(display)
	const engine = new Engine()
	const run = await Run(display, controller, uiManager, engine)
	const pause = Pause(display, controller, uiManager, engine)
	const title = await Title(display, controller, uiManager, engine)
	engine.setStates({ run, pause, title })
	engine.setState(['title'])
	engine.start()
})()