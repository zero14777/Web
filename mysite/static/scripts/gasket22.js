
var canvas;
var gl;

var points;
var paints = [];
var square = [];

var NumTimesToSubdivide = 1;
var translation = [0.0, 0.0];
var transXLoc;
var transYLoc;
var downX;
var downY;
var downTrans = [0.0, 0.0];
var mouse = false;
var mouseMode = 1;
var trianglePoints;
var playerX = 0;
var playerY = 0;
var pickupX = 10;
var pickupY = 10;
var score = 0;
var colorOutX, colorOutY, colorOutZ;
var colorInX = 1.0;
var colorInY = 0.0;
var colorInZ = 0.0;

window.onload = function init()
{
	trianglePoints = 0;
	points = [];

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    
    var vertices = [
        vec2( -.7, -.7 ),
        vec2(  0,  .7 ),
        vec2(  .7, -.7 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );
	
	transXLoc = gl.getUniformLocation(program, "transX");
	transYLoc = gl.getUniformLocation(program, "transY");
	colorOutX = gl.getUniformLocation(program, "colourX");
	colorOutY = gl.getUniformLocation(program, "colourY");
	colorOutZ = gl.getUniformLocation(program, "colourZ");

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
	// Event listeners for various button, slider, keyboard, and mouse inputs
    
    document.getElementById("subdivideSlider").onchange = function(event) {
        NumTimesToSubdivide = event.target.value;
		if(mouseMode != 3)
		{
			redraw(1);
		}
    };
	
	document.getElementById('score').innerHTML = "SCORE: " + 0;
	
	document.getElementById("clickDragMode").onclick = function () {
        mouseMode = 1;
		redraw(1);
    };
	
	document.getElementById("paintMode").onclick = function () {
        mouseMode = 2;
		redraw(1);
    };
	
	document.getElementById("gameMode").onclick = function () {
        translation = [0.0, 0.0];
		mouseMode = 3;
		redraw(2);
    };
	
    document.getElementById("reset").onclick = function () {
        translation = [0.0, 0.0];
		paints = [];
		if(mouseMode != 3)
		{
			redraw(1);
		}
    };
	
	window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'R':
		    colorInX = 1.0;
			colorInY = 0.0;
			colorInZ = 0.0;
			redraw(mouseMode - 1);
            break;
          case 'G':
            colorInX = 0.0;
			colorInY = 1.0;
			colorInZ = 0.0;
			redraw(mouseMode - 1);
            break;
          case 'B':
            colorInX = 0.0;
			colorInY = 0.0;
			colorInZ = 1.0;
			redraw(mouseMode - 1);
            break;
		  case 'W':
		    if(mouseMode == 3 && playerY < 48)
			{
				playerY++;
				redraw(2);
			}
            break;
          case 'A':
            if(mouseMode == 3 && playerX > -48)
			{
				playerX--;
				redraw(2);
			}
            break;
          case 'S':
            if(mouseMode == 3 && playerY > -48)
			{
				playerY--;
				redraw(2);
			}
            break;
		  case 'D':
            if(mouseMode == 3 && playerX < 48)
			{
				playerX++;
				redraw(2);
			}
            break;
        }
    };
	
	canvas.onmousedown = function (event) {
		var moveX = 0.0;
		var moveY = 0.0;
	
		downX = event.pageX;
		downY = event.pageY;
		downTrans[0] = translation[0];
		downTrans[1] = translation[1];
		
		mouse = true;
	}
	
	document.onmouseup = function (event) {
		mouse = false;
	}
	
	canvas.onmousemove = function (event) {
		if(mouse && mouseMode == 1){
			moveX = event.pageX - downX;
			moveY = event.pageY - downY;
			
			translation[0] = downTrans[0] + (moveX / (canvas.width/2));
			translation[1] = downTrans[1] - (moveY / (canvas.height/2));
			redraw(0);
		}
		
		if(mouse && mouseMode == 2){
			var mouseX = event.pageX - canvas.offsetLeft;
			var mouseY = event.pageY - canvas.offsetTop;
			var paintLoc = [
				vec2( -.01, -.01 ),
				vec2(  0,  .01 ),
				vec2(  .01, -.01 )
			];
			
			// account for the translation on the vertex shader
			
			paintLoc[0][0] -= translation[0];
			paintLoc[1][0] -= translation[0];
			paintLoc[2][0] -= translation[0];
			paintLoc[0][1] -= translation[1];
			paintLoc[1][1] -= translation[1];
			paintLoc[2][1] -= translation[1];
			
			// account for the location of the mouse
			
			paintLoc[0][0] += ((mouseX / (canvas.width/2)) - (1.0));
			paintLoc[1][0] += ((mouseX / (canvas.width/2)) - (1.0));
			paintLoc[2][0] += ((mouseX / (canvas.width/2)) - (1.0));
			paintLoc[0][1] -= ((mouseY / (canvas.height/2)) - (1.0));
			paintLoc[1][1] -= ((mouseY / (canvas.height/2)) - (1.0));
			paintLoc[2][1] -= ((mouseY / (canvas.height/2)) - (1.0));
			
			//moveX = event.pageX - downX;
			//moveY = event.pageY - downY;
			
			paints.push( paintLoc[0], paintLoc[1], paintLoc[2] );
			redraw(0);
		}
	}
	
    render();
};

// A function to refresh the canvas. Takes in a variable to tell what mode 
// the canvas is in.

function redraw(mode)
{
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	// Only update the Sierpinski Gasket when the number of subdivisions changes
	
	if (mode == 1) {
		points = [];
	
		var vertices = [
			vec2( -.7, -.7 ),
			vec2(  0,  .7 ),
			vec2(  .7, -.7 )
		];
		
		divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);
	}

    //
    //  Configure WebGL
    //
	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );
	
	transXLoc = gl.getUniformLocation(program, "transX");
	transYLoc = gl.getUniformLocation(program, "transY");
	colorOutX = gl.getUniformLocation(program, "colourX");
	colorOutY = gl.getUniformLocation(program, "colourY");
	colorOutZ = gl.getUniformLocation(program, "colourZ");
	
    // What gets printed on the canvas is based on what mode is selected
	
    if(mode != 2)
	{
		var buffer1 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, buffer1 );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

		// Associate out shader variables with our data buffer
    
		var vPosition = gl.getAttribLocation( program, "vPosition" );
		gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );
	
		render();
	
		var buffer2 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, buffer2 );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(paints), gl.STATIC_DRAW );

		// Associate out shader variables with our data buffer
    
		gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	
		paint();
	} else {
		var q, tempA1, tempA2, tempA3, tempA4, tempA5, tempA6, 
				tempB1, tempB2, tempB3, tempB4, tempB5, tempB6;
		
		if(playerX == pickupX && playerY == pickupY){
			pickupX = Math.floor((Math.random() * 97) - 48);
			pickupY = Math.floor((Math.random() * 97) - 48);
			score++;
		}
		
		square = [];
		
		tempA1 = vec2( -.01, -.01 );
		tempA2 = vec2(  -.01,  .01 );
		tempA3 = vec2(  .01, -.01 );
		tempA4 = vec2(  -.01,  .01 );
		tempA5 = vec2(  .01, -.01 );
		tempA6 = vec2(  .01, .01 );
		
		square.push (tempA1, tempA2, tempA3);
		square.push (tempA4, tempA5, tempA6);
		
		for(q = 0; q < square.length; q++)
		{
			square[q][0] = square[q][0] + (playerX * 0.02);
			square[q][1] = square[q][1] + (playerY * 0.02);
		}
		
		tempB1 = vec2( -.01, -.01 );
		tempB2 = vec2(  -.01,  .01 );
		tempB3 = vec2(  .01, -.01 );
		tempB4 = vec2(  -.01,  .01 );
		tempB5 = vec2(  .01, -.01 );
		tempB6 = vec2(  .01, .01 );
		
		square.push (tempB1, tempB2, tempB3);
		square.push (tempB4, tempB5, tempB6);
		
		for(; q < square.length; q++)
		{
			square[q][0] = square[q][0] + (pickupX * 0.02);
			square[q][1] = square[q][1] + (pickupY * 0.02);
		}
	
		var buffer1 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, buffer1 );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(square), gl.STATIC_DRAW );

		// Associate out shader variables with our data buffer
    
		var vPosition = gl.getAttribLocation( program, "vPosition" );
		gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );
		
		game();
	}
};

function triangle( a, b, c )
{
    points.push( a, b, c );
	trianglePoints += 3
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c);
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

		/* perturb triangle midpoints
		ab[0] = ab[0] - 0.01;
		ab[1] = ab[1] + 0.01;
		ac[0] = ac[0] - 0.02;
		ac[1] = ac[1] + 0.02;
		bc[0] = bc[0] + 0.01;
		bc[1] = bc[1] + 0.02;
		*/
		
        // three new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

// Drawing the gasket

function render()
{
	var i;

    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.uniform1f(transXLoc, translation[0]);
	gl.uniform1f(transYLoc, translation[1]);
	gl.uniform1f(colorOutX, colorInX);
	gl.uniform1f(colorOutY, colorInY);
	gl.uniform1f(colorOutZ, colorInZ);
	
	//draw each triangle one by one with line loops so they look right
	
	for (i = 0; i <= trianglePoints - 3; i = i + 3)
	{
		gl.drawArrays( gl.LINE_LOOP, i, 3 );
	}
}

// Drawing any painted on triangles

function paint()
{
	var i;
	
	for ( i = 0; i <= paints.length; i = i + 3)
	{
		gl.drawArrays( gl.TRIANGLES, i, 3 );
	}
}

// Drawing the canvas for the game

function game()
{
	var i;
	var scoreOutput = "SCORE: " + score;
	
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.uniform1f(colorOutX, colorInX);
	gl.uniform1f(colorOutY, colorInY);
	gl.uniform1f(colorOutZ, colorInZ);
	
	for (i = 0; i < 6; i = i + 3)
	{
		gl.drawArrays( gl.TRIANGLES, i, 3 );
	}
	
	gl.uniform1f(colorOutX, 1.0);
	gl.uniform1f(colorOutY, 0.0);
	gl.uniform1f(colorOutZ, 1.0);
	
	for (; i < square.length; i = i + 3)
	{
		gl.drawArrays( gl.TRIANGLES, i, 3 );
	}
	
	document.getElementById('score').innerHTML = scoreOutput;
}