
var canvas;
var gl;
var program;

var points;
var colors = [];
var plane = [];
var planeColors = [];
var normals = [];
var planeNormals = [];

var rotateX = 0.0;
var rotateY = 0.0;
var rotateZ = 0.0;
var transX = 0.0;
var transY = 3.0;
var transZ = -3.0;
var cameraX = 0.0;
var cameraY = 3.0;
var cameraZ = 0.0;

var eye = [cameraX, cameraY, cameraZ];

var va = vec4(  0.0000,  0.0000, -1.0000 );
var vb = vec4(  0.0000,  0.9428,  0.3333 );
var vc = vec4( -0.8165, -0.4714,  0.3333 );
var vd = vec4(  0.8165, -0.4714,  0.3333 );

var fieldOfView = 75;

var planeType = 0;

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
var downLightX;
var downLightZ;
var moveX;
var moveY;

var NumTimesToSubdivide = 3;
var shaders = 1.0;
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
var nBuffer;
var vNormal;
var planeVNormal;
var planeNBuffer;

var lightX = 0.0;
var lightY = -5.0;
var lightZ = 0.0;

var lightPosition = vec4(lightX, lightY, lightZ, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 1000.0;

window.onload = function init()
{
	points = [];

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Create and transform the plane that the gasket floats above
	
	fillPlane(planeType);
	
	document.getElementById('mouseMode').innerHTML = "MODE: Translate";
	
    var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];
    
    tetra( vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);

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
	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
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
					mouseMode = 4;
					document.getElementById('mouseMode').innerHTML = "MODE: Light";
					break;
				  case 4:
					mouseMode = 0;
					document.getElementById('mouseMode').innerHTML = "MODE: Translate";
					break;
				}
			}
            break;
		  case 'R':
				if(shaders === 0.0)
				{
					shaders = 1.0;
				} else {
					shaders = 0.0;
				}
				reGasket(0);
			break;
		  case 'T':
				if(planeType === 0)
				{
					planeType = 1;
				} else {
					planeType = 0;
				}
				fillPlane(planeType);
				reGasket(2);
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
		
		downLightX = lightX;
		downLightZ = lightZ;
		
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
			  case 4:
				moveX = event.pageX - downX;
				moveY = event.pageY - downY;
			
				lightX = downLightX - (moveX / (canvas.height/10));
				lightZ = downLightZ - (moveY / (canvas.height/10));
				lightPosition = vec4(lightX, lightY, lightZ, 0.0 );
				reGasket(0);
				break;
			}
		}
	}
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    
	gl.uniform1f( gl.getUniformLocation(program, 
       "shaders"), shaders);
	gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
	gl.uniform3fv( gl.getUniformLocation(program, 
       "camera"),flatten(eye) );
	
	planeNBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planeNBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(planeNormals), gl.STATIC_DRAW );
    
    planeVNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( planeVNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( planeVNormal);
	
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
	
	nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
	
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
	normals = [];
	
	var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];
    tetra( vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);
	}
	
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
	
	gl.uniform1f( gl.getUniformLocation(program, 
       "shaders"), shaders);
	gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
	
    gl.bindBuffer( gl.ARRAY_BUFFER, planeNBuffer);
	
	if (recreate === 2)
	{
		gl.bufferData( gl.ARRAY_BUFFER, flatten(planeNormals), gl.STATIC_DRAW );
	}
	
    gl.vertexAttribPointer( planeVNormal, 4, gl.FLOAT, false, 0, 0 );
	
    gl.bindBuffer( gl.ARRAY_BUFFER, planeCBuffer );

	if (recreate === 2)
	{
		gl.bufferData( gl.ARRAY_BUFFER, flatten(planeColors), gl.STATIC_DRAW );
	}
	
    gl.vertexAttribPointer( planeVColor, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );

	if (recreate === 2)
	{
		gl.bufferData( gl.ARRAY_BUFFER, flatten(plane), gl.STATIC_DRAW );
	}

    gl.vertexAttribPointer( planeVPosition, 3, gl.FLOAT, false, 0, 0 );

	renderPlane();

	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
	if (recreate)
	{
		gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
	}
	
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

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

//This function is now also capable of creating a highly tessellated flat plane. 

function fillPlane(type)
{
	var i, j;
	var color = 0;
	var x = 0;
	var y = 0;
	var altitudes = [];
	var dataReader = 0;
	var squareSize = 0.125
	
	plane = [];
	planeColors = [];
	planeNormals = [];
	
if(type)
{
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
				planeTriangle(temp1, temp2, temp3, 0, 0);
				planeTriangle(temp4, temp5, temp6, 0, 0);
			} else {
				color = 0;
				var temp1 = vec3(j, i, altitudes[y][x]);
				var temp2 = vec3(j, (i + squareSize), altitudes[y+1][x]);
				var temp3 = vec3((j + squareSize), i, altitudes[y][x+1]);
				var temp4 = vec3(j, (i + squareSize), altitudes[y+1][x]);
				var temp5 = vec3((j + squareSize), i, altitudes[y][x+1]);
				var temp6 = vec3((j + squareSize), (i + squareSize), altitudes[y+1][x+1]);
				planeTriangle(temp1, temp2, temp3, 1, 0);
				planeTriangle(temp4, temp5, temp6, 1, 0);
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
} else {
	x = 0;
	y = 0;
	
	for (i = -8.0; i < 8.0; i += squareSize)
	{
		for (j = -8.0; j < 8.0; j += squareSize)
		{
			if(color == 0)
			{
				color = 1;
				var temp1 = vec3(j, i, -1);
				var temp2 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				var temp3 = vec3(j, (i + (squareSize)), -1);
				var temp4 = vec3(j, i, -1);
				var temp5 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				var temp6 = vec3((j + (squareSize)), i, -1);
				planeTriangle(temp1, temp2, temp3, 0, 1);
				planeTriangle(temp4, temp5, temp6, 0, 2);
				temp1 = vec3((j + (squareSize)), (i + (squareSize)), -1);
				temp2 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				temp3 = vec3(j, (i + (squareSize)), -1);
				temp4 = vec3((j + (squareSize)), (i + (squareSize)), -1);
				temp5 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				temp6 = vec3((j + (squareSize)), i, -1);
				planeTriangle(temp1, temp2, temp3, 0, 3);
				planeTriangle(temp4, temp5, temp6, 0, 4);
			} else {
				color = 0;
				var temp1 = vec3(j, i, -1);
				var temp2 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				var temp3 = vec3(j, (i + (squareSize)), -1);
				var temp4 = vec3(j, i, -1);
				var temp5 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				var temp6 = vec3((j + (squareSize)), i, -1);
				planeTriangle(temp1, temp2, temp3, 1, 1);
				planeTriangle(temp4, temp5, temp6, 1, 2);
				temp1 = vec3((j + (squareSize)), (i + (squareSize)), -1);
				temp2 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				temp3 = vec3(j, (i + (squareSize)), -1);
				temp4 = vec3((j + (squareSize)), (i + (squareSize)), -1);
				temp5 = vec3((j + (squareSize/2)), (i + (squareSize/2)), -1);
				temp6 = vec3((j + (squareSize)), i, -1);
				planeTriangle(temp1, temp2, temp3, 1, 3);
				planeTriangle(temp4, temp5, temp6, 1, 4);
			}
			x++;
		}
		if(color == 0)
		{
			color = 1;
		} else {
			color = 0;
		}
		y++;
		x = 0;
	}
}
}

// A function to push all the triangles needed to create the bumpy plane
// onto the plane array, and all of their corresponding colors onto the
// planeColors array.

function planeTriangle( a, b, c, color, randomNormals )
{
	var baseColors = [
		vec3(0.2, 0.5, 0.2),
		vec3(0.5, 0.2, 0.2)
    ];

	var normal = vec4(0.0, 1.0, 0.0, 1.0);
	
	if(randomNormals == 1)
	{
		var temp = 1.0;//Math.random() * (1.0);
		normal[0] = temp;
		temp = 0.0;
		normal[1] = temp;
		temp = 0.3;
		normal[2] = temp;
		temp = 0.0;
		normal[3] = temp;
	}
	
	if(randomNormals == 2)
	{
		var temp = 0.0;
		normal[0] = temp;
		temp = 1.0;
		normal[1] = temp;
		temp = 0.0;
		normal[2] = temp;
		temp = 0.3;
		normal[3] = temp;
	}
	
	if(randomNormals == 3)
	{
		var temp = 0.3;
		normal[0] = temp;
		temp = 0.0;
		normal[1] = temp;
		temp = 1.0;
		normal[2] = temp;
		temp = 0.0;
		normal[3] = temp;
	}
	
	if(randomNormals == 4)
	{
		var temp = 0.0;
		normal[0] = temp;
		temp = 0.3;
		normal[1] = temp;
		temp = 0.0;
		normal[2] = temp;
		temp = 1.0;
		normal[3] = temp;
	}
	
	planeNormals.push(vec4(normal, 0.0));
    planeNormals.push(vec4(normal, 0.0));
    planeNormals.push(vec4(normal, 0.0));
	
	planeColors.push( baseColors[color] );
    plane.push( a );
	planeColors.push( baseColors[color] );
    plane.push( b );
	planeColors.push( baseColors[color] );
    plane.push( c );
}

function triangle( a, b, c )
{

    // add colors and vertices for one triangle
	
	var vector1 = subtract(b, a);
    var vector2 = subtract(c, a);
    var normal = normalize(cross(vector1, vector2));
    normal = vec4(normal);

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);

    colors.push( vec3(0.0, 1.0, 0.0) );
    points.push( a );
    colors.push( vec3(0.0, 1.0, 0.0) );
    points.push( b );
    colors.push( vec3(0.0, 1.0, 0.0) );
    points.push( c );
}

function tetra( a, b, c, d, count )
{
    // tetrahedron with each side using
    // a different color
    divideTriangle( a, b, c, count );
    divideTriangle( d, c, b, count );
    divideTriangle( a, d, b, count );
    divideTriangle( a, c, d, count );
}

function divideTriangle( a, b, c, count )
{
    // check for end of recursion
    
    if ( count <= 0 ) {
        triangle( a, b, c );
    }
    
    // find midpoints of sides
    // divide four smaller triangles
    
    else {
        var ab = normalize(mix( a, b, 0.5 ));
        var ac = normalize(mix( a, c, 0.5 ));
        var bc = normalize(mix( b, c, 0.5 ));

        --count;
        
        divideTriangle(  a, ab, ac, count );
        divideTriangle( ab,  b, bc, count );
        divideTriangle( bc, c,  ac, count );
        divideTriangle( ab, bc, ac, count );
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
	
	eye = [cameraX, cameraY, cameraZ];
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