
import { Controller } from "./../Controller"
const Pause = function (display, controller, uiManager, engine) {
    return {
        set() {

        },
        render() {

        },
        update() {
            if (controller.pause.once) {
                engine.setState('run')
            }
        },

    }
}
export { Pause }