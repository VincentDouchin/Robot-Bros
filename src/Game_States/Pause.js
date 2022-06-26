
import { TiledMap } from "../TiledMap"
import { Controller } from "./../Controller"
const Pause = function (display, controller, uiManager, engine, assets) {
    const pause = TiledMap(assets.levels.Pause)
    const UI = assets.tilesets.UI
    const buttonImg = UI.default.img

    const buttonImgSelected = UI.selected.img
    const buttons = pause.objects.ui
    const menuButtons = [
        { button: buttons.find(x => x.name == 'resume'), img: buttonImg, text: UI.resume.img, click: () => engine.setState('run') },
        { button: buttons.find(x => x.name == 'reset'), img: buttonImg, text: UI.reset.img, click: () => engine.setState('run', { clear: true }) },
    ]
    return {
        set() {
            uiManager.setMenu(menuButtons)
        },
        render() {
            uiManager.render()

        },
        update() {
            menuButtons.forEach((x, i) => x.img = uiManager.selectedButton == i ? buttonImgSelected : buttonImg)



        },

    }
}
export default Pause