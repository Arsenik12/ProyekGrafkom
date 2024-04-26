var mouseX = 0, mouseY = 0;
var prevMouseX = 0, prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Sphere
function generateBadan(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [161 / 255, 195 / 255, 152 / 255] // Warna A1C398
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

// Elliptic Cone
function generateTanduk(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [76 / 255, 88 / 255, 59 / 255] // Warna 76885B
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = (i / segments);
        var v = -latAngle
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * v * ovalScaleX;
            var yCoord = sinLon * v * ovalScaleY;
            var zCoord = v * ovalScaleZ;
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

// Half Sphere
function generateAlisMata(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [0.0, 0.0, 0.0] // Warna hitam
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

// Sphere
function generateMata(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [0.0, 0.0, 0.0] // Warna FFAF45
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

// // Update posisi mata berdasarkan sudut rotasi
// var eyeRotationAngle = 0; // Deklarasikan variabel di luar fungsi main()
// function updateEyePosition() {
//     MODEL_MATRIX = LIBS.get_I4();
//     LIBS.translate(MODEL_MATRIX, 0, -1.156, 1);
//     LIBS.rotateZ(MODEL_MATRIX, eyeRotationAngle);
// }

// Elliptic Cone
function generateKaki(x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * vLat * scaleX;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = -Math.pow(vLat, 2) * scaleZ;
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

function generateRambut(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, scaleX, scaleY) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [0.0, 0.0, 0.0]
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

function generateTangan(x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
    var vertices = [];
    var colors = [];

    var angleIncrement = (2 * Math.PI) / segments;

    var rainbowColors = [
        [161 / 255, 195 / 255, 152 / 255],
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var vLat = latAngle;

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * vLat * scaleX;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = Math.pow(vLat, 2) * scaleZ;

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

    // Badan Sekaligus Kepala
    var badan = generateBadan(0, 0, 0.5, 1.2, 50, 1, 1, 1.2); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(badan.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(badan.colors), GL.STATIC_DRAW);
    var TUBE_FACES1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(badan.faces), GL.STATIC_DRAW);

    // Tanduk
    var tanduk = generateTanduk(0, 0, 2.4, 1, 50, 1, 1, 1.5); // tanduk: x, y, z, radius, segments, ovalScaleX, ovalScaleY
    var TUBE_VERTEX2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tanduk.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tanduk.colors), GL.STATIC_DRAW);
    var TUBE_FACES2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tanduk.faces), GL.STATIC_DRAW);


    // Alis Mata
    var alis_mata = generateAlisMata(0, -0.976, 1, 2.5, 50, -0.2, -0, -0.15); // alis mata: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(alis_mata.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(alis_mata.colors), GL.STATIC_DRAW);
    var TUBE_FACES3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(alis_mata.faces), GL.STATIC_DRAW);

    // Mata
    var mata = generateMata(0, -1.156, 1, 0.15, 50, 0.50, 0.50, 2); // mata: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mata.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mata.colors), GL.STATIC_DRAW);
    var TUBE_FACES4 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES4);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mata.faces), GL.STATIC_DRAW);
    // // Event listener untuk tombol panah kiri dan kanan
    // document.addEventListener('keydown', function (event) {
    //     // Panah kiri
    //     if (event.keyCode === 37) {
    //         eyeRotationAngle -= eyeRotationSpeed;
    //     }
    //     // Panah kanan
    //     else if (event.keyCode === 39) {
    //         eyeRotationAngle += eyeRotationSpeed;
    //     }
    // });

    // Rambut
    var rambut = generateRambut(1, 0, 1.5, -0.1, 50, 0.50, 0.5, 2, -0.6,); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rambut.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rambut.colors), GL.STATIC_DRAW);
    var TUBE_FACES5 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES5);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rambut.faces), GL.STATIC_DRAW);


    // Kaki
    var kaki = generateKaki(1, -1, 1, 0.2, 50, 1, 1, 1); // kaki: x, y, z, radius, segments, scaleX, scaleY, scaleZ
    var TUBE_VERTEX6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kaki.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kaki.colors), GL.STATIC_DRAW);
    var TUBE_FACES6 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES6);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kaki.faces), GL.STATIC_DRAW);

    // Tangaa kanan
    var tangan_kanan = generateTangan(1.5, 0, -2, 0.4, 50, 0.3, 0.3, 1); // kaki: x, y, z, radius, segments, scaleX, scaleY, scaleZ
    var TUBE_VERTEX7 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX7);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangan_kanan.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS7 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS7);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangan_kanan.colors), GL.STATIC_DRAW);
    var TUBE_FACES7 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES7);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangan_kanan.faces), GL.STATIC_DRAW);

    // Tangaa kiri
    var tangan_kiri = generateTangan(1.5, 0, -2, 0.4, 50, 0.3, 0.3, 1); // kaki: x, y, z, radius, segments, scaleX, scaleY, scaleZ
    var TUBE_VERTEX8 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX8);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangan_kiri.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS8 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS8);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangan_kiri.colors), GL.STATIC_DRAW);
    var TUBE_FACES8 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES8);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangan_kiri.faces), GL.STATIC_DRAW);

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

        // Badan
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX1);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS1);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES1);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, badan.faces.length, GL.UNSIGNED_SHORT, 0);

        // Tanduk
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX2);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS2);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES2);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, tanduk.faces.length, GL.UNSIGNED_SHORT, 0);

        // // Rambut
        // GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX5);
        // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        // GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS5);
        // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES5);
        // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        // GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        // GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        // GL.drawElements(GL.TRIANGLES, rambut.faces.length, GL.UNSIGNED_SHORT, 0);

        // Alis Mata
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX3);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS3);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES3);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, alis_mata.faces.length, GL.UNSIGNED_SHORT, 0);

        // Mata
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX4);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS4);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES4);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        // updateEyePosition();  // -> update posisi mata
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, mata.faces.length, GL.UNSIGNED_SHORT, 0);

        // Tangan kanan
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX7);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS7);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES7);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, tangan_kanan.faces.length, GL.UNSIGNED_SHORT, 0);

        // Tangan kiri
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX8);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS8);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES8);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, tangan_kiri.faces.length, GL.UNSIGNED_SHORT, 0);

        // Kaki
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX1);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS1);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES1);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, badan.faces.length, GL.UNSIGNED_SHORT, 0);

        // // // Rotate the kaki elliptic paraboloid (cone) to face the opposite direction
        // // LIBS.rotateZ(MODEL_MATRIX, Math.PI); // Rotate the kaki elliptic paraboloid (cone) 180 degrees around the z-axis
        // // Kaki
        // GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX3);
        // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        // GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS3);
        // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES3);
        // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        // GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        // GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        // GL.drawElements(GL.TRIANGLES, kaki.faces.length, GL.UNSIGNED_SHORT, 0);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);