

const Pause = function (display, controller) {
    return {
        set() {

        },
        render() {

        },
        update() {

        },
        changeState() {
            if (controller.get('pause')) {
                controller.set('pause', false)
                return ['run']
            }
        }
    }
}
export { Pause }