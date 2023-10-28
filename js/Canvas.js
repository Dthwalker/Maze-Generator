export default class Canvas {

    constructor(w, h, size, angle) {
        this.canvas    = document.querySelector('#maze');
        this.ctx       = this.canvas.getContext('2d');
        this.w         = w;
        this.h         = h;
        this.size      = size;
        this.angle     = angle
    }

    canvasResize() {
        this.canvas.width  = this.w * this.size;
        this.canvas.height = this.h * this.size + this.angle;
    }

    update() {
        this.canvasResize();
    }

}