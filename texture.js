class Textures {
    constructor (gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.textureCount = 0;
        this.activeTexture = 0;
    }

    //Creates a texture, loads it on to the gpu then gives back an index that can be passed into draw to use that texture
    createTexture (filename) {
        this.gl.activeTexture(this.gl.TEXTURE0+this.textureCount);
	    this.loadTexture(this.gl, filename);
	    this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "uTexture" + this.textureCount), this.textureCount);
        this.textureCount += 1;
        return this.textureCount-1;
    }

    loadTexture(gl, url) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Fill the texture with a 1x1 blue pixel while waiting for the image to load
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      
        const image = new Image();
        image.onload = function () {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = url;
        return texture;
    }
}

export { Textures };