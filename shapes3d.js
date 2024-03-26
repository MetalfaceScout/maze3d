const mazeVbo = []

//Store tri to only be drawn once, must be CCW order
//Dont use
function storeTri(v1, v2, v3, u, v) {
	mazeVbo.push(v1[0], v2[0], v3[0], u[0], v[0])
	mazeVbo.push(v1[1], v1[1], v1[1], u[1], v[0])
	mazeVbo.push(v1[2], v2[2], v2[3], u[1], v[1])
}

//Store quad to be drawn once, must be in CCW order
function storeQuad(vertices, v1, uv1, v2, uv2, v3, uv3, v4, uv4) {
	// ex: v1 = (0,0,0), v2 = (1,0,0), v3 = (1,1,)
	vertices.push(
		v1[0], v1[1], v1[2], uv1[0], uv1[1],
		v2[0], v2[1], v2[2], uv2[0], uv2[1],
		v3[0], v3[1], v3[2], uv3[0], uv3[1],
	)
	vertices.push(
		v1[0], v1[1], v1[2], uv1[0], uv1[1],
		v3[0], v3[1], v3[2], uv3[0], uv3[1],
		v4[0], v4[1], v4[2], uv4[0], uv4[1],
	)
}

//Store a quad with UV data include in the vertex.
function storeQuadUV(vertices, v1, v2, v3, v4) {
	// ex: v1 = (0,0,0), v2 = (1,0,0), v3 = (1,1,)
	vertices.push(
		v1[0], v1[1], v1[2], v1[3], v1[4],
		v2[0], v2[1], v2[2], v2[3], v2[4],
		v3[0], v3[1], v3[2], v3[3], v3[4],
	)
	vertices.push(
		v1[0], v1[1], v1[2], v1[3], v1[4],
		v3[0], v3[1], v3[2], v3[3], v3[4],
		v4[0], v4[1], v4[2], v4[3], v4[4],
	)
}

//Store a tri with UV.
function storeTriUV(vertices, v1, v2, v3) {
	vertices.push(
		v1[0], v1[1], v1[2], v1[3], v1[4],
		v2[0], v2[1], v2[2], v2[3], v2[4],
		v3[0], v3[1], v3[2], v3[3], v3[4],
	)	
}

function storeQuadBart(vertices, x1, y1, z1, u1,v1, x2, y2, z2, u2,v2, x3, y3, z3, u3,v3, x4, y4, z4, u4,v4) {
	vertices.push(x1, y1, z1, u1,v1, x2, y2, z2, u2,v2, x3, y3, z3, u3,v3);
	vertices.push(x1, y1, z1, u1,v1, x3, y3, z3, u3,v3, x4, y4, z4, u4,v4);
}

function bindBuffers(gl, shaderProgram, vertices) {
	const vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition')
	gl.vertexAttribPointer(
		positionAttribLocation,
		3, //elt per att
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		0 * Float32Array.BYTES_PER_ELEMENT
	)
	gl.enableVertexAttribArray(positionAttribLocation)

	//UV
	const uvAttribLocation = gl.getAttribLocation(shaderProgram, 'vertUV')
	gl.vertexAttribPointer(
		uvAttribLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT
	)
	gl.enableVertexAttribArray(uvAttribLocation)
}

//Draw all stored, should be called once per frame
function drawStored(gl, shaderProgram, vertices) {
	bindBuffers(gl, shaderProgram, vertices);
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length/5)
}




export {storeQuad, storeQuadUV, storeTriUV, drawStored, storeQuadBart};