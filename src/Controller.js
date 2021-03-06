const Controller = async (keysObject) => {


    let gamepadInterval
    const buttons = {
        up: [12],
        down: [13],
        left: [14],
        right: [15],
        enter: [0],
        pause: [9],
        jump: [0],
        shoot: [2],
    }
    const keys = {
        up: ['z', 'ArrowUp'],
        down: ['s', 'ArrowDown'],
        left: ['q', 'ArrowLeft'],
        right: ['d', 'ArrowRight'],
        enter: [' ', 'Enter', 'NumpadEnter'],
        pause: ['KeyP', 'Escape'],
        jump: ['l', ' '],
        shoot: ['m', ' Enter']
    }


    window.addEventListener("gamepadconnected", x => {
        console.log('gamepad deteted')
        gamepadSupport = true
        gamepadInterval = setInterval(() => {
            navigator.getGamepads()[0].buttons.forEach(({ pressed }, buttonIndex) => {

                Object.entries(buttons).filter(([button, nb]) => nb.includes(buttonIndex)).forEach(([button, nb]) => {
                    inputs[button]?.getInput(pressed)
                })
            })
        }, 10)
    })
    window.addEventListener("gamepaddisconnected", x => {
        gamepadSupport = false
        gamepad = null
    })

    const Input = function () {
        return {
            active: false,
            down: false,
            get once() {
                if (this.active) {
                    this.active = false
                    return true
                }
                return false
            },
            getInput(state) {
                if (this.down != state) this.active = state
                this.down = state
            }
        }
    }
    const inputs = Object.keys(keys).reduce((acc, v) => ({ ...acc, [v]: Input() }), {})


    const keyDownUp = (e) => {

        e.preventDefault()
        const state = e.type == 'keydown'
        const key = Object.entries(keys).find(([key, codes]) => codes.includes(e.key))?.[0]
        if (key) inputs[key].getInput(state)

    }
    document.addEventListener('keydown', keyDownUp)
    document.addEventListener('keyup', keyDownUp)

    const getKeyName = key => Object.entries(keysObject).find(x => x[0] == key)[1]

    return {
        ...inputs,
        get: key => keys[getKeyName(key)].active,
        set: (key, state) => keys[getKeyName(key)].active = state



    }
}


export { Controller }