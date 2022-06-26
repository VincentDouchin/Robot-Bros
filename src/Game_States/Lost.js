
import { TiledMap } from "../TiledMap"
const Lost = function (display, controller, uiManager, engine, assets) {
    const UI = assets.tilesets.UI

    const lost = TiledMap(assets.levels.Lost)
    return {
        set() {
            uiManager.setMenu([
                { button: lost.objects.ui.find(x => x.name == 'Title'), img: UI.default.img, text: UI.restart.img, click: () => engine.setState('title') }
            ])
        },
        render() {
            display.drawCentered(UI.lost.img, lost.objects.ui.find(x => x.name == 'lost'), 5)
        },
        update() {

        },
        changeState() {

        }
    }
}
export default Lost