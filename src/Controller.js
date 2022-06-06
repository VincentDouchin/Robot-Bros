const Controller = (keysObject) => {
    function isKeyOfController(key) {

        return Object.values(keysObject).includes(key)
    }
    const Input = function () {
        return {
            active: false,
            down: false,
            getInput(state) {
                if (this.down != state) this.active = state
                this.down = state
            }
        }
    }
    // const keys = { [left]: Input(), [right]: Input(), [up]: Input(), [down]: Input() }
    const keys = Object.values(keysObject).reduce((acc, v) => {
        return { ...acc, [v]: Input() }
    }, {})
    const keyDownUp = (e) => {
        const state = e.type == 'keydown'
        e.preventDefault()
        if (isKeyOfController(e.key)) keys[e.key].getInput(state)

    }
    document.addEventListener('keydown', keyDownUp)
    document.addEventListener('keyup', keyDownUp)

    const getKeyName = key => Object.entries(keysObject).find(x => x[0] == key)[1]

    return {
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