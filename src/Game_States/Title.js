
import TitleSRC from '../../assets/levels/Title.json'
import { TiledMap } from '../TiledMap'
import { CharacterTileSet } from '../Characters'
import ui from '../../assets/tilesets/UI.json'

const Title = async function (display, controller) {
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
    const textImgs = [[startImg], [keyboardImg, controllerImg, touchImg], [antImg, binnyImg]]
    const menuButtons = titleMap.objects.filter(x => x.type == 'menu').sort((a, b) => a.order - b.order)
    const preview = titleMap.objects.find(x => x.type == 'preview')
    const increment = (x, arr) => (x + 1) % arr.length
    const decrement = (x, arr) => x === 0 ? arr.length - 1 : x - 1
    return {
        render() {
            display.drawMap(titleMap)

            menuButtons.forEach((button, buttonIndex) => {
                const img = selectedButton == buttonIndex ? buttonImgSelected : buttonImg
                display.draw(img, 0, 0, img.width, img.height, button.x, button.y, button.width, button.height)
                const textImg = textImgs[buttonIndex][options[buttonIndex]]
                display.drawCentered(textImg, button, 2)

                if (['character', 'controller'].includes(button.name) && selectedButton == buttonIndex) {

                    titleMap.objects.filter(x => x.name == button.name && x.type != 'menu').forEach(arrow => {
                        display.drawFrame([arrowImg, 0, 0, arrowImg.width, arrowImg.height], [arrow.x, arrow.y, arrow.width, arrow.height], arrow.type == 'right' ? 1 : 0)
                    })
                }

            })

            display.draw(previewImg, 0, 0, previewImg.width, previewImg.height, preview.x, preview.y, preview.width, preview.height)

        },
        update() {
            if (controller.down.once) {
                selectedButton = increment(selectedButton, menuButtons)
            }
            if (controller.up.once) {
                selectedButton = decrement(selectedButton, menuButtons)
            }
            if (controller.left.once) {
                options[selectedButton] = increment(options[selectedButton], textImgs[selectedButton])
            }
            if (controller.right.once) {
                options[selectedButton] = decrement(options[selectedButton], textImgs[selectedButton])
            }

        },
        changeState() {
            if (controller.enter.once && selectedButton == 0) {
                return 'run'
            }
            return false
        }
    }
}
export { Title }