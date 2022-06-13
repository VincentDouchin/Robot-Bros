const Engine = function (states) {
    let state
    const cycle = () => {
        window.requestAnimationFrame(cycle)
        state.update()
        state.render()
        setState(state.changeState())

    }
    const setState = (_state) => {
        if (!_state) return
        state = states[_state[0]]
        state.set(_state[1])
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