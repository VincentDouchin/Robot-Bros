
import TitleSRC from '../../assets/levels/Title.json'
import { TiledMap } from '../TiledMap'
import { CharacterTileSet } from '../Characters'
import ui from '../../assets/tilesets/UI.json'

const Title = async function (display, controller, uiManager, engine) {
    // const controller = Controller({ up: 'z', down: 's', left: 'q', right: 'd', enter: ' ' })
    const UI = await CharacterTileSet(ui)
    const buttonImg = UI.getType('default').img
    const buttonImgSelected = UI.getType('selected').img
    const startImg = UI.getType('start').img

    const keyboardImg = UI.getType('keyboard').img
    const controllerImg = UI.getType('controller').img
    const touchImg = UI.getType('touch').img

    const antImg = UI.getType('ant').img
    const binnyImg = UI.getType('binny').img
    const previewImg = UI.getType('charcaterPreview').img
    const arrowImg = UI.getType('arrow').img
    const titleMap = await TiledMap(TitleSRC)
    display.createMapBuffer(titleMap, 0)
    display.createMapBuffer(titleMap, 1)
    let selectedButton = 0
    const options = [0, 0, 0]
    const inputOptions = { keyboard: keyboardImg, touch: touchImg, controller: controllerImg }
    const getInputOptions = () => Object.entries(inputOptions).filter(([input, img]) => controller.inputs().includes(input)).map(([input, img]) => img)
    let inputs
    // const textImgs = [[startImg], [], [antImg, binnyImg]]
    const menuButtons = titleMap.objects.ui.filter(x => x.type == 'menu').sort((a, b) => a.order - b.order)
    const preview = titleMap.objects.ui.find(x => x.type == 'preview')
    const increment = (x, arr) => (x + 1) % arr.length
    const decrement = (x, arr) => x === 0 ? arr.length - 1 : x - 1

    const buttons = [
        { button: menuButtons.find(x => x.name == 'play'), img: buttonImg, text: startImg, click: () => engine.setState('run') },
        { button: menuButtons.find(x => x.name == 'controller'), img: buttonImg, text: controllerImg, },
        // ...['controller', 'character'].flatMap(name => ['left', 'right'].map(dir => {
        //     return { button: titleMap.objects.ui.find(x => x.name == name && x.type == dir), img: arrowImg }
        // })),
        { button: menuButtons.find(x => x.name == 'character'), img: buttonImg, text: antImg }
    ]
    return {
        set() {
            uiManager.setUI(buttons)

        },
        render() {
            display.drawMap(titleMap)
            uiManager.render()
            display.draw(previewImg, 0, 0, previewImg.width, previewImg.height, preview.x, preview.y, preview.width, preview.height)
        },
        update() {
            buttons.forEach((x, i) => x.img = selectedButton == i ? buttonImgSelected : buttonImg)
            inputs = getInputOptions()
            if (controller.down.once) {
                selectedButton = increment(selectedButton, menuButtons)
            }
            if (controller.up.once) {
                selectedButton = decrement(selectedButton, menuButtons)
            }
            if (controller.enter.once) {
                if (selectedButton == 0) {
                    engine.setState('run')
                }
                // if (selectedButton == 1) {
                //     increment(inputs, options[1])
                // }

            }

        }
    }
}
export { Title }