const Animator = function (img, delay = 20) {
    return {
        counter: 0,
        framesNb: img.width / img.height,
        selectedFrame: 0,
        delay,
        cycles: 0,
        getFrame() {
            return [img, this.selectedFrame * img.height, 0, img.height, img.height]
        },
        animate() {
            this.counter++
            if (this.counter >= this.delay) {
                this.selectedFrame = (this.selectedFrame + 1) % this.framesNb
                this.counter = 0
                this.cycles++
            }
        }
    }
}
export default Animator