const Engine = function (uiManager) {


    let raf_handle
    let accumulated_time = 0
    let current_time = 0
    let time_step = 1000 / 60


    let state
    let states
    const cycle = (time_stamp) => {
        raf_handle = window.requestAnimationFrame(cycle)

        accumulated_time += time_stamp - current_time
        current_time = time_stamp;

        let updated = false

        if (accumulated_time > 60) accumulated_time = time_step

        while (accumulated_time >= time_step) {

            state.update()
            uiManager.update()

            updated = true

            accumulated_time -= time_step

        }

        if (updated) {
            state.render()
            uiManager.render()
        }





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
            raf_handle = window.requestAnimationFrame(cycle)
        },
        stop() {
            window.cancelAnimationFrame()
        }
    }
}

export { Engine }