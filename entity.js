import { storeQuadUV, drawStored, storeTriUV } from "./shapes3d.js";

//So far an entity has a place in the world and can draw itself.
class Entity {
    constructor(x,y,z, rx,ry,rz, scalearray,vertices) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.scale = scalearray;
        this.vertices =  vertices;
    }

    draw(gl, shaderProgram) {
        
        let drawvertices = [];

        //Create model view matrix
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        let modelViewMatrix = mat4.create();

        //Translate, rotate and scale
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, this.z]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [this.scale[0], this.scale[1], this.scale[2]]);
        
        mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rx*Math.PI/180);
        mat4.rotateY(modelViewMatrix, modelViewMatrix, this.ry*Math.PI/180);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rz*Math.PI/180);

        //Insert into shader
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        //Extract vertex information from array and parse it into data readable by webGL
        this.vertices.forEach(face => {
            if (face.length == 4) {
                //store quad
                storeQuadUV(drawvertices,
                    face[0],
                    face[1],
                    face[2],
                    face[3]
                )
            }
            else {
                storeTriUV(drawvertices,
                    face[0],
                    face[1],
                    face[2]    
                )
            }
        });

        //With our model view matrix setup, and vertices parsed, we can draw
        drawStored(gl, shaderProgram, drawvertices);
    }
}

export {Entity}