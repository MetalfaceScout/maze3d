import { storeQuadUV, drawStored, storeTriUV, createVbo, drawStoredVbo } from "./shapes3d.js";
import { Textures } from "./texture.js";

//So far an entity has a place in the world and can draw itself, and has a texture.
class Entity {
    constructor(x,y,z, rx,ry,rz, scalearray, vertices, textures, texturefile, gl) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.scale = scalearray;

        this.vertices = []

        vertices.forEach(face => {
            if (face.length == 4) {
                //store quad
                storeQuadUV(this.vertices,
                    face[0],
                    face[1],
                    face[2],
                    face[3]
                )
            }
            else {
                storeTriUV(this.vertices,
                    face[0],
                    face[1],
                    face[2]    
                )
            }
        });

        this.textureindex = textures.createTexture(texturefile);
        this.vbo = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vboLength = this.vertices.length;
    }

    draw(gl, shaderProgram) {
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

        //With our model view matrix setup, and vertices parsed, we can draw
        drawStoredVbo(gl, shaderProgram, this.vbo, this.vboLength, this.textureindex);
    }
}

export {Entity}