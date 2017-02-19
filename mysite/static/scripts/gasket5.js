var PHONG_VSHADER =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute vec2 tData;\n' +

  'varying vec4 vtxWorldPosition;\n' +
  'varying vec4 vtxEyePosition;\n' +
  'varying vec4 Normal;\n' +
  'varying vec2 vTData;\n' +

  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +     // Model matrix
  'uniform mat4 u_ModelViewMatrix;\n' + // Model View matrix
  'uniform mat4 u_NormalMatrix;\n' +    // Transformation matrix of the normal
  'uniform vec4 u_position;\n' +

  'void main() {\n' +
  '  vTData = tData;\n' +
  
  '  vec4 position = u_position;\n' +
  '  position.x = position.x + a_Position.x;\n' +
  '  position.y = position.y + a_Position.y;\n' +
  '  position.z = position.z + a_Position.z;\n' +
  '  position.a = position.a + a_Position.a;\n' +
  '  vtxWorldPosition = u_ModelMatrix * position;\n' +
  '  vtxEyePosition = u_ModelViewMatrix * position;\n' +
  '  Normal = normalize(u_NormalMatrix * a_Normal);\n' +

  '  gl_Position = u_MvpMatrix * position;\n' +
  '}\n'
;

var PHONG_FSHADER = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +

  'varying vec4 vtxWorldPosition;\n' +
  'varying vec4 vtxEyePosition;\n' +
  'varying vec4 Normal;\n' +
  'varying vec2 vTData;\n' +

  'uniform vec3 u_LightColor;\n' +      // Light color
  'uniform vec3 u_LightPosition;\n' +   // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +    // Ambient light color
  'uniform vec3 u_SpecularLight;\n' +   // Specular light intensity
  'uniform sampler2D uSampler;\n' +
  
  'void main() {\n' +
  '  vec4 color = texture2D(uSampler, vTData);\n' +

  '  vec3 n = normalize(Normal.xyz);\n' +
  '  vec3 s = normalize(u_LightPosition - vtxWorldPosition.xyz);\n' +
  '  vec3 v = normalize(-vtxEyePosition.xyz);\n' +
  '  vec3 r = reflect(-s, n);\n' +

  '  vec3 ambient = u_AmbientLight * color.rgb;\n' +

  '  float sDotN = max(dot(s, n), 0.0);\n' +
  '  vec3 diffuse = u_LightColor * color.rgb * sDotN;\n' +

  '  vec3 specular = vec3(0.0);\n' +
  '  if( sDotN > 0.0 )\n' +
  '     specular = u_SpecularLight * vec3(1.0, 1.0, 1.0) * pow( max( dot(r,v), 0.0 ), 100.0);\n' +
  
  '  gl_FragColor = vec4(ambient + diffuse + specular, color.a);\n' +
  '}\n'
;

var PASS_VSHADER =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute vec2 tData;\n' +

  'varying vec2 vTData;\n' +
  
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform vec4 u_position;\n' +

  'void main() {\n' +
  '  vec4 position = u_position;\n' +
  '  position.x = position.x + a_Position.x;\n' +
  '  position.y = position.y + a_Position.y;\n' +
  '  position.z = position.z + a_Position.z;\n' +
  '  position.a = position.a + a_Position.a;\n' +
  '  vTData = tData;\n' +
  '  vec4 n = a_Normal;\n' +
  '  gl_Position = u_MvpMatrix * position;\n' +
  '}\n'
;

var PASS_FSHADER = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +

  'varying vec2 vTData;\n' +
  
  'uniform sampler2D uSampler;\n' +
  
  'void main() {\n' +
  '   gl_FragColor = texture2D(uSampler, vTData);\n' +
  '}\n'
;

var FLOOR_PHONG_VSHADER =
  'attribute vec3 vPosition;\n' +
  'attribute vec2 vColor;\n' +

  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +     // Model matrix
  'uniform mat4 u_ModelViewMatrix;\n' + // Model View matrix

  'varying vec4 vtxWorldPosition;\n' +
  'varying vec4 vtxEyePosition;\n' +
  'varying vec4 Normal;\n' +
  'varying vec2 color;\n' +

  'void main() {\n' +
      'vtxWorldPosition = u_ModelMatrix * vec4(vPosition, 1.0);\n' +
      'vtxEyePosition = u_ModelViewMatrix * vec4(vPosition, 1.0);\n' +
      'Normal = normalize(vec4(0.0, 1.0, 0.0, 1.0));\n' +
      'color = vColor;\n' +
      'gl_Position = u_MvpMatrix * vec4(vPosition, 1.0);\n' +
  '}\n'
;

var FLOOR_PHONG_FSHADER =
  'precision mediump float;\n' +

  'varying vec4 vtxWorldPosition;\n' +
  'varying vec4 vtxEyePosition;\n' +
  'varying vec4 Normal;\n' +
  'varying vec2 color;\n' +

  'uniform vec3 u_LightColor;\n' +      // Light color
  'uniform vec3 u_LightPosition;\n' +   // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +    // Ambient light color
  'uniform sampler2D uSampler;\n' +
  
  'void main() {\n' +
  '  vec4 color = texture2D(uSampler, color);\n' +
  
  '  vec3 n = normalize(Normal.xyz);\n' +
  '  vec3 s = normalize(u_LightPosition - vtxWorldPosition.xyz);\n' +
  '  vec3 v = normalize(-vtxEyePosition.xyz);\n' +
  '  vec3 r = reflect(-s, n);\n' +

  '  vec3 ambient = u_AmbientLight * color.rgb;\n' +

  '  float sDotN = max(dot(s, n), 0.0);\n' +
  '  vec3 diffuse = u_LightColor * color.rgb * sDotN;\n' +

  '  gl_FragColor = vec4(ambient + diffuse, 1.0);\n' +
  '}\n'
;

var FLOOR_PASS_VSHADER =
  'attribute vec3 vPosition;\n' +
  'attribute vec2 vColor;\n' +

  'uniform mat4 u_MvpMatrix;\n' +

  'varying vec2 color;\n' +

  'void main() {\n' +
      'gl_Position = u_MvpMatrix * vec4(vPosition, 1.0);\n' +
      'color = vColor;\n' +
  '}\n'
;

var FLOOR_PASS_FSHADER =
  'precision mediump float;\n' +

  'varying vec2 color;\n' +

  'uniform sampler2D uSampler;\n' +

  'void main() {\n' +
      'gl_FragColor = texture2D(uSampler, color);\n' +
  '}\n'
;

var moveX = 0.0;
var moveY = 0.0;
var moveZ = 0.0;
var X;
var Y;
var mouse = false;

// Camera Movement.
var xEye = 0.0;
var yEye = 0.0;
var zEye = 15;
var angleEye = 0.0;

// Lighting.
var xLight = 5.0;
var yLight = 8.0;
var zLight = 7.0;
var shade = true;

// Textures
var sphereTextureA;
var sphereTextureB;
var sphereTextureC;
var sphereTextureANOMIP;
var sphereTextureBNOMIP;
var sphereTextureCNOMIP;
var checkerBoard;
var checkerBoardTexture;
var checkerBoardTextureNOMIP;

var mipmap = 1;

var textureSet = 1;

var firstLoad = 1;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.3, 0.3, 1, 1);
  gl.enable(gl.DEPTH_TEST);

	checkerBoard = new Uint8Array(4*64*64);
	
	for (var o = 0; o <64; ++o)
	{
		for (var p = 0; p <64; ++p)
		{
			var patchx = Math.floor(o/8);
			var patchy = Math.floor(p/8);
			
			var c = (patchx%2 !== patchy%2 ? 255 : 0);
			
			checkerBoard[4*o*64+4*p] = c;
			checkerBoard[4*o*64+4*p+1] = c;
			checkerBoard[4*o*64+4*p+2] = c;
			checkerBoard[4*o*64+4*p+3] = 255;
		}
	}
	
	checkerBoardTexture = gl.createTexture();
	
	gl.bindTexture(gl.TEXTURE_2D, checkerBoardTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, checkerBoard);
	gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
	
	checkerBoardTextureNOMIP = gl.createTexture();
	
	gl.bindTexture(gl.TEXTURE_2D, checkerBoardTextureNOMIP);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, checkerBoard);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
	
	sphereTextureA = gl.createTexture();
    sphereTextureA.image = new Image();
	sphereTextureA.image.src = "../img/texture1.png";
	
    sphereTextureA.image.onload = function() {
      handleLoadedTexture(sphereTextureA, gl);
	  if(firstLoad){
		firstload = 0;
		render(gl, canvas);
	  }
    }
	
	sphereTextureB = gl.createTexture();
    sphereTextureB.image = new Image();
	sphereTextureB.image.src = "../img/texture2.png";
	
	sphereTextureB.image.onload = function() {
      handleLoadedTexture(sphereTextureB, gl);
	  if(firstLoad){
		firstload = 0;
		render(gl, canvas);
	  }
    }
	
	sphereTextureC = gl.createTexture();
    sphereTextureC.image = new Image();
	sphereTextureC.image.src = "../img/texture3.png";
	
	sphereTextureC.image.onload = function() {
      handleLoadedTexture(sphereTextureC, gl);
	  if(firstLoad){
		firstload = 0;
		render(gl, canvas);
	  }
    }
	
	sphereTextureANOMIP = gl.createTexture();
    sphereTextureANOMIP.image = new Image();
	sphereTextureANOMIP.image.src = "../img/texture1.png";
	
	sphereTextureANOMIP.image.onload = function() {
      handleLoadedTextureNoMipmap(sphereTextureANOMIP, gl);
	  if(firstLoad){
		firstload = 0;
		render(gl, canvas);
	  }
    }
	
	sphereTextureBNOMIP = gl.createTexture();
    sphereTextureBNOMIP.image = new Image();
	sphereTextureBNOMIP.image.src = "../img/texture2.png";
	
	sphereTextureBNOMIP.image.onload = function() {
      handleLoadedTextureNoMipmap(sphereTextureBNOMIP, gl);
	  if(firstLoad){
		firstload = 0;
		render(gl, canvas);
	  }
    }
	
	sphereTextureCNOMIP = gl.createTexture();
    sphereTextureCNOMIP.image = new Image();
	sphereTextureCNOMIP.image.src = "../img/texture3.png";
	
	sphereTextureCNOMIP.image.onload = function() {
      handleLoadedTextureNoMipmap(sphereTextureCNOMIP, gl);
	  if(firstLoad){
		firstload = 0;
		render(gl, canvas);
	  }
    }
	
  render(gl, canvas);

  document.getElementById( "shadeOn" ).onclick = function () {
    shade = true;
    render(gl, canvas);
  }

  document.getElementById( "shadeOff" ).onclick = function () {
    shade = false;
    render(gl, canvas);
  }
  
  document.getElementById( "mipmapOn" ).onclick = function () {
    mipmap = 1;
    render(gl, canvas);
  }

  document.getElementById( "mipmapOff" ).onclick = function () {
    mipmap = 0;
    render(gl, canvas);
  }
	
  window.onkeydown = function( event ) {
    var key = String.fromCharCode(event.keyCode);
    switch( key ) {
      case 'W':
        xEye -= Math.sin(angleEye * Math.PI/180.0);
        zEye -= Math.cos(angleEye * Math.PI/180.0);
        break;

      case 'S':
        xEye += Math.sin(angleEye * Math.PI/180.0);
        zEye += Math.cos(angleEye * Math.PI/180.0);
        break;

      case 'A':
        angleEye += 5.0;
        break;

      case 'D':
        angleEye -= 5.0;
        break;

      case 'U':
        zLight -= 1.0;
        break;

      case 'J':
        zLight += 1.0;
        break;

      case 'K':
        xLight += 1.0;
        break;

      case 'H':
        xLight -= 1.0;
        break;

      case 'O':
        yLight += 1.0;
        break;

      case 'L':
        yLight -= 1.0;
        break;
		
	  case 'C':
        moveX -= 1.0;
        break;

      case 'B':
        moveX += 1.0;
        break;

      case 'V':
        moveZ += 1.0;
        break;

      case 'F':
        moveZ -= 1.0;
        break;

      case 'G':
        moveY += 1.0;
        break;

      case 'N':
        moveY -= 1.0;
        break;
		
	  case '1':
        textureSet = 1;
        break;
		
      case '2':
        textureSet = 2;
        break;
		
	  case '3':
        textureSet = 3;
        break;
		
      case '4':
        textureSet = 4;
        break;
    }

    if (angleEye > 360.0) angleEye -= 360.0;
    if (angleEye < 0.0) angleEye += 360.0;
	
	render(gl, canvas);
  }
}

	function handleLoadedTexture(texture, gl) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  
    function handleLoadedTextureNoMipmap(texture, gl) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
    }

function render(gl, canvas) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderSphere(gl, canvas);
  renderFloor(gl, canvas);
}

function renderFloor(gl, canvas) {
  if (shade) {
    if (!initShaders(gl, FLOOR_PHONG_VSHADER, FLOOR_PHONG_FSHADER)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  }
  else {
    if (!initShaders(gl, FLOOR_PASS_VSHADER, FLOOR_PASS_FSHADER)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  }

  var colors = [];
  var points = [];

  for (var z = 100.0; z > -100.0; z -= 5.0) {
      for (var x = -100.0; x < 100.0; x += 5.0) {
              colors.push((x+105)/200);
			  colors.push((z+100)/200);
              colors.push((x+105)/200);
			  colors.push((z+95)/200);
			  colors.push((x+100)/200);
			  colors.push((z+95)/200);
			  colors.push((x+105)/200);
			  colors.push((z+100)/200);
			  colors.push((x+100)/200);
			  colors.push((z+95)/200);
			  colors.push((x+100)/200);
			  colors.push((z+100)/200);
          points.push(vec3(x, -1.0, z));
          points.push(vec3(x, -1.0, z - 5.0));
          points.push(vec3(x - 5.0, -1.0, z - 5.0));

          points.push(vec3(x, -1.0, z));
          points.push(vec3(x - 5.0, -1.0, z - 5.0));
          points.push(vec3(x - 5.0, -1.0, z));
      }
  }

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation( gl.program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( gl.program, "vColor" );
  gl.vertexAttribPointer( vColor, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');

  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

  // Set the light color (white)
  gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(u_LightPosition, xLight, yLight, zLight);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  var mvpMatrix = new Matrix4(); // Model view projection matrix
  var modelMatrix = new Matrix4();// Model matrix
  var modelViewMatrix = new Matrix4(); // ModelView matrix;

  // Pass the model matrix to u_ModelMatrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  mvpMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100);

  var eyeX = xEye - 10 * Math.sin( (Math.PI/180.0) * angleEye);
  var eyeZ = zEye - 10 * Math.cos( (Math.PI/180.0) * angleEye);

  var atX = xEye - 11 * Math.sin( (Math.PI/180.0) * angleEye);
  var atZ = zEye - 11 * Math.cos( (Math.PI/180.0) * angleEye);

  mvpMatrix.lookAt(eyeX, 0, eyeZ, atX, 0, atZ, 0, 1, 0);
  modelViewMatrix.lookAt(eyeX, 0, eyeZ, atX, 0, atZ, 0, 1, 0);

  mvpMatrix.multiply(modelMatrix);
  modelViewMatrix.multiply(modelMatrix);

  // Pass the model view matrix to u_ModelViewMatrix
  gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

  // Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.activeTexture(gl.TEXTURE0);
  
  if(mipmap === 1){
	if(textureSet === 1){
		gl.bindTexture(gl.TEXTURE_2D, checkerBoardTexture);
	} else if(textureSet === 2){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureA);
	} else if(textureSet === 3){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureC);
	} else if(textureSet === 4){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureB);
	}
  }	else {
	if(textureSet === 1){
		gl.bindTexture(gl.TEXTURE_2D, checkerBoardTextureNOMIP);
	} else if(textureSet === 2){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureANOMIP);
	} else if(textureSet === 3){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureCNOMIP);
	} else if(textureSet === 4){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureBNOMIP);
	}
  }
  
  gl.uniform1i(gl.getUniformLocation(gl.program, 'uSampler'), 0);

  gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function renderSphere(gl, canvas) {
  function initVertexBuffers(gl) { // Create a sphere
    var SPHERE_DIV = 8;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;
	var textureBuffLen = 0;

    var positions = [];
    var indices = [];
	var textureData = [];

    // Generate coordinates
    for (j = 0; j <= SPHERE_DIV; j++) {
      aj = j * Math.PI / SPHERE_DIV;
      sj = Math.sin(aj);
      cj = Math.cos(aj);
      for (i = 0; i <= SPHERE_DIV; i++) {
        ai = i * 2 * Math.PI / SPHERE_DIV;
        si = Math.sin(ai);
        ci = Math.cos(ai);

        positions.push(si * sj);  // X
        positions.push(cj);       // Y
        positions.push(ci * sj);  // Z
		textureData.push(1 - (i / SPHERE_DIV));
		textureData.push(1 - (j / SPHERE_DIV));
      }
    }

    // Generate indices
    for (j = 0; j < SPHERE_DIV; j++) {
      for (i = 0; i < SPHERE_DIV; i++) {
        p1 = j * (SPHERE_DIV+1) + i;
        p2 = p1 + (SPHERE_DIV+1);

        indices.push(p1);
        indices.push(p2);
        indices.push(p1 + 1);

        indices.push(p1 + 1);
        indices.push(p2);
        indices.push(p2 + 1);
      }
    }

    // Write the vertex property to buffers (coordinates and normals)
    // Same data can be used for vertex and normal
    // In order to make it intelligible, another buffer is prepared separately
    if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;
	if (!initArrayBuffer(gl, 'tData', new Float32Array(textureData), gl.FLOAT, 2))  return -1;
/*///////////////////////////////////////////////////////////////////////////////
	var sphereTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureData), gl.STATIC_DRAW);
	
    sphereTextureBuffer.numItems = textureBuffLen;
	var tDataLoc = gl.getAttribLocation(gl.program, 'tData');
    gl.vertexAttribPointer(tDataLoc, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(tDataLoc);
	
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sphereTextureA);
    gl.uniform1i(gl.getUniformLocation(gl.program, 'uSampler'), 0);
////////////////////////////////////////////////////////////////////////////////*/
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indices.length;
  }

  function initArrayBuffer(gl, attribute, data, type, num) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return true;
  }

  // Initialize shaders
  if (shade) {
    if (!initShaders(gl, PHONG_VSHADER, PHONG_FSHADER)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  }
  else {
    if (!initShaders(gl, PASS_VSHADER, PASS_FSHADER)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  }

  // Set the vertex coordinates, the color and the normal
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Get the storage locations of uniform variables and so on
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_position = gl.getUniformLocation(gl.program, 'u_position');

  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  var u_SpecularLight = gl.getUniformLocation(gl.program, 'u_SpecularLight');

  // Set the light color (white)
  gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(u_LightPosition, xLight, yLight, zLight);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  // Set the specular light
  gl.uniform3f(u_SpecularLight, 1.0, 1.0, 1.0);
  
  gl.uniform4f(u_position, moveX, moveY, moveZ, 0.0);

  var modelMatrix = new Matrix4();// Model matrix
  var modelViewMatrix = new Matrix4(); // ModelView matrix;
  var mvpMatrix = new Matrix4();// Model view projection matrix
  var normalMatrix = new Matrix4();// Transformation matrix for normals

  // Pass the model matrix to u_ModelMatrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Calculate the view projection matrix
  mvpMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100);

  var eyeX = xEye - 10 * Math.sin( (Math.PI/180.0) * angleEye);
  var eyeZ = zEye - 10 * Math.cos( (Math.PI/180.0) * angleEye);

  var atX = xEye - 11 * Math.sin( (Math.PI/180.0) * angleEye);
  var atZ = zEye - 11 * Math.cos( (Math.PI/180.0) * angleEye);

  mvpMatrix.lookAt(eyeX, 0, eyeZ, atX, 0, atZ, 0, 1, 0);
  modelViewMatrix.lookAt(eyeX, 0, eyeZ, atX, 0, atZ, 0, 1, 0);

  mvpMatrix.multiply(modelMatrix);
  modelViewMatrix.multiply(modelMatrix);

  // Pass the model view matrix to u_ModelViewMatrix
  gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

  // Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // Calculate the matrix to transform the normal based on the model matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  // Pass the transformation matrix for normals to u_NormalMatrix
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.activeTexture(gl.TEXTURE0);
  
  if(mipmap === 1){
	if(textureSet === 1){
		gl.bindTexture(gl.TEXTURE_2D, checkerBoardTexture);
	} else if(textureSet === 2){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureA);
	} else if(textureSet === 3){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureC);
	} else if(textureSet === 4){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureB);
	}
  }	else {
	if(textureSet === 1){
		gl.bindTexture(gl.TEXTURE_2D, checkerBoardTextureNOMIP);
	} else if(textureSet === 2){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureANOMIP);
	} else if(textureSet === 3){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureCNOMIP);
	} else if(textureSet === 4){
		gl.bindTexture(gl.TEXTURE_2D, sphereTextureBNOMIP);
	}
  }
  
  gl.uniform1i(gl.getUniformLocation(gl.program, 'uSampler'), 0);
  
  // Draw.
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}