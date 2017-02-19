
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

var mouse = false;
var mouseMode = 0;
var downX;
var downY;
var downTransX;
var downTransY;
var downTransZ;
var downRotateX;
var downRotateY;
var downRotateZ;
var moveX;
var moveY;

var NumTimesToSubdivide = 1;
var transformLoc;
var transformation = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);

var planeTransform = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);
						  
window.onload = function init()
{
	points = [];

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Create and transform the plane that the gasket floats above

	var planeVerts = [
		vec3(  -8.0000,  -2.0000, 0.0000 ),
        vec3(  8.0000, 8.0000,  0.0000 )
	];

	fillPlane(planeVerts[0], planeVerts[1]);

	planeTransform = myRotate(planeTransform, 'X', -1.5);
	planeTransform = myTranslate(planeTransform, 0.0, 2.0, 4.0);
	planeTransform = cameraPerspective(planeTransform, 1);
	
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
          case 'A':
		    transX -= 0.1;
			reGasket(0);
            break;
          case 'D':
            transX += 0.1;
			reGasket(0);
            break;
          case 'W':
            transY += 0.1;
			reGasket(0);
            break;
		  case 'S':
		    transY -= 0.1;
			reGasket(0);
            break;
		  case 'F':
            transZ += 0.1;
			reGasket(0);
            break;
		  case 'R':
		    transZ -= 0.1;
			reGasket(0);
            break;
		  case 'E':
		    if (!mouse && mouseMode === 0)
			{
				mouseMode = 1;
				document.getElementById('mouseMode').innerHTML = "MODE: Rotate";
			} else if (!mouse) {
				mouseMode = 0;
				document.getElementById('mouseMode').innerHTML = "MODE: Translate";
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
		downTransZ = transZ;
		
		downRotateX = rotateX;
		downRotateY = rotateY;
		downRotateZ = rotateZ;
		
		mouse = true;
	}
	
	document.onmouseup = function (event) {
		mouse = false;
	}
	
	canvas.onmousemove = function (event) {
		if(mouse && mouseMode === 0){
			moveX = event.pageX - downX;
			moveY = event.pageY - downY;
			
			transX = downTransX + (moveX / (canvas.width/2));
			transY = downTransY - (moveY / (canvas.height/2));
			reGasket(0);
		} else  if (mouse){
			moveX = event.pageX - downX;
			moveY = event.pageY - downY;
			
			rotateX = downRotateX + (moveY / (canvas.height/10));
			rotateY = downRotateY + (moveX / (canvas.height/10));
			reGasket(0);
		}
	}
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    
	var planeCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(planeColors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	var planeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(plane), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	renderPlane();
	
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
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
    
	var planeCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(planeColors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	var planeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(plane), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	renderPlane();
	
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

// A function that generates a bumpy plane out of triangles, and stores the
// information for the plane in the plane array and the planeColors array.

//The height variation in the plane is randomly generated.
//The colors alternate between a pinkish red and a light green.

function fillPlane( a, b, offset )
{
	var i, j;
	var color = 0;
	var x = 0;
	var y = 0;
	
	var altitudes = [];
	
	for (i = a[1]; i <= b[1]; i += 0.5)
	{
		altitudes[y] = [];
		for (j = a[0]; j <= b[0]; j += 0.5)
		{
			altitudes[y][x] = (Math.random() - 0.5) / 2;
			x++;
		}
		y++;
		x = 0;
	}
	
	x = 0;
	y = 0;
	
	for (i = a[1]; i < b[1]; i += 0.5)
	{
		for (j = a[0]; j < b[0]; j += 0.5)
		{
			if(color == 0)
			{
				color = 1;
				var temp1 = vec3(j, i, altitudes[y][x]);
				var temp2 = vec3(j, (i + 0.5), altitudes[y+1][x]);
				var temp3 = vec3((j + 0.5), i, altitudes[y][x+1]);
				var temp4 = vec3(j, (i + 0.5), altitudes[y+1][x]);
				var temp5 = vec3((j + 0.5), i, altitudes[y][x+1]);
				var temp6 = vec3((j + 0.5), (i + 0.5), altitudes[y+1][x+1]);
				planeTriangle(temp1, temp2, temp3, 0);
				planeTriangle(temp4, temp5, temp6, 0);
			} else {
				color = 0;
				var temp1 = vec3(j, i, altitudes[y][x]);
				var temp2 = vec3(j, (i + 0.5), altitudes[y+1][x]);
				var temp3 = vec3((j + 0.5), i, altitudes[y][x+1]);
				var temp4 = vec3(j, (i + 0.5), altitudes[y+1][x]);
				var temp5 = vec3((j + 0.5), i, altitudes[y][x+1]);
				var temp6 = vec3((j + 0.5), (i + 0.5), altitudes[y+1][x+1]);
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
	
	var perspectiveMatrix = perspective(75, 1 , 0.1, 10);
	
	newUniform = mult(perspectiveMatrix, oldUniform);
	
	if(isPlane)
	{
		newUniform = myTranslate(newUniform, 0.0, 0.0, -5.0);
	}
	
	return newUniform;
}

// The renderPlane function renders the bumpy plane below the gasket.

function renderPlane()
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.uniformMatrix4fv(transformLoc, false, flatten(planeTransform));
	
	gl.drawArrays( gl.TRIANGLES, 0, plane.length );
}

// The render function calculates the proper transformation matrix and 
// renders the gasket.

function render()
{
	transformation = mat4(1.0, 0.0, 0.0, 0.0,
						  0.0, 1.0, 0.0, 0.0,
						  0.0, 0.0, 1.0, 0.0,
						  0.0, 0.0, 0.0, 1.0);
	
	transformation = myTranslate(transformation, transX, transY, transZ);
	
	transformation = myRotate(transformation, 'X', rotateX);
	transformation = myRotate(transformation, 'Y', rotateY);
	transformation = myRotate(transformation, 'Z', rotateZ);
	
	transformation = cameraPerspective(transformation, 0);

	gl.uniformMatrix4fv(transformLoc, false, flatten(transformation));
	
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}