const Controller = async (keysObject) => {
    const layout = await navigator.keyboard.getLayoutMap()
    const azerty = layout.get('KeyA') == 'a'
    let gamepadSupport = false
    let touchSupport = navigator.userAgentData.mobile
    const keys = {
        up: [(azerty ? 'KeyZ' : 'KeyW'), 'ArrowUp'],
        down: ['KeyS', 'ArrowDown'],
        left: [(azerty ? 'KeyQ' : 'KeyA'), 'ArrowLeft'],
        right: ['KeyD', 'ArrowRight'],
        enter: ['Space', 'Enter', 'NumpadEnter'],
        pause: ['KeyP'],
        jump: ['KeyL'],
        shoot: [(azerty ? 'KeyM' : 'Semicolon')]
    }


    window.addEventListener("gamepadconnected", x => {
        console.log('gamepad deteted')
        gamepadSupport = true
    })
    window.addEventListener("gamepaddisconnected", x => {
        gamepadSupport = false
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

    // const keys = { [left]: Input(), [right]: Input(), [up]: Input(), [down]: Input() }

    const keyDownUp = (e) => {

        e.preventDefault()
        const state = e.type == 'keydown'
        const key = Object.entries(keys).find(([key, codes]) => codes.includes(e.code))?.[0]
        if (key) inputs[key].getInput(state)

    }
    document.addEventListener('keydown', keyDownUp)
    document.addEventListener('keyup', keyDownUp)

    const getKeyName = key => Object.entries(keysObject).find(x => x[0] == key)[1]

    return {
        get inputs() {
            const inputs = touchSupport ? ['touch'] : ['keyboard']
            if (gamepadSupport) {
                inputs.push('controller')
            }
            return inputs
        },
        ...inputs,
        // left: () => keys[left].active,
        // right: () => keys[right].active,
        // up: () => keys[up].active,
        // down: () => keys[down].active,
        // setUp: state => keys[up].active = state,
        get: key => keys[getKeyName(key)].active,
        set: (key, state) => keys[getKeyName(key)].active = state



    }
}


export { Controller }