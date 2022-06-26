

import { TiledMap } from '../TiledMap'
import Animator from '../Animator'
import { increment } from '../tools'
const Title = function (display, controller, uiManager, engine, assets) {
    // const controller = Controller({ up: 'z', down: 's', left: 'q', right: 'd', enter: ' ' })
    const UI = assets.tilesets.UI

    const buttonImg = UI.default.img

    const buttonImgSelected = UI.selected.img
    const startImg = UI.start.img

    const touchEnabled = UI.enabled.img
    const touchDisabled = UI.disabled.img
    const charactersName = ['Ant', 'Binny', 'Capp', 'Tanker']
    const characters = ['Ant', 'Binny', 'Capp', 'Tanker'].map(x => Animator(assets.tilesets.Characters[x].find(y => y.action == 'moving').img))


    const titleMap = TiledMap(assets.levels.Title)
    display.createMapBuffer(titleMap, 0)
    display.createMapBuffer(titleMap, 1)
    let selectedCharacter = 0
    let characterImg = UI[charactersName[selectedCharacter]].img
    let selectedButton = 0
    let touchSelected = false

    // const textImgs = [[startImg], [], [antImg, binnyImg]]
    const menuButtons = titleMap.objects.ui.filter(x => x.type == 'menu').sort((a, b) => a.order - b.order)
    const text = titleMap.objects.ui.filter(x => x.type == 'text')
    const preview = titleMap.objects.ui.find(x => x.type == 'preview')

    const buttons = [
        { button: menuButtons.find(x => x.name == 'play'), img: buttonImg, text: startImg, click: () => engine.setState('run', { clear: true, selectedCharacter, touchSelected }) },
        {
            button: menuButtons.find(x => x.name == 'controller'), img: buttonImg, text: touchDisabled, click() {
                touchSelected = !touchSelected
                this.text = touchSelected ? touchEnabled : touchDisabled
            }
        },
        {
            button: menuButtons.find(x => x.name == 'character'), img: buttonImg, text: characterImg, click() {
                selectedCharacter = increment(selectedCharacter, characters)
                this.text = UI[charactersName[selectedCharacter]].img
            }
        }
    ]
    return {
        set() {
            uiManager.setMenu(buttons)

        },
        render() {
            display.drawMap(titleMap)
            uiManager.render()
            text.forEach(x => {
                display.drawCentered(UI[x.name].img, x, 2)
            })


            display.drawFrame(characters[selectedCharacter].getFrame(), [preview.x, preview.y, preview.width, preview.height], -1)

        },
        update() {
            characters[selectedCharacter].animate()
            buttons.forEach((x, i) => x.img = uiManager.selectedButton == i ? buttonImgSelected : buttonImg)



        }
    }
}
export default Title 