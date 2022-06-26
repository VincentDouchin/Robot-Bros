import './style.css'
import UIManager from './src/UiManager'
//!GameStates
import { Engine } from './src/Engine'
import Run from './src/Game_States/Run'
import Pause from './src/Game_States/Pause'
import Lost from './src/Game_States/Lost'
import Title from './src/Game_States/Title'
//!Assets
import AssetManager from './src/AssetManager'
import Display from './src/Display'
import { Controller } from './src/Controller'
(async function () {
	const assets = await AssetManager()
	const controller = await Controller()
	const display = Display(288)
	const uiManager = UIManager(display, controller)
	const engine = new Engine(uiManager)

	const lost = Lost(display, controller, uiManager, engine, assets)
	const run = Run(display, controller, uiManager, engine, assets)
	const pause = Pause(display, controller, uiManager, engine, assets)
	const title = Title(display, controller, uiManager, engine, assets)
	engine.setStates({ run, pause, title, lost })
	engine.setState(['title'])
	engine.start()
})()
