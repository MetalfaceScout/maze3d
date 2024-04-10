import { initShaderProgram } from "./shader.js";
import { Maze } from "./maze.js";
import { Rat } from "./rat.js";
import { Shoe } from "./shoe.js";
import { VIEW_STATES, RAT_STATES } from "./state.js";
import { Textures } from "./texture.js";

let currentView = VIEW_STATES.OBSERVATION_VIEW

/*
TODO: Gather all quads as triangles and draw them all in one frame
Save the VertexBufferObject, only compute vertices per frame 
Get 2d objects to draw in 3d
Have top and rat view and observation view work

Next assignment: Image -> mapped -> GLQuad
*/

main();
async function main() {
	console.log('This is working');

	//
	// start gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');

	const maxTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	//
	// Create shaders
	// 
	const vertexShaderText = await(await fetch("simple.vs")).text();
	const fragmentShaderText = await(await fetch("simple.fs")).text();
	const shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);

	//
	// Bind textures
	//

	let globalTextures = new Textures(gl, shaderProgram);

	//
	// Create content to display
	//
	const WIDTH = 2;
	const HEIGHT = 2;
	const m = new Maze(WIDTH, HEIGHT, globalTextures, gl, shaderProgram);


	let ratverts = await((await fetch("objects/hampterone.json")).json()) 

	const rat = new Rat(0.5, 0.5, m, ratverts, globalTextures, gl);

	let shoeverts = await((await fetch("objects/shoe.json")).json()) 

	const shoe = new Shoe(WIDTH - 0.5, HEIGHT - 0.5, shoeverts, globalTextures, m, gl);

	//
	// load a projection matrix onto the shader
	// 
	

	const margin = 0.5;
	let xlow = -margin;
	let xhigh = WIDTH+margin;
	let ylow = -margin;
	let yhigh = HEIGHT+margin;

	let worldXHigh = xhigh;
	let worldYHigh = yhigh;
	let worldXLow = xlow;
	let worldYLow = ylow;


	//
	// load a modelview matrix onto the shader
	// 
	const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	const identityMatrix = mat4.create();
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix);

	//
	// Register Listeners
	//
	
	addEventListener("click", click);
	function click(event) {
		console.log("click");
		const xWorld = xlow + event.offsetX / gl.canvas.clientWidth * (xhigh - xlow);

		const yWorld = ylow + (gl.canvas.clientHeight - event.offsetY) / gl.canvas.clientHeight * (yhigh - ylow);
		// Do whatever you want here, in World Coordinates.
	};

	addEventListener("mousemove", (event) => {
		const xWorld = worldXLow + event.offsetX / gl.canvas.clientWidth * (worldXHigh - worldXLow);
		const yWorld = worldYLow + (gl.canvas.clientHeight - event.offsetY) / gl.canvas.clientHeight * (worldYHigh - worldYLow);
		//rat.look(xWorld, yWorld, worldXHigh, worldYHigh);
	}); 

	addEventListener("keydown", (e) => {
		handleKeydown(e, rat);
	});

	addEventListener("keyup", (e) => {
		handleKeyup(e, rat);
	})

	function handleKeydown(event, rat) {
		console.log(event.keyCode)
		switch (event.keyCode) {
			case 84:
				currentView = VIEW_STATES.TOP_VIEW;
				break;
			case 79:
				currentView = VIEW_STATES.OBSERVATION_VIEW;
				break;
			case 82:
				currentView = VIEW_STATES.RAT_VIEW;
				break;
			case 38: //Arrow up
				rat.state |= RAT_STATES.MOVEFORWARD;
				break;
			case 37: //Arrow left
				rat.state |= RAT_STATES.ROTATELEFT;
				break;
			case 39: //Arrow right
				rat.state |= RAT_STATES.ROTATERIGHT;
				break;
			case 40: //Arrow down
				rat.state |= RAT_STATES.MOVEBACKWARD;
				break;
			case 83:
				rat.state |= RAT_STATES.SPRINTING;
				break;
		}
	}

	function handleKeyup(event, rat) {
		switch (event.keyCode) {

			case 38: //Arrow up
				rat.state &= ~RAT_STATES.MOVEFORWARD;
				break;
			case 37: //Arrow left
				rat.state &= ~RAT_STATES.ROTATELEFT;
				break;
			case 39: //Arrow right
				rat.state &= ~RAT_STATES.ROTATERIGHT;
				break;
			case 40: //Arrow down
				rat.state &= ~RAT_STATES.MOVEBACKWARD;
				break;
			case 83:
				rat.state &= ~RAT_STATES.SPRINTING;
				break;
		}
	}


	//
	// Main render loop
	//
	let previousTime = 0;
	function redraw(currentTime){
		currentTime *= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		if(DT > .1)
			DT = .1;
		previousTime = currentTime;

		gl.uniform1f(gl.getUniformLocation(shaderProgram, "useColor"), 0.0);

		rat.handleControlStates(DT);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix);

		gl.uniform1f(gl.getUniformLocation(shaderProgram, "fragTexIndex"), 0);

		if (currentView == VIEW_STATES.OBSERVATION_VIEW) {
			setObservationView(gl, shaderProgram, WIDTH, HEIGHT);
			m.draw(gl, shaderProgram);
		} else if (currentView == VIEW_STATES.TOP_VIEW) {
			gl.uniform1f(gl.getUniformLocation(shaderProgram, "useColor"), 1.0);
			gl.uniform3f(gl.getUniformLocation(shaderProgram, "color2d"), 1.0, 0.0, 0.0);
			setTopView(gl, shaderProgram, canvas, xhigh, xlow, yhigh, ylow, worldXHigh, worldXLow, worldYHigh, worldYLow);
			m.draw(gl, shaderProgram, true);
			gl.uniform1f(gl.getUniformLocation(shaderProgram, "useColor"), 0.0);
		} else if (currentView == VIEW_STATES.RAT_VIEW) {
			setRatsView(gl, shaderProgram, WIDTH, HEIGHT, rat);
			m.draw(gl, shaderProgram)
		}

		gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix);
		//m.drawPath(gl, shaderProgram);
	
		rat.draw(gl, shaderProgram);

		gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix);
		//rat.move(DT);

		shoe.draw(gl, shaderProgram);
		
		requestAnimationFrame(redraw);
	}
	requestAnimationFrame(redraw);

};

function setObservationView(gl, shaderProgram, WIDTH, HEIGHT) {
	let fovDegrees = 60;
	let fov = (fovDegrees*180)/Math.PI;
	//What's difference between gl.canvas and canvas??
	let canvasAspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const nearPlane = 0.1;
	const farPlane = WIDTH+HEIGHT;

	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fov, canvasAspect, nearPlane, farPlane)


	const lookAtMatrix = mat4.create();

	const eye = [WIDTH/2-0.5, -HEIGHT/6, (WIDTH/2)+1] //where the camera is
	const at = [WIDTH/2, HEIGHT/2, 0] //where the camera is looking
	const up = [0, 0, 1]; //the up vector

	mat4.lookAt(lookAtMatrix, eye, at, up);

	mat4.multiply(projectionMatrix, projectionMatrix, lookAtMatrix);

	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
}

function setRatsView(gl, shaderProgram, WIDTH, HEIGHT, rat) {
	let fovDegrees = -90;
	let fov = (fovDegrees*180)/Math.PI;
	//What's difference between gl.canvas and canvas??
	let canvasAspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const nearPlane = 0.1;
	const farPlane = WIDTH+HEIGHT;

	//squareWorld();

	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fov, canvasAspect, nearPlane, farPlane)


	const lookAtMatrix = mat4.create();

	const eye = [rat.x, rat.y, 0.5] //where the camera is
	const atX = Math.cos(rat.rz*(Math.PI/180)) + rat.x;
	const atY = Math.sin(rat.rz*(Math.PI/180)) + rat.y;
	const at = [atX, atY, 0] //where the camera is looking
	const up = [0, 0, 1]; //the up vector

	mat4.lookAt(lookAtMatrix, eye, at, up);

	mat4.multiply(projectionMatrix, projectionMatrix, lookAtMatrix);

	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
}


function setTopView(gl, shaderProgram, canvas, xhigh, xlow, yhigh, ylow, worldXHigh, worldXLow, worldYHigh, worldYLow) {
	//TODO: This is topview, so this
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const projectionMatrix = mat4.create();
	const aspect = canvas.clientWidth / canvas.clientHeight

	const width = xhigh - xlow
	const height = yhigh - ylow

	if (aspect >= width/height) {
		const newWidth = aspect*height;
		const xMidpoint = (xlow + xhigh)/2;
		const xlowNew = xMidpoint - newWidth/2;
		const xhighNew = xMidpoint + newWidth/2;
		worldXHigh = xhighNew;
		worldXLow = xlowNew;
		mat4.perspective(projectionMatrix, )
		mat4.ortho(projectionMatrix, xlowNew, xhighNew, ylow, yhigh, -1, 1);
	} else {
		const newHeight = width/aspect;
		const yMidPoint = (ylow + yhigh)/2;
		const ylowNew = yMidPoint - newHeight/2;
		const yhighNew = yMidPoint + newHeight/2;
		worldYHigh = yhighNew;
		worldYLow = ylowNew;
		mat4.ortho(projectionMatrix, xlow, xhigh, ylowNew, yhighNew, -1, 1);
	}

	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

}



