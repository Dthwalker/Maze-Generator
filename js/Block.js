export default class Block {
    
    constructor(x, y) {
        this.x       = x;
        this.y       = y;
        this.isWall  = false;
        this.isVisit = false;
    }
    
    draw(ctx, size) {
        if (!this.isWall) {
            ctx.fillStyle = 'rgb(240,240,240)';
            let [nx, ny] = [this.x * size, this.y * size];
            ctx.fillRect(nx, ny, size, size);
            ctx.fillStyle = 'rgb(170,170,170)';
            ctx.fillRect(nx, ny + size, size, size * 0.3)
        }
    }
    
}