
var canvas;
var gl;
var program;

var points;
var colors = [];
var plane = [];
var planeColors = [];

var rotateX = 0.0;
var rotateY = 3.14;
var rotateZ = 0.0;
var transX = 0.0;
var transY = 0.0;
var transZ = -2.0;
var cameraX = 0.0;
var cameraY = 0.0;
var cameraZ = 0.0;

var fieldOfView = 75;

var mouse = false;
var mouseMode = 0;
var downX;
var downY;
var downTransX;
var downTransY;
var downRotateX;
var downRotateY;
var downCameraX;
var downCameraY;
var downFOV;
var moveX;
var moveY;

var NumTimesToSubdivide = 1;
var transformLoc;
var projectLoc;

var planeCBuffer;
var planeVColor;
var planeBuffer;
var planeVPosition;
var cBuffer;
var vColor;
var vBuffer;
var vPosition;

window.onload = function init()
{
	points = [];

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Create and transform the plane that the gasket floats above
	
	fillPlane();
	
	document.getElementById('mouseMode').innerHTML = "MODE: Translate";

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides
	
    var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];
    
    divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 1.0, 1.0 );
    
    // enable hidden-surface removal
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	transformLoc = gl.getUniformLocation(program, "transform");
	projectLoc = gl.getUniformLocation(program, "projection");
	
	// Various event listener functions to make the program react to user input.
	
	document.getElementById("subdivideSlider").onchange = function(event) {
        NumTimesToSubdivide = event.target.value;
		reGasket(1);
    };
	
	document.getElementById("rotateX").onclick = function () {
		rotateX += Math.PI/2;
		reGasket(0);
    };
	
	document.getElementById("rotateY").onclick = function () {
		rotateY += Math.PI/2;
		reGasket(0);
    };
	
	document.getElementById("rotateZ").onclick = function () {
		rotateZ += Math.PI/2;
		reGasket(0);
    };
	
	window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'W':
				switch( mouseMode ) {
				  case 0:
					transZ -= 0.1;
					reGasket(0);
					break;
				  case 1:
					
					break;
				  case 2:
					cameraZ -= 0.1;
					reGasket(0);
					break;
				}
			break;
		  case 'S':
				switch( mouseMode ) {
				  case 0:
					transZ += 0.1;
					reGasket(0);
					break;
				  case 1:
					
					break;
				  case 2:
					cameraZ += 0.1;
					reGasket(0);
					break;
				}
            break;
		  case 'E':
		    if (!mouse)
			{
				switch( mouseMode ) {
				  case 0:
					mouseMode = 1;
					document.getElementById('mouseMode').innerHTML = "MODE: Rotate";
					break;
				  case 1:
					mouseMode = 2;
					document.getElementById('mouseMode').innerHTML = "MODE: Camera";
					break;
				  case 2:
					mouseMode = 3;
					document.getElementById('mouseMode').innerHTML = "MODE: FOV";
					break;
				  case 3:
					mouseMode = 0;
					document.getElementById('mouseMode').innerHTML = "MODE: Translate";
					break;
				}
			}
            break;
		}
	}
	
	canvas.onmousedown = function (event) {
		moveX = 0.0;
		moveY = 0.0;
	
		downX = event.pageX;
		downY = event.pageY;
		
		downTransX = transX;
		downTransY = transY;
		
		downRotateX = rotateX;
		downRotateY = rotateY;
		
		downCameraX = cameraX;
		downCameraY = cameraY;
		
		downFOV = fieldOfView;
		
		mouse = true;
	}
	
	document.onmouseup = function (event) {
		mouse = false;
	}
	
	canvas.onmousemove = function (event) {
		if (mouse)
			{
			switch( mouseMode ) {
			  case 0:
				moveX = event.pageX - downX;
				moveY = event.pageY - downY;
			
				transX = downTransX + (moveX / (canvas.width/4));
				transY = downTransY - (moveY / (canvas.height/4));
				reGasket(0);
				break;
			  case 1:
				moveX = event.pageX - downX;
				moveY = event.pageY - downY;
		
				rotateX = downRotateX + (moveY / (canvas.height/10));
				rotateY = downRotateY + (moveX / (canvas.height/10));
				reGasket(0);
				break;
			  case 2:
				moveX = event.pageX - downX;
				moveY = event.pageY - downY;
			
				cameraX = downCameraX + (moveX / (canvas.height/10));
				cameraY = downCameraY - (moveY / (canvas.height/10));
				reGasket(0);
				break;
			  case 3:
				moveY = event.pageY - downY;
				
				fieldOfView = downFOV + (moveY / (canvas.height/100));
				
				if(fieldOfView >= 170)
				{
					fieldOfView = 170;
				}
				
				if(fieldOfView <= 10)
				{
					fieldOfView = 10;
				}
				
				reGasket(0);
				break;
			}
		}
	}
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    
	planeCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(planeColors), gl.STATIC_DRAW );
    
    planeVColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( planeVColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( planeVColor );
	
	planeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(plane), gl.STATIC_DRAW );
	
	planeVPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( planeVPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( planeVPosition );

	renderPlane();
	
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
    render();
};

// A function that is used to update transformations and render whenever
// a new frame needs to be drawn.

// If the number of subdivisons changes the gasket is recreated with the
// proper number of subdivisons.

function reGasket(recreate)
{
    if (recreate)
	{
	points = [];
	
	var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];
    
    divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);
	}
	
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    gl.bindBuffer( gl.ARRAY_BUFFER, planeCBuffer );

    gl.vertexAttribPointer( planeVColor, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );

    gl.vertexAttribPointer( planeVPosition, 3, gl.FLOAT, false, 0, 0 );

	renderPlane();

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	if (recreate)
	{
		gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	}

    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	if (recreate)
	{
		gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	}

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    render();
};

// A function that generates a bumpy plane out of triangles, and stores the
// information for the plane in the plane array and the planeColors array.

//The height variation is read in from a file and put into an array.
//The colors alternate between a pinkish red and a light green.

function fillPlane()
{
	var i, j;
	var color = 0;
	var x = 0;
	var y = 0;
	var altitudes = [];
	var dataReader = 0;
	var squareSize = 0.125
	
	var fileName = "hawaiiRawData.txt";
	var rawFile = new XMLHttpRequest();
	var allText;
	var read = 1;

	rawFile.open("GET", fileName, false);
	
	rawFile.onreadystatechange = function ()
    {
	
		allText = rawFile.responseText;
	
		for (i = 0; i < 256; i += 1)
		{
			altitudes[i] = [];
			for (j = 0; j < 256; j += 1)
			{
				var value = 0;
				while (allText.charAt(dataReader) != ',' &&
					   dataReader < allText.length)
				{
					value = value * 10;
					value = value + (allText.charCodeAt(dataReader)) - 48;
					dataReader++;
				}
					
				if (read)
				{
					altitudes[y][x] = (value/256) - 1;
					read = 0;
					x++;
				} else {
					read = 1;
				}
				dataReader++;
			}
			y++;
			x = 0;
		}
	}
	
	rawFile.send(null);
	
	x = 0;
	y = 0;
	
	for (i = -8.0; i < 8.0; i += squareSize)
	{
		for (j = -8.0; j < 8.0; j += squareSize)
		{
			if(color == 0)
			{
				color = 1;
				var temp1 = vec3(j, i, altitudes[y][x]);
				var temp2 = vec3(j, (i + squareSize), altitudes[y+1][x]);
				var temp3 = vec3((j + squareSize), i, altitudes[y][x+1]);
				var temp4 = vec3(j, (i + squareSize), altitudes[y+1][x]);
				var temp5 = vec3((j + squareSize), i, altitudes[y][x+1]);
				var temp6 = vec3((j + squareSize), (i + squareSize), altitudes[y+1][x+1]);
				planeTriangle(temp1, temp2, temp3, 0);
				planeTriangle(temp4, temp5, temp6, 0);
			} else {
				color = 0;
				var temp1 = vec3(j, i, altitudes[y][x]);
				var temp2 = vec3(j, (i + squareSize), altitudes[y+1][x]);
				var temp3 = vec3((j + squareSize), i, altitudes[y][x+1]);
				var temp4 = vec3(j, (i + squareSize), altitudes[y+1][x]);
				var temp5 = vec3((j + squareSize), i, altitudes[y][x+1]);
				var temp6 = vec3((j + squareSize), (i + squareSize), altitudes[y+1][x+1]);
				planeTriangle(temp1, temp2, temp3, 1);
				planeTriangle(temp4, temp5, temp6, 1);
			}
			
			x++;
		}
		y++;
		x = 0;
		
		if(color == 0)
		{
			color = 1;
		} else {
			color = 0;
		}
	}
	
}

// A function to push all the triangles needed to create the bumpy plane
// onto the plane array, and all of their corresponding colors onto the
// planeColors array.

function planeTriangle( a, b, c, color )
{
	var baseColors = [
		vec3(0.2, 0.5, 0.2),
		vec3(0.5, 0.2, 0.2)
    ];

	planeColors.push( baseColors[color] );
    plane.push( a );
	planeColors.push( baseColors[color] );
    plane.push( b );
	planeColors.push( baseColors[color] );
    plane.push( c );
}

function triangle( a, b, c, color )
{

    // add colors and vertices for one triangle

    var baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.0),
		vec3(0.5, 0.5, 1.0),
		vec3(1.0, 0.5, 0.5)
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
}

function tetra( a, b, c, d )
{
    // tetrahedron with each side using
    // a different color
    
    triangle( a, c, b, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
    triangle( b, c, d, 3 );
}

function divideTetra( a, b, c, d, count )
{
    // check for end of recursion
    
    if ( count === 0 ) {
        tetra( a, b, c, d );
    }
    
    // find midpoints of sides
    // divide four smaller tetrahedra
    
    else {
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var ad = mix( a, d, 0.5 );
        var bc = mix( b, c, 0.5 );
        var bd = mix( b, d, 0.5 );
        var cd = mix( c, d, 0.5 );

        --count;
        
        divideTetra(  a, ab, ac, ad, count );
        divideTetra( ab,  b, bc, bd, count );
        divideTetra( ac, bc,  c, cd, count );
        divideTetra( ad, bd, cd,  d, count );
    }
}

// A function that modifies a transformation matrix to cause a translation
// of transX on the X axis, transY on the Y axis, and transZ on the Z axis.

function myTranslate(oldUniform, transX, transY, transZ)
{
	
	var translate = mat4(1.0, 0.0, 0.0, transX,
						 0.0, 1.0, 0.0, transY,
						 0.0, 0.0, 1.0, transZ,
						 0.0, 0.0, 0.0, 1.0);
	
	var newUniform = mult (oldUniform, translate);
	
	return newUniform;
}

// A function that modifies a transformation matrix to cause a rotation of a given
// theta around a given axis(X, Y, or Z).

function myRotate(oldUniform, axis, theta)
{
	var newUniform;
	var rotateMatrix;
	
	switch( axis ) {
        case 'X':
			rotateMatrix = mat4(1.0, 0.0, 0.0, 0.0,
								0.0, Math.cos(theta), -Math.sin(theta), 0.0,
								0.0, Math.sin(theta), Math.cos(theta), 0.0,
								0.0, 0.0, 0.0, 1.0);
            break;
        case 'Y':
			rotateMatrix = mat4(Math.cos(theta), 0.0, Math.sin(theta), 0.0,
								0.0, 1.0, 0.0, 0.0,
								-Math.sin(theta), 0.0, Math.cos(theta), 0.0,
								0.0, 0.0, 0.0, 1.0);
            break;
        case 'Z':
            rotateMatrix = mat4(Math.cos(theta), -Math.sin(theta), 0.0, 0.0,
								Math.sin(theta), Math.cos(theta), 0.0, 0.0,
								0.0, 0.0, 1.0, 0.0,
								0.0, 0.0, 0.0, 1.0);
            break;
        }

	newUniform = mult(oldUniform, rotateMatrix);
	
	return newUniform;
}

// A function that modifies a transformation matrix to give it perspective.

function cameraPerspective(oldUniform, isPlane)
{
	var newUniform;
	
	var perspectiveMatrix = perspective(fieldOfView, 1, 0.1, 20);
	
	newUniform = mult(perspectiveMatrix, oldUniform);
	
	if(isPlane)
	{
		newUniform = myTranslate(newUniform, 0.0, 0.0, -5.0);
	}
	
	return newUniform;
}

// A function that modifies a the position of the camera in space.

function cameraLocation(oldUniform)
{
	var newUniform;
	
	var eye = [cameraX, cameraY, cameraZ];
	var at = [transX, transY, transZ];
	var up = [0.0, 1.0, 0.0];
	
	var cameraMatrix = lookAt(eye, at, up);
	
	newUniform = mult(cameraMatrix, oldUniform);
	
	return newUniform;
}

// The renderPlane function renders the bumpy plane below the gasket.

function renderPlane()
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var planeTransform = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);
						  
	var planeProject = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);
	
	planeTransform = myRotate(planeTransform, 'X', -1.5);
	
	planeTransform = myTranslate(planeTransform, 0.0, 0.0, -1.0);
		
	planeProject = cameraLocation(planeProject);
	
	planeProject = cameraPerspective(planeProject, 0);
	
	gl.uniformMatrix4fv(transformLoc, false, flatten(planeTransform));
	
	gl.uniformMatrix4fv(projectLoc, false, flatten(planeProject));
	
	gl.drawArrays( gl.TRIANGLES, 0, plane.length );
}

// The render function calculates the proper transformation matrix and 
// renders the gasket.

function render()
{
	var transformation = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);
						  
	var projection = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);
	
	transformation = myTranslate(transformation, transX, transY, transZ);
	
	transformation = myRotate(transformation, 'X', rotateX);
	transformation = myRotate(transformation, 'Y', rotateY);
	transformation = myRotate(transformation, 'Z', rotateZ);
	
	projection = cameraLocation(projection);
	
	projection = cameraPerspective(projection, 0);

	gl.uniformMatrix4fv(transformLoc, false, flatten(transformation));
	
	gl.uniformMatrix4fv(projectLoc, false, flatten(projection));
	
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}