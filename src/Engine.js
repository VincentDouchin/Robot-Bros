const Engine = function (states) {
    let state
    const cycle = () => {
        window.requestAnimationFrame(cycle)
        state.update()
        state.render()


    }
    const setState = (_state, options) => {
        if (!_state) return

        const s = states[_state]
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