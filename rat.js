import { Entity } from "./entity.js";
import { RAT_STATES } from "./state.js";

class Rat extends Entity {
    constructor (x, y, maze, vertices) {
        super(x, y, 0, 0, 0, 0, [0.2, 0.2, 0.2], vertices)

        this.state = RAT_STATES;

        this.maze = maze;

        this.SPIN_SPEED = 90;
        this.MOVE_SPEED = 1.0;
        this.FATNESS = .25;
        this.RAT_SCALE = 0.2;

    }

    spinLeft(DT) {
        this.rz += this.SPIN_SPEED*DT;
    }
    
    //Look at something in world coordinates
    look(x, y) {
        
        const translatedX = x - this.x
        const translatedY = y - this.y

        const rad = Math.atan2(translatedY, translatedX);

        this.rz = rad * (180/Math.PI);
    }

    //Move the direction we are pointing
    move(DT) {

        const dx = Math.cos(this.rz*(Math.PI/180))*DT;
        const dy = Math.sin(this.rz*(Math.PI/180))*DT;

        const newX = dx + this.x;
        const newY = dy + this.y;

        if (this.maze.isColliding(newX, newY, this.FATNESS)) {
            this.x = newX;
            this.y = newY;
        } else if (this.maze.isColliding(newX, this.y, this.FATNESS)) {
            this.x = newX;
        } else if (this.maze.isColliding(this.x, newY, this.FATNESS)) {
            this.y = newY;
        }
    }

    handleControlStates(DT) {
        if (this.state & RAT_STATES.MOVEFORWARD) {
            this.move(DT);
        } 
        if (this.state & RAT_STATES.ROTATELEFT) {
            if (this.state & RAT_STATES.MOVEFORWARD) {
                this.spinLeft(DT*2);
            } else {
                this.spinLeft(DT);
            }
        }
        if (this.state & RAT_STATES.MOVEBACKWARD) {
            this.move(-DT*0.5);
        }
        if (this.state & RAT_STATES.ROTATERIGHT) {
            if (this.state & RAT_STATES.MOVEFORWARD) {
                this.spinLeft(-DT);   
            } else {
                this.spinLeft((-DT)*2);
            }
        }
        if (this.state & RAT_STATES.SPRINTING) {
            this.move(DT);
        }
    }
}

export { Rat }