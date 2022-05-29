const Engine = function () {
    let running = false
    let state
    const cycle = () => {
        window.requestAnimationFrame(cycle)
        state.update()
        state.render()
    }
    return {
        setState(stateToSet) {
            state = stateToSet
        },
        start() {
            running = true
            cycle()
        },
        stop() {
            window.cancelAnimationFrame()
        }
    }
}

export { Engine }