import Canvas from "./Canvas.js";
import Maze from "./Maze.js";

class Main {

    static init() {
        this.inputs    = document.querySelectorAll('input')
        this.w         = this.width; // Odd int
        this.h         = this.height; // Odd int
        this.s         = this.size;
        this.startPos  = [1, 1];
        this.speed     = 0;
        this.path      = true;
        this.start     = false;
        this.timer     = 0;
        this.sWalker   = true;
        this.angle     = this.s * 0.3

        this.canvas = new Canvas(this.w, this.h, this.s, this.angle);
        this.maze   = new Maze(this.w, this.h, this.s, this.startPos, this.gSpeed);
        this.controls();

        this.loop();
    }

    static get width()    { return Number(this.inputs[0].value) }
    static get height()   { return Number(this.inputs[1].value) }
    static get size()     { return Number(this.inputs[2].value) }
    static get gSpeed()   { return Number(this.inputs[3].value) }

    static resize() {
        this.w         = this.width % 2 == 0 ? this.width+1 : this.width;
        this.h         = this.height % 2 == 0 ? this.height + 1 : this.height;
        this.inputs[0].value = this.w;
        this.inputs[1].value = this.h;
        this.s         = this.size;
    }

    static reset() {
        this.start   = false;
        this.sWalker = true;
        this.resize();
        this.canvas = new Canvas(this.w, this.h, this.s, this.angle);
        this.maze    = new Maze(this.w, this.h, this.s, this.startPos, this.gSpeed);
        console.log(this.maze.data)
        this.timer   = 0;
        document.querySelector('#start').innerHTML = 'Start';
        document.querySelector('#fast').innerHTML = 'Fast Generate';
        this.draw();
    }

    static controls() {
            document.querySelectorAll('.nav button').forEach((e,i) => {
                e.onclick = () => {
                    i == 0 ? this.generate() : null;
                    if (i == 1) {
                        this.start = !this.start;
                        e.innerHTML = this.start ? 'Pause' : 'Start';
                        this.loop();
                    }
                    i == 2 ? this.reset() : null;
                    if (i == 3) {
                        this.path = !this.path;
                        this.draw();
                    }
                    if (i == 4 ) {
                        this.sWalker = !this.sWalker;
                        this.draw();
                    }
                    if (i == 5 ) {
                        this.start = !this.start;
                        e.innerHTML = this.start ? 'Pause' : 'Fast Generate';
                        this.fastLoop();
                    }
                }
            });
    }

    static generate() {
        if (this.maze.end) {
            this.end();
            return
        }
        this.timer++
        this.maze.generate();
        this.draw();
    }

    static fastGenerate() {
        if (this.maze.end) {
            this.end();
            return
        }
        this.timer += this.gSpeed;
        this.maze.fastGenerate();
        this.draw();
    }

    static draw() {
        this.canvas.update();
        this.maze.draw(this.canvas.ctx, this.path, this.sWalker);
        document.querySelector('#timer').innerHTML = `Gen: ${this.timer}`
    }

    static end() {
        this.start = this.sWalker = false;
        this.draw();
        console.log(this.maze.data)
        document.querySelector('#start').innerHTML = 'Start';
        document.querySelector('#fast').innerHTML  = 'Fast Generate';
        document.querySelector('#timer').innerHTML = `Generation is ready: ${this.timer}`
    }

    static loop() {
        this.draw();
        if (this.maze.end) {
            this.end();
            return
        }

        if (this.start) {
            this.generate();
            setTimeout(this.loop.bind(this), this.speed);
        }
    }

    static fastLoop() {
        this.draw();
        if (this.maze.end) {
            this.end();
            return
        }

        if (this.start) {
            this.fastGenerate();
            setTimeout(this.fastLoop.bind(this), this.speed);
        }
    }

}

Main.init();