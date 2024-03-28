import { Entity } from "./entity.js";

class Shoe extends Entity {
    constructor(x, y, vertices, textures, maze, gl) {
        super(x, y, 0, 0, 0, 180, [0.5, 0.5, 0.5], vertices, textures, "textures/shoe.png", gl);
    }
}

export { Shoe };