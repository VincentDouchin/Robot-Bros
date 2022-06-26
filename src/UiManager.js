import { increment, decrement } from "./tools"
const UIManager = function (display, controller) {
    let buttons = []
    let menuButtons = []
    const allButtons = () => [...buttons, ...menuButtons]
    let selectedButton = 0
    const getClickedButtons = (e) => {
        const y = e.offsetY * (display.ctx.canvas.height / display.ctx.canvas.offsetHeight)
        const x = e.offsetX * (display.ctx.canvas.width / display.ctx.canvas.offsetWidth)

        return allButtons().filter(({ button }) => {
            const top = button.x <= x
            const bottom = button.x + button.width >= x
            const left = button.y <= y
            const right = button.y + button.height >= y
            return top && bottom && left && right
        })
    }

    display.ctx.canvas.addEventListener('pointerdown', e => getClickedButtons(e).forEach(button => {
        if (button?.click) button.click()
        if (button?.bind) clickDownUp(e, button.bind)
    }))
    display.ctx.canvas.addEventListener('pointerup', e => {
        const clickedbuttons = getClickedButtons(e)

        if (clickedbuttons.length == 0) allButtons().forEach(button => {
            if (button.bind.active) clickDownUp(e, button.bind)
        })
        clickedbuttons.forEach(button => {
            if (button?.bind) clickDownUp(e, button.bind)
        })
    })
    display.ctx.canvas.addEventListener('pointermove', e => getClickedButtons(e).forEach(button => {
        selectedButton = menuButtons.findIndex(x => x.button.name == button.button.name)

    }
    ))

    const clickDownUp = (e, key) => {

        const state = e.type == 'pointerdown'
        key.getInput(state)
    }
    return {
        setUI(_buttons) {
            buttons = _buttons

        },
        setMenu(buttons) {
            menuButtons = buttons
            console.log(buttons)
        },
        clear() {
            buttons = []
            menuButtons = []
            selectedButton = 0
        },
        render() {
            allButtons().forEach(({ button, img, text, visible }) => {
                const isVisible = (typeof visible == 'function' ? visible() : visible) ?? true
                if (isVisible) {

                    display.drawImg(button, img)
                    if (text) display.drawCentered(text, button, 2)
                }

            })
        },
        update() {
            if (controller.down.once) {
                selectedButton = increment(selectedButton, menuButtons)
            }
            if (controller.up.once) {
                selectedButton = decrement(selectedButton, menuButtons)
            }
            if (controller.enter.once) {
                menuButtons[selectedButton].click()


            }
        },
        get buttons() {
            return buttons
        },
        get selectedButton() {
            return selectedButton
        }

    }
}
export default UIManager