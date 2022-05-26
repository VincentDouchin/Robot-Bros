const Controller = (left, right, up, down) => {
    function isKeyOfController(key) {

        return [left, right, up, down].includes(key)
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
    const keys = { [left]: Input(), [right]: Input(), [up]: Input(), [down]: Input() }
    const keyDownUp = (e) => {
        const state = e.type == 'keydown'
        e.preventDefault()
        if (isKeyOfController(e.key)) keys[e.key].getInput(state)

    }
    document.addEventListener('keydown', keyDownUp)
    document.addEventListener('keyup', keyDownUp)



    return {
        left: () => keys[left].active,
        right: () => keys[right].active,
        up: () => keys[up].active,
        down: () => keys[down].active,
        setUp: state => keys[up].active = state

    }
}


export { Controller }