
import { Controller } from "./../Controller"
const Pause = function (display, controller) {
    // const controller = Controller({ pause: 'p' })
    return {
        render() {

        },
        update() {

        },
        changeState() {
            if (controller.pause.once) {
                return 'run'
            }
        }
    }
}
export { Pause }