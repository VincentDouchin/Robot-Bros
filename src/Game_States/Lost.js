

const Pause = function (display, controller) {
    return {
        render() {

        },
        update() {

        },
        changeState() {
            if (controller.get('pause')) {
                controller.set('pause', false)
                return 'run'
            }
        }
    }
}
export { Pause }