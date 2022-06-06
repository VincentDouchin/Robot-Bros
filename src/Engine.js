const Engine = function () {
    let state
    let states
    const cycle = () => {
        window.requestAnimationFrame(cycle)
        state.update()
        state.render()
        setState(state.changeState())

    }
    const setState = (_state) => {
        if (!_state) return
        state = states[_state]
    }
    return {
        setState,
        setStates(_states) {
            states = _states
        },
        start() {
            cycle()
        },
        stop() {
            window.cancelAnimationFrame()
        }
    }
}

export { Engine }