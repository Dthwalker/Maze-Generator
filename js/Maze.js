import Block from "./Block.js";
import Walker from "./Walker.js";


export default class Maze {

    constructor(w, h, s, start, speed) {
        this.w      = w;
        this.h      = h;
        this.size   = s;
        this.data   = [];
        this.start  = [this.w, this.h].map(e => {
            return Math.floor(e / 2) % 2 == 0 ? Math.floor(e / 2) - 1 : Math.floor(e / 2)
        })
        this.walker = new Walker(...this.start);
        this.steps  = [{x:this.walker.x, y:this.walker.y}];
        this.speed  = speed < 1 ? 1 : speed;
        this.end    = false;
        this.timer  = 0;

        this.createData(this.start);
    }

    random(min, max){
        return Math.round(Math.random() * (max - min) + min)
    }

    createData(start) {
        this.data = [];
        
        for (let y = 0; y < this.h; y++) {
            this.data.push([])
            for (let x = 0; x < this.w; x++) {
                let block = new Block(x, y)
                this.data[y].push(block);
            }
        }
        
        let startBlock = this.data[start[1]][start[0]]
        startBlock.isVisit = startBlock.isWall = true;

        let ee = this.random(0,1)
        if (ee) {
            this.data[0+1][0].isWall = this.data[this.h - 2][this.w - 1].isWall = true
        } else {
            this.data[0][1].isWall = this.data[this.h - 1][this.w - 2].isWall = true
        }
    }

    forOdd(callback) {
        for (let y = 1; y < this.h; y+=2) {
            for (let x = 1; x < this.w ; x+=2) {
                if (this.data[y][x].isVisit) {
                    callback(x, y)
                }
            }
        }
    }

    cellOdd(x, y, callback) {
        y > 1 && !this.data[y - 2][x].isWall ? callback(x, y - 2) : null;
        x > 1 && !this.data[y][x - 2].isWall ? callback(x - 2, y) : null;
        x < this.w - 3 && !this.data[y][x + 2].isWall ? callback(x + 2, y) : null;
        y < this.h - 3 && !this.data[y + 2][x].isWall ? callback(x, y + 2) : null;
    }

    checkPos(x, y) {
        let arr = []
        y > 1 && !this.data[y - 2][x].isWall ? arr.push({x:x, y:y - 2}) : null;
        x > 1 && !this.data[y][x - 2].isWall ? arr.push({x:x - 2, y:y}) : null;
        x < this.w - 3 && !this.data[y][x + 2].isWall ? arr.push({x:x + 2, y:y}) : null;
        y < this.h - 3 && !this.data[y + 2][x].isWall ? arr.push({x:x, y:y + 2}) : null;
        return arr
    }


    draw(ctx, path, walker) {
        let size = this.size;
        this.data.forEach(a => a.forEach(e => e.draw(ctx, size)));
        walker ? this.walker.draw(ctx, size) : null
        
        if (path) {
            ctx.fillStyle = 'rgb(100,100,100)';
            let m    = this.size * 0.2
            this.forOdd((x, y) => {
                let d = (a, b) => {
                    ctx.fillRect(a*size+m, b*size+m, size-m*2, size-m*2);
                }
                this.cellOdd(x, y, d);
            });
        }
    }

    generate() {
        this.steps = this.steps.filter(e => {
            return this.checkPos(e.x, e.y).length > 0;
        })

        let oldPose = this.steps[this.random(0, this.steps.length - 1)];
        if (!oldPose) {
            this.end = true;
            return
        }
        
        this.walker = new Walker(oldPose.x, oldPose.y);

        let newPose = this.checkPos(oldPose.x, oldPose.y);
        newPose = newPose[this.random(0, newPose.length - 1)];

        [this.walker.x, this.walker.y] = [newPose.x, newPose.y];
        
        this.data[newPose.y][newPose.x].isWall  = 
        this.data[newPose.y][newPose.x].isVisit = true;

        let wall = this.walker.wall
        this.data[wall.y][wall.x].isWall = true

        this.steps.push({x:newPose.x, y:newPose.y});
        this.timer++
    }

    fastGenerate() {
        while (this.timer < this.speed) {
            this.timer++
            this.generate()
        }
        this.timer = -1;
    }

}