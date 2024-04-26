var mouseX = 0, mouseY = 0;
var prevMouseX = 0, prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};
//Moncong
//==========================================================================================
function generateMoncong(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];

    var angleIncrement = (2 * Math.PI) / segments;

    var rainbowColors = [
        [1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0]
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = (i/segments);
        var v = latAngle

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * v * ovalScaleX;
            var yCoord = sinLon * v * ovalScaleY;
            var zCoord = v * ovalScaleZ;

             // Rotasi
             var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
             var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
             var rotatedZ = zCoord;
             // Pemutaran tambahan untuk diagonal
             rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
             rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
             // Rotasi horizontal (rotasi pada sumbu Y)
             var rotatedXHorizontal = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
             rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
             rotatedX = rotatedXHorizontal;
             var vertexX = x + rotatedX * radius;
             var vertexY = y + rotatedY * radius;
             var vertexZ = z + rotatedZ * radius;
             vertices.push(vertexX, vertexY, vertexZ);
             var colorIndex = j % rainbowColors.length;
             colors = colors.concat(rainbowColors[colorIndex]);
            
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================

//Head pesawat
//==========================================================================================
function generateHeadPesawat(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [0.6, 0.6, 0.7] 
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;

            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================

//Glass
//==========================================================================================
function generateGlass(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [0.0, 0.0, 1.0], // Hijau
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;

            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================

//Pipo
//==========================================================================================
function generatePipe(x, y, z, radius, height, segments, tabScaleX, tabScaleY, tabScaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [
        [0.6, 0.6, 0.7] 
    ];

    for (var i = 0; i <= segments; i++) {
        var angle = 2 * Math.PI * (i / segments);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        for (var j = 0; j <= segments; j++) {
            var heightFraction = j / segments;
            var xCoord = radius * cosAngle * tabScaleX;
            var yCoord = radius * sinAngle * tabScaleY;
            var zCoord = height * heightFraction - height / 2 * tabScaleZ;

             // Rotasi
             var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
             var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
             var rotatedZ = zCoord;
             // Pemutaran tambahan untuk diagonal
             rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
             rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
             // Rotasi horizontal (rotasi pada sumbu Y)
             var rotatedXHorizontal = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
             rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
             rotatedX = rotatedXHorizontal;
             var vertexX = x + rotatedX * radius;
             var vertexY = y + rotatedY * radius;
             var vertexZ = z + rotatedZ * radius;
             vertices.push(vertexX, vertexY, vertexZ);
             var colorIndex = j % rainbowColors.length;
             colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================

//Body pesawat
//==========================================================================================
function generateBadanPesawat(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [0.6, 0.6, 0.7] 
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;

            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================

//kemalpot
//==========================================================================================
function generateKenalpot(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [1 / 1, 1 / 1, 1 / 1]
        // [1.0, 0.0, 0.0],
        // [0.0, 0.0, 1.0]
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;

            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================

//Corong kenalpot
//==========================================================================================

//==========================================================================================

//Cincin
//==========================================================================================
function generateCincin(x, y, z, radius, height, segments, tabScaleX, tabScaleY, tabScaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [
        [16 / 200, 200 / 210, 150 / 250]
        // [1.0, 0.0, 0.0],
        // [0.0, 0.0, 1.0]
    ];

    for (var i = 0; i <= segments; i++) {
        var angle = 2 * Math.PI * (i / segments);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        for (var j = 0; j <= segments; j++) {
            var heightFraction = j / segments;
            var xCoord = radius * cosAngle * tabScaleX;
            var yCoord = radius * sinAngle * tabScaleY;
            var zCoord = height * heightFraction - height / 2 * tabScaleZ;

             // Rotasi
             var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
             var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
             var rotatedZ = zCoord;
             // Pemutaran tambahan untuk diagonal
             rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
             rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
             // Rotasi horizontal (rotasi pada sumbu Y)
             var rotatedXHorizontal = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
             rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
             rotatedX = rotatedXHorizontal;
             var vertexX = x + rotatedX * radius;
             var vertexY = y + rotatedY * radius;
             var vertexZ = z + rotatedZ * radius;
             vertices.push(vertexX, vertexY, vertexZ);
             var colorIndex = j % rainbowColors.length;
             colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}
//==========================================================================================







function updateViewMatrix() {
    var sensitivity = 0.001; // Adjust sensitivity here
    var dx = mouseX - prevMouseX;
    var dy = mouseY - prevMouseY;

    // Rotate the view matrix based on mouse movement
    LIBS.rotateY(VIEW_MATRIX, -dx);
    LIBS.rotateX(VIEW_MATRIX, -dy);

    prevMouseX = mouseX;
    prevMouseY = mouseY;
}

function main() {
    var CANVAS = document.getElementById("your_canvas");

    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    var GL;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
        var EXT = GL.getExtension("OES_element_index_uint");
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }

    //shaders
    var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;

    uniform mat4 PMatrix;
    uniform mat4 VMatrix;
    uniform mat4 MMatrix;
    
    varying vec3 vColor;
    void main(void) {
    gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
    vColor = color;
    }`;
    var shader_fragment_source = `
    precision mediump float;
    varying vec3 vColor;
      // uniform vec3 color;
    void main(void) {
    gl_FragColor = vec4(vColor, 1.);
    
    }`;
    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(SHADER_PROGRAM);


    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");


    //uniform
    var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
    var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
    var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model


    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);
    GL.useProgram(SHADER_PROGRAM);

    // Create buffers 
    //moncong
    //==============================================================================================
    var mon = generateMoncong(0, 0, 5.6, 1, 50, 0.2, 0.2, 0.8, 0, Math.PI, 0); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXMONCONG = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXMONCONG);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mon.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSMONCONG = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSMONCONG);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mon.colors), GL.STATIC_DRAW);

    var TUBE_FACESMONCONG = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESMONCONG);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mon.faces), GL.STATIC_DRAW);
    //==============================================================================================

    //head pesawat
    //==============================================================================================
    var headp = generateHeadPesawat(0, 0, 4.2, 1.2, 50, 0.5, 0.5, 0.8); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXHEADPESAWAT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHEADPESAWAT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headp.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSHEADPESAWAT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHEADPESAWAT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headp.colors), GL.STATIC_DRAW);

    var TUBE_FACESHEADPESAWAT = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHEADPESAWAT);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(headp.faces), GL.STATIC_DRAW);
    //==============================================================================================
   
    //glass
    //==============================================================================================
    var glass1 = generateGlass(0, 0.4, 4.2, 1.2, 50, 0.4, 0.2, 0.4); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXGLASS1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXGLASS1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(glass1.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSGLASS1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSGLASS1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(glass1.colors), GL.STATIC_DRAW);

    var TUBE_FACESGLASS1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESGLASS1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(glass1.faces), GL.STATIC_DRAW);
    
    //==============================================================================================

    //badan pesawat
    //==============================================================================================
    var badanpesawat = generateBadanPesawat(0, 0, 0, 1.2, 50, 1.2, 1, 2.5); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXBADANPESAWAT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXBADANPESAWAT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(badanpesawat.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSBADANPESAWAT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSBADANPESAWAT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(badanpesawat.colors), GL.STATIC_DRAW);

    var TUBE_FACESBADANPESAWAT = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESBADANPESAWAT);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(badanpesawat.faces), GL.STATIC_DRAW);
    
    //==============================================================================================

    //pipe
    //==============================================================================================
    var pipe = generatePipe(0, 0, 2.8, 2, 0.3, 50, 0.05, 0.05, 0.05, 0, 0, 0); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXPIPE = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPIPE);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pipe.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSPIPE = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPIPE);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pipe.colors), GL.STATIC_DRAW);

    var TUBE_FACESPIPE = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPIPE);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pipe.faces), GL.STATIC_DRAW);
    
    //==============================================================================================

    //kenalpot
    //==============================================================================================
    var ken = generateKenalpot(1.5, 0, -3, 1, 50, 0.8, 0.8, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKENALPOT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKENALPOT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken.colors), GL.STATIC_DRAW);

    var TUBE_FACESKENALPOT = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ken.faces), GL.STATIC_DRAW);

    //ken2
    var ken2 = generateKenalpot(-1.5, 0, -3, 1, 50, 0.8, 0.8, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKENALPOT2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKENALPOT2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken2.colors), GL.STATIC_DRAW);

    var TUBE_FACESKENALPOT2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ken2.faces), GL.STATIC_DRAW);

    //ken3
    var ken3 = generateKenalpot(0, 1.5, -3, 1, 50, 0.8, 0.8, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKENALPOT3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken3.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKENALPOT3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken3.colors), GL.STATIC_DRAW);

    var TUBE_FACESKENALPOT3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ken3.faces), GL.STATIC_DRAW);

    //ken4
    var ken4 = generateKenalpot(0, -1.5, -3, 1, 50, 0.8, 0.8, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKENALPOT4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken4.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKENALPOT4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ken4.colors), GL.STATIC_DRAW);

    var TUBE_FACESKENALPOT4 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT4);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ken4.faces), GL.STATIC_DRAW);
    
    //==============================================================================================









    
    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();

    // Event listener untuk mouse movement
    document.addEventListener('mousemove', function (event) {
        if (isMouseDown) {
            var sensitivity = 0.01; // Adjust sensitivity here
            var dx = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var dy = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            mouseX -= dx * sensitivity;
            mouseY -= dy * sensitivity;

            updateViewMatrix();
        }
    });
    // Event listener untuk mouse down
    document.addEventListener('mousedown', function (event) {
        isMouseDown = true;
        updateViewMatrix();
    });
    // Event listener untuk mouse up
    document.addEventListener('mouseup', function (event) {
        isMouseDown = false;
    });
    function updateViewMatrix() {
        var sensitivity = 0.001; // Adjust sensitivity here
        var dx = mouseX - prevMouseX;
        var dy = mouseY - prevMouseY;
        // Rotate the view matrix based on mouse movement
        LIBS.rotateY(VIEW_MATRIX, -dx);
        LIBS.rotateX(VIEW_MATRIX, -dy);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
    }

    // Set view matrix to position the camera
    LIBS.translateZ(VIEW_MATRIX, -5);
    var zoomSpeed = 0.2; // Kecepatan zoom
    // Event listener untuk scroll mouse
    document.addEventListener('wheel', function (event) {
        // Menentukan arah scroll
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        // Mengubah posisi kamera berdasarkan arah scroll
        LIBS.translateZ(VIEW_MATRIX, delta * zoomSpeed);
        // Memastikan kamera tidak terlalu dekat atau terlalu jauh
        if (VIEW_MATRIX[14] < -20) {
            VIEW_MATRIX[14] = -20;
        }
        if (VIEW_MATRIX[14] > -1) {
            VIEW_MATRIX[14] = -1;
        }
    });

    document.addEventListener('keydown', function (event) {
        var keyCode = event.keyCode;
        if (keyCode === 87) { // W key
            keysPressed.w = true;
        } else if (keyCode === 65) { // A key
            keysPressed.a = true;
        } else if (keyCode === 83) { // S key
            keysPressed.s = true;
        } else if (keyCode === 68) { // D key
            keysPressed.d = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        var keyCode = event.keyCode;
        if (keyCode === 87) { // W key
            keysPressed.w = false;
        } else if (keyCode === 65) { // A key
            keysPressed.a = false;
        } else if (keyCode === 83) { // S key
            keysPressed.s = false;
        } else if (keyCode === 68) { // D key
            keysPressed.d = false;
        }
    });


    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var cameraSpeed = 0.1; // Kecepatan pergerakan kamera

    var time_prev = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        var dt = time - time_prev;
        time_prev = time;

        if (keysPressed.w) {
            LIBS.translateZ(VIEW_MATRIX, -cameraSpeed);
        }
        if (keysPressed.a) {
            LIBS.translateX(VIEW_MATRIX, -cameraSpeed);
        }
        if (keysPressed.s) {
            LIBS.translateZ(VIEW_MATRIX, cameraSpeed);
        }
        if (keysPressed.d) {
            LIBS.translateX(VIEW_MATRIX, cameraSpeed);
        }

        // Moncong
        //==============================================================================================
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXMONCONG);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSMONCONG);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESMONCONG);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, mon.faces.length, GL.UNSIGNED_SHORT, 0);
        
        //==============================================================================================

        // Draw head pesawat
        //==============================================================================================
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHEADPESAWAT);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHEADPESAWAT);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHEADPESAWAT);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, headp.faces.length, GL.UNSIGNED_SHORT, 0);
        
        //==============================================================================================
    
        // Draw glass
        //==============================================================================================
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXGLASS1);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSGLASS1);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESGLASS1);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, glass1.faces.length, GL.UNSIGNED_SHORT, 0);
        
        //==============================================================================================

        // Draw badan pesawt
        //==============================================================================================
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXBADANPESAWAT);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSBADANPESAWAT);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESBADANPESAWAT);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, badanpesawat.faces.length, GL.UNSIGNED_SHORT, 0);
        
        //==============================================================================================

        // Draw pipe
        //==============================================================================================
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPIPE);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPIPE);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPIPE);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, pipe.faces.length, GL.UNSIGNED_SHORT, 0);
        
        //==============================================================================================

        // Draw kenalpot
        //==============================================================================================
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, ken.faces.length, GL.UNSIGNED_SHORT, 0);
        


        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT2);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT2);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT2);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, ken2.faces.length, GL.UNSIGNED_SHORT, 0);




        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT3);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT3);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT3);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, ken3.faces.length, GL.UNSIGNED_SHORT, 0);




        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKENALPOT4);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKENALPOT4);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKENALPOT4);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, ken4.faces.length, GL.UNSIGNED_SHORT, 0);
        //==============================================================================================

        
        
        
        
        
        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);