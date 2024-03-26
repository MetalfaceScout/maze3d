import { randomDouble, randomInt } from "./random.js";
import { drawLine, drawLineStrip} from "./shapes2d.js";
import { drawStored, storeQuad } from "./shapes3d.js";

class Cell{
    constructor(){
        this.left = true;
        this.bottom = true;
        this.right = true;
        this.top = true;
        this.visited = false;
    }

    storeVerts(r, c, vertices) {
        const x = c;
        const y = r;
        if (this.left){
            storeQuad(
                vertices,
                [x, y+1, 1], [1,1], //^->
                [x, y, 1], [1,0],  //^
                [x, y, 0],  [0,0], //.
                [x, y+1, 0], [0,1], //>
            );
        }
        if (this.bottom){
            storeQuad(
                vertices,
                [x+1, y, 1], [0,1],
                [x, y, 1], [1,1],
                [x, y, 0], [1,0],
                [x+1, y, 0], [0,0],
            )
        }
        if(this.top){
            storeQuad(
                vertices,
                [x+1, y+1, 1], [0,1],
                [x, y+1, 1], [1,1],
                [x, y+1, 0], [1,0],
                [x+1, y+1, 0], [0,0],
            )
        }        
        if(this.right){
            storeQuad(
                vertices,
                [x+1, y+1, 1], [1,1], //^->
                [x+1, y, 1], [1,0],  //^
                [x+1, y, 0],  [0,0], //.
                [x+1, y+1, 0], [0,1], //>
            );
        }
    }

    drawFlat(gl, shaderProgram, x,y){
        const vertices = [];
        if (this.left){
            vertices.push(x,y, x, y+1);
        }
        if (this.bottom){
            vertices.push(x,y, x+1,y);
        }
        if(this.top){
            vertices.push(x, y+1, x+1, y+1);
        }        
        if(this.right){
            vertices.push(x+1, y, x+1, y+1);
        }
        drawLine(gl, shaderProgram, vertices);
    }
}
class Maze{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.cells = []
        for(let r=0; r<this.height; r++){
            this.cells.push([])
            for(let c= 0; c<this.width; c++){
                this.cells[r].push(new Cell());
            }
        }

        this.RemoveWalls(0,0);


        this.path = [];

        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                this.cells[r][c].visited = false;
            }
        }

        this.findPath(0,0);
        
        this.cells[0][0].bottom = false;
        this.cells[this.height-1][this.width-1].top = false;

        this.mazeVerts = [];

        this.storeVerts(this.mazeVerts);

    }

    findPath(r,c) {
        this.cells[r][c].visited = true
        this.path.push(c+0.5);
        this.path.push(r+0.5);
        if (c==this.width-1 && r==this.height-1) {
            return true;
        }
        //try moving left
        if (!this.cells[r][c].left && !this.cells[r][c-1].visited) {
            if (this.findPath(r,c-1)) {
                return true;
            }
        }
        //try moving right
        if (!this.cells[r][c].right && !this.cells[r][c+1].visited) {
            if (this.findPath(r,c+1)) {
                return true;
            }
        }
        if (!this.cells[r][c].top && !this.cells[r+1][c].visited) {
            if (this.findPath(r+1,c)) {
                return true;
            }
        }
        if (!this.cells[r][c].bottom && !this.cells[r-1][c].visited) {
            if (this.findPath(r-1,c)) {
                return true;
            }
        }

        this.path.pop();
        this.path.pop();
        return false;
    }

    drawPath(gl, shaderProgram) {
        drawLineStrip(gl, shaderProgram, this.path, [1,0,1,1]);
    }

    RemoveWalls(r,c){
        this.cells[r][c].visited = true;
        const left = 0;
        const bottom = 1;
        const right = 2;
        const top = 3;

        while (true){
            // Find all the directions we could go:
            const possibilities = [];
            if (c>0 && this.cells[r][c-1].visited == false){
                possibilities.push(left);
            }
            // repeat 3 more times
            if (c<this.width-1 && this.cells[r][c+1].visited == false){
                possibilities.push(right);
            }
            if (r<this.height-1 && this.cells[r+1][c].visited == false){
                possibilities.push(top);
            }
            if (r>0 && this.cells[r-1][c].visited == false){
                possibilities.push(bottom);
            }

            // if possibilites is none then return
            if (possibilities.length == 0) {
                return
            }

            // randomly choose which direction
            let direction = possibilities[randomInt(0,possibilities.length)];

            // Go that direction by knocking out walls, and recursing.
            switch (direction) {
                case left:
                    this.cells[r][c].left = false
                    this.cells[r][c-1].right = false
                    this.RemoveWalls(r, c-1);
                    break;
                case right:
                    this.cells[r][c].right = false
                    this.cells[r][c+1].left = false
                    this.RemoveWalls(r, c+1);
                    break;
                case top:
                    this.cells[r][c].top = false
                    this.cells[r+1][c].bottom = false
                    this.RemoveWalls(r+1, c);
                    break;
                case bottom:
                    this.cells[r][c].bottom = false
                    this.cells[r-1][c].top = false
                    this.RemoveWalls(r-1, c);
                    break;
            }
        }

    }
    draw(gl, shaderProgram, flat){
        if (flat) {
            for(let r=0; r<this.height; r++){
                for(let c= 0; c<this.width; c++){
                    this.cells[r][c].drawFlat(gl, shaderProgram, c, r);
                }
            }
        } else {
            drawStored(gl, shaderProgram, this.mazeVerts)
        }
    }

    storeVerts(verts) {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                this.cells[r][c].storeVerts(r,c, verts)
            }
        }
    }

    isColliding(x, y, fatness) {
        const column = Math.floor(x);
        const offsetX = x - column

        const row = Math.floor(y);
        const offsetY = y - row

        const r = row;
        const c = column;

        // test right wall
        if (this.cells[r][c].right && (offsetX + fatness) > 1.0) {
            return false
        }

        // test left wall
        if (this.cells[r][c].left && (offsetX - fatness) < 0) {
            return false
        }
        
        // test top wall
        if (this.cells[r][c].top && (offsetY + fatness) > 1.0) {
            return false
        }

        //test bottom wall
        if (this.cells[r][c].bottom && (offsetY - fatness) < 0) {
            return false
        }

        // test for bottom right corner
        if ((offsetX + fatness) > 1 && (offsetY - fatness) < 0) {
            return false
        }

        // test for bottom left corner
        if ((offsetX - fatness) < 0 && (offsetY - fatness) < 0) {
            return false
        }

        // test for top right corner
        if ((offsetX + fatness) > 1 && (offsetY + fatness) > 1) {
            return false
        }

        // test for top left corner
        if ((offsetX - fatness) < 0 && (offsetY + fatness) > 1) {
            return false
        }
        
        return true

    }
}

export {Maze};