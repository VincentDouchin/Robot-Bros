const Engine = function (uiManager) {
    let state
    let states
    const cycle = () => {
        window.requestAnimationFrame(cycle)
        state.update()
        uiManager.update()
        state.render()
        uiManager.render()


    }
    const setState = (_state, options = {}) => {
        if (!_state) return

        const s = states[_state]
        uiManager.clear()
        s.set(options)
        state = s
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