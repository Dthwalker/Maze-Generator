export default class Walker {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
    }

    get wall() { return {x:this.x - Math.floor((this.x - this.oldX)/2),
                         y:this.y - Math.floor((this.y - this.oldY)/2)} }
    
    draw(ctx, size) {
        let [nx, ny]  = [this.x * size, this.y * size];
        ctx.fillStyle = 'rgb(0,150,255)'
        ctx.fillRect(nx, ny, size, size);
    }
    
}