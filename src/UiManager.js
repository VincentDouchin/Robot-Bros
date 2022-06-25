const UIManager = function (display) {
    let buttons = []

    const getClickedButtons = (e, callback) => {
        const y = e.offsetY * (display.ctx.canvas.height / display.ctx.canvas.offsetHeight)
        const x = e.offsetX * (display.ctx.canvas.width / display.ctx.canvas.offsetWidth)

        buttons.filter(({ button }) => {
            const top = button.x <= x
            const bottom = button.x + button.width >= x
            const left = button.y <= y
            const right = button.y + button.height >= y
            return top && bottom && left && right
        }).forEach(callback)
    }
    display.ctx.canvas.addEventListener('mousedown', e => getClickedButtons(e,
        button => {
            if (button?.click) button.click()
            if (button?.bind) clickDownUp(e, button.bind)
        }
    ))
    display.ctx.canvas.addEventListener('mouseup', e => getClickedButtons(e,
        button => {
            debugger
            if (button?.bind) clickDownUp(e, button.bind)
        }
    ))
    const clickDownUp = (e, key) => {

        const state = e.type == 'mousedown'
        key.getInput(state)
    }
    return {
        setUI(_buttons) {
            buttons = _buttons
        },
        clear() {
            buttons = []
        },
        render() {
            buttons.forEach(({ button, img, text, visible }) => {
                const isVisible = (typeof visible == 'function' ? visible() : visible) ?? true
                if (isVisible) {

                    display.drawImg(button, img)
                    if (text) display.drawCentered(text, button, 2)
                }

            })
        }
    }
}
export default UIManager