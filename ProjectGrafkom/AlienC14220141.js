var mouseX = 0, mouseY = 0;
var prevMouseX = 0, prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};

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

    //Bikin BindBuffer dibawah ini

    //Warna
    var hijaumuda = [
        [16 / 200, 200 / 210, 150 / 250]
    ];

    var putih = [
        [1 / 1, 1 / 1, 1 / 1]
    ];

    var hitam = [
        [0 / 0, 0 / 0, 0 / 0]
    ];

    var gay = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0]
    ];





    //Kepala
    //==============================================================================================
    var head = quadric.Ellipsoid(0, 0, 0, 1.2, 50, 1.5, 1, 1, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXHEAD = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHEAD);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(head.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSHEAD = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHEAD);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(head.colors), GL.STATIC_DRAW);

    var TUBE_FACESHEAD = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHEAD);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(head.faces), GL.STATIC_DRAW);
    //==============================================================================================

    // Create buffers eye
    //==============================================================================================
    var eyeMid = quadric.Ellipsoid(0, 0, 2.2, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXEYE = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXEYE);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeMid.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSEYE = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSEYE);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeMid.colors), GL.STATIC_DRAW);

    var TUBE_FACESEYE = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESEYE);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeMid.faces), GL.STATIC_DRAW);
    


    var eyeRight = quadric.Ellipsoid(1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXEYER = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXEYER);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeRight.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSEYER = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSEYER);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeRight.colors), GL.STATIC_DRAW);

    var TUBE_FACESEYER = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESEYER);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeRight.faces), GL.STATIC_DRAW);
    


    var eyeLeft = quadric.Ellipsoid(-1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXEYEL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXEYEL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeLeft.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSEYEL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSEYEL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeLeft.colors), GL.STATIC_DRAW);

    var TUBE_FACESEYEL = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESEYEL);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeLeft.faces), GL.STATIC_DRAW);
    

    // //pupil
    
    var pupilMid = quadric.Ellipsoid(0, -0.35, 2.2, 2, 50, 0.1, 0.05, 0.1, hitam); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXPUPIL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPUPIL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilMid.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSPUPIL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPUPIL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilMid.colors), GL.STATIC_DRAW);

    var TUBE_FACESPUPIL = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPUPIL);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pupilMid.faces), GL.STATIC_DRAW);
    


    var pupilRight = quadric.Ellipsoid(1.2, -0.35, 1.95, 2, 50, 0.1, 0.05, 0.1, hitam); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXPUPILR = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPUPILR);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilRight.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSPUPILR = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPUPILR);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilRight.colors), GL.STATIC_DRAW);

    var TUBE_FACESPUPILR = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPUPILR);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pupilRight.faces), GL.STATIC_DRAW);
    


    var pupilLeft = quadric.Ellipsoid(-1.2, -0.35, 1.95, 2, 50, 0.1, 0.05, 0.1, hitam); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXPUPILL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPUPILL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilLeft.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSPUPILL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPUPILL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilLeft.colors), GL.STATIC_DRAW);

    var TUBE_FACESPUPILL = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPUPILL);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeLeft.faces), GL.STATIC_DRAW);
    
    //hiasan
    var hiasanMid = quadric.Ellipsoid(0.05, -0.40, 2.25, 1, 50, 0.1, 0.05, 0.1, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXHIASAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHIASAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hiasanMid.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSHIASAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHIASAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hiasanMid.colors), GL.STATIC_DRAW);

    var TUBE_FACESHIASAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHIASAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hiasanMid.faces), GL.STATIC_DRAW);
    


    var hiasanRight = quadric.Ellipsoid(1.25, -0.4, 2, 1, 50, 0.1, 0.05, 0.1, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXHIASANR = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHIASANR);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hiasanRight.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSHIASANR = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHIASANR);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hiasanRight.colors), GL.STATIC_DRAW);

    var TUBE_FACESHIASANR = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHIASANR);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hiasanRight.faces), GL.STATIC_DRAW);
    


    var hiasanLeft = quadric.Ellipsoid(-1.15, -0.4, 2, 1, 50, 0.1, 0.05, 0.1, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXHIASANL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHIASANL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hiasanLeft.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSHIASANL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHIASANL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hiasanLeft.colors), GL.STATIC_DRAW);

    var TUBE_FACESHIASANL = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHIASANL);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hiasanLeft.faces), GL.STATIC_DRAW);
    //==============================================================================================

    // Create buffers kelopak
    //==============================================================================================
    var kelopakMid = quadric.SetengahEllipsoid(0, 0, 2.2, 2, 50, 0.2, 0.2, 0.2, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKELOPAK = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKELOPAK);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kelopakMid.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKELOPAK = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKELOPAK);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kelopakMid.colors), GL.STATIC_DRAW);

    var TUBE_FACESKELOPAK = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKELOPAK);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kelopakMid.faces), GL.STATIC_DRAW);
    

    var kelopakRight = quadric.SetengahEllipsoid(1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKELOPAKR = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKELOPAKR);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kelopakRight.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKELOPAKR = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKELOPAKR);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kelopakRight.colors), GL.STATIC_DRAW);

    var TUBE_FACESKELOPAKR = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKELOPAKR);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kelopakRight.faces), GL.STATIC_DRAW);
    
    var kelopakLeft = quadric.SetengahEllipsoid(-1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKELOPAKL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKELOPAKL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kelopakLeft.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKELOPAKL = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKELOPAKL);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kelopakLeft.colors), GL.STATIC_DRAW);

    var TUBE_FACESKELOPAKL = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKELOPAKL);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kelopakLeft.faces), GL.STATIC_DRAW);
    //==============================================================================================

    //anten
    var anten1 = quadric.Tabung(0, 0, 1.8, 1.5, 0.5, 50, 0.05, 0.05, 0.05, 0, Math.PI, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXANTEN1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXANTEN1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(anten1.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSANTEN1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSANTEN1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(anten1.colors), GL.STATIC_DRAW);

    var TUBE_FACESANTEN1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESANTEN1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(anten1.faces), GL.STATIC_DRAW);

    var anten2 = quadric.Tabung(0.8, 0, 1, 1.5, 0.5, 50, 0.05, 0.05, 0.05, 0, -Math.PI/7, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXANTEN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXANTEN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(anten2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSANTEN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSANTEN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(anten2.colors), GL.STATIC_DRAW);

    var TUBE_FACESANTEN2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESANTEN2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(anten2.faces), GL.STATIC_DRAW);

    var anten3 = quadric.Tabung(-0.8, 0, 1, 1.5, 0.5, 50, 0.05, 0.05, 0.05, 0, Math.PI/7, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXANTEN3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXANTEN3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(anten3.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSANTEN3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSANTEN3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(anten3.colors), GL.STATIC_DRAW);

    var TUBE_FACESANTEN3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESANTEN3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(anten3.faces), GL.STATIC_DRAW);

    //==============================================================================================

    //leher
    var leher = quadric.Tabung(0, 0, -1.95, 2.8, 0.3, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXLEHER = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXLEHER);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leher.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSLEHER = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSLEHER);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leher.colors), GL.STATIC_DRAW);

    var TUBE_FACESLEHER = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESLEHER);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leher.faces), GL.STATIC_DRAW);
    
    //==============================================================================================

    //Pelengkap badan
    var pbadan = quadric.Ellipsoid(0, 0, -2.4, 1.5, 50, 1, 1, 0.4,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXPBADAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPBADAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pbadan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSPBADAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPBADAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pbadan.colors), GL.STATIC_DRAW);

    var TUBE_FACESPBADAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPBADAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pbadan.faces), GL.STATIC_DRAW);


    var pbadan1 = quadric.Ellipsoid(0, 0, -4.8, 1.5, 50, 1, 1, 0.4,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXPBADAN1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPBADAN1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pbadan1.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSPBADAN1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPBADAN1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pbadan1.colors), GL.STATIC_DRAW);

    var TUBE_FACESPBADAN1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPBADAN1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pbadan1.faces), GL.STATIC_DRAW);

    //==============================================================================================
    
    //badan
    var badan = quadric.Tabung(0, 0, -4.8, 1.20, 2, 50, 1, 1, 0, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXBADAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXBADAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(badan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSBADAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSBADAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(badan.colors), GL.STATIC_DRAW);

    var TUBE_FACESBADAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESBADAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(badan.faces), GL.STATIC_DRAW);
    //==============================================================================================
    
    //sendi
    //KANAN
    var sendikanan = quadric.Ellipsoid(1.7, 0, -2.6, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikanan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikanan.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikanan.faces), GL.STATIC_DRAW);
    
    //LVL2
    var sendikanan2 = quadric.Ellipsoid(1.7, 0, -4.2, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANAN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikanan2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANAN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikanan2.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANAN2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikanan2.faces), GL.STATIC_DRAW);
    
    //KANAN BAWAH
    var sendikananbawah = quadric.Ellipsoid(1.2, 0, -5.4, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKANANBAWAH = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANANBAWAH);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikananbawah.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKANANBAWAH = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANANBAWAH);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikananbawah.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKANANBAWAH = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANANBAWAH);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikananbawah.faces), GL.STATIC_DRAW);
    
    //LVL2
    var sendikananbawah2 = quadric.Ellipsoid(1.2, 0, -7, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKANANBAWAH2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANANBAWAH2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikananbawah2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKANANBAWAH2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANANBAWAH2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikananbawah2.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKANANBAWAH2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANANBAWAH2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikananbawah2.faces), GL.STATIC_DRAW);
    
    //KIRI
    var sendikiri = quadric.Ellipsoid(-1.7, 0, -2.6, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiri.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiri.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRI);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikiri.faces), GL.STATIC_DRAW);
    
    //LVL2
    var sendikiri2 = quadric.Ellipsoid(-1.7, 0, -4.2, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRI2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiri2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRI2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiri2.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRI2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikiri2.faces), GL.STATIC_DRAW);
    
    //KIRI BAWAH
    var sendikiribawah = quadric.Ellipsoid(-1.2, 0, -5.4, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKIRIBAWAH = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRIBAWAH);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiribawah.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKIRIBAWAH = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRIBAWAH);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiribawah.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKIRIBAWAH = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRIBAWAH);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikiribawah.faces), GL.STATIC_DRAW);
    
    //LVL 2
    var sendikiribawah2 = quadric.Ellipsoid(-1.2, 0, -7, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXSENDIKIRIBAWAH2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRIBAWAH2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiribawah2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSSENDIKIRIBAWAH2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRIBAWAH2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sendikiribawah2.colors), GL.STATIC_DRAW);

    var TUBE_FACESSENDIKIRIBAWAH2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRIBAWAH2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sendikiribawah2.faces), GL.STATIC_DRAW);
    
    //==============================================================================================

    //TABUNG TANGAN DAN KAKI LVL 1
    //==============================================================================================
    //TANGANkanan
    var tangankanan = quadric.Tabung(1.7, 0, -4.2, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTANGANKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankanan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTANGANKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankanan.colors), GL.STATIC_DRAW);

    var TUBE_FACESTANGANKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKANAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangankanan.faces), GL.STATIC_DRAW);
    
    //TANGANkiri
    var tangankiri = quadric.Tabung(-1.7, 0, -4.2, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTANGANKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankiri.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTANGANKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankiri.colors), GL.STATIC_DRAW);

    var TUBE_FACESTANGANKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKIRI);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangankiri.faces), GL.STATIC_DRAW);
    
    //kaki kanan
    var kakikanan = quadric.Tabung(1.2, 0, -7, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKAKIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikanan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKAKIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikanan.colors), GL.STATIC_DRAW);

    var TUBE_FACESKAKIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKANAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kakikanan.faces), GL.STATIC_DRAW);
    
    //kaki kiri
    var kakikiri = quadric.Tabung(-1.2, 0, -7, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKAKIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikiri.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKAKIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikiri.colors), GL.STATIC_DRAW);

    var TUBE_FACESKAKIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKIRI);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kakikiri.faces), GL.STATIC_DRAW);

    //lvl2
    //TANGANkanan
    var tangankanan2 = quadric.Tabung(1.7, 0, -5.9, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTANGANKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKANAN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankanan2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTANGANKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKANAN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankanan2.colors), GL.STATIC_DRAW);

    var TUBE_FACESTANGANKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKANAN2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangankanan2.faces), GL.STATIC_DRAW);
    
    //TANGANkiri
    var tangankiri2 = quadric.Tabung(-1.7, 0, -5.9, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTANGANKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKIRI2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankiri2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTANGANKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKIRI2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tangankiri2.colors), GL.STATIC_DRAW);

    var TUBE_FACESTANGANKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKIRI2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tangankiri2.faces), GL.STATIC_DRAW);
    
    //kaki kanan
    var kakikanan2 = quadric.Tabung(1.2, 0, -8.7, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKAKIKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKANAN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikanan2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKAKIKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKANAN2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikanan2.colors), GL.STATIC_DRAW);

    var TUBE_FACESKAKIKANAN2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKANAN2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kakikanan2.faces), GL.STATIC_DRAW);
    
    //kaki kiri
    var kakikiri2 = quadric.Tabung(-1.2, 0, -8.7, 2.8, 0.6, 50, 0.05, 0.05, 0.05, 0, 0, 0,gay); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXKAKIKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKIRI2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikiri2.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSKAKIKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKIRI2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kakikiri2.colors), GL.STATIC_DRAW);

    var TUBE_FACESKAKIKIRI2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKIRI2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kakikiri2.faces), GL.STATIC_DRAW);
    //==========================================================================================

    //telapaktangan
    var telapakkanan = quadric.EllipticParaboloid(1.7, 0, -7, 5, 50, 0.05, 0.05, 0.1, 0, 0, 0,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTELAPAKKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkanan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTELAPAKKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkanan.colors), GL.STATIC_DRAW);

    var TUBE_FACESTELAPAKKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKANAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(telapakkanan.faces), GL.STATIC_DRAW);
    
    var telapakkiri = quadric.EllipticParaboloid(-1.7, 0, -7, 5, 50, 0.05, 0.05, 0.1, 0, 0, 0,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTELAPAKKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkiri.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTELAPAKKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkiri.colors), GL.STATIC_DRAW);

    var TUBE_FACESTELAPAKKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKIRI);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(telapakkiri.faces), GL.STATIC_DRAW);
    
 //==========================================================================================
    //telapak sikil

    var telapakkakikanan = quadric.Ellipsoid(1.2, -0.4, -8.8, 2, 50, 0.3, 0.5, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTELAPAKKAKIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKAKIKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkakikanan.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTELAPAKKAKIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKAKIKANAN);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkakikanan.colors), GL.STATIC_DRAW);

    var TUBE_FACESTELAPAKKAKIKANAN = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKAKIKANAN);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(telapakkakikanan.faces), GL.STATIC_DRAW);
    

    var telapakkakikiri = quadric.Ellipsoid(-1.2, -0.4, -8.8, 2, 50, 0.3, 0.5, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEXTELAPAKKAKIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKAKIKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkakikiri.vertices), GL.STATIC_DRAW);

    var TUBE_COLORSTELAPAKKAKIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKAKIKIRI);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(telapakkakikiri.colors), GL.STATIC_DRAW);

    var TUBE_FACESTELAPAKKAKIKIRI = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKAKIKIRI);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(telapakkakikiri.faces), GL.STATIC_DRAW);
    
    //==========================================================================================
    

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
    
    //draw dibawah ini
    //Draw Head
    //==============================================================================================
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHEAD);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHEAD);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHEAD);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, head.faces.length, GL.UNSIGNED_SHORT, 0);
    //==============================================================================================

    //Draw Eye
    //==============================================================================================
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXEYE);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSEYE);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESEYE);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, eyeMid.faces.length, GL.UNSIGNED_SHORT, 0);
    
    
    
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXEYER);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSEYER);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESEYER);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, eyeRight.faces.length, GL.UNSIGNED_SHORT, 0);
    


    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXEYEL);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSEYEL);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESEYEL);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, eyeLeft.faces.length, GL.UNSIGNED_SHORT, 0);
    

    //pupil
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPUPIL);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPUPIL);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPUPIL);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, pupilMid.faces.length, GL.UNSIGNED_SHORT, 0);
    
    
    
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPUPILR);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPUPILR);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPUPILR);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, pupilRight.faces.length, GL.UNSIGNED_SHORT, 0);
    


    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPUPILL);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPUPILL);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPUPILL);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, pupilLeft.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //hiasan
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHIASAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHIASAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHIASAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, hiasanMid.faces.length, GL.UNSIGNED_SHORT, 0);
    
    
    
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHIASANR);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHIASANR);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHIASANR);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, hiasanRight.faces.length, GL.UNSIGNED_SHORT, 0);
    


    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXHIASANL);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSHIASANL);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESHIASANL);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, hiasanLeft.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //==============================================================================================

    //Draw Kelopak
    //==============================================================================================
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKELOPAK);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKELOPAK);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKELOPAK);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kelopakMid.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKELOPAKR);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKELOPAKR);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKELOPAKR);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kelopakRight.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKELOPAKL);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKELOPAKL);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKELOPAKL);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kelopakLeft.faces.length, GL.UNSIGNED_SHORT, 0);

    //draw anten
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXANTEN1);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSANTEN1);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESANTEN1);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, anten1.faces.length, GL.UNSIGNED_SHORT, 0);



    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXANTEN2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSANTEN2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESANTEN2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, anten2.faces.length, GL.UNSIGNED_SHORT, 0);




    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXANTEN3);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSANTEN3);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESANTEN3);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, anten3.faces.length, GL.UNSIGNED_SHORT, 0);

    //==============================================================================================

    //draw leher
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXLEHER);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSLEHER);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESLEHER);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, leher.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //==============================================================================================
    //draw pelengkap badan
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPBADAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPBADAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPBADAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, pbadan.faces.length, GL.UNSIGNED_SHORT, 0);
    




    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXPBADAN1);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSPBADAN1);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESPBADAN1);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, pbadan1.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //==============================================================================================
    
    //draw badan
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXBADAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSBADAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESBADAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, badan.faces.length, GL.UNSIGNED_SHORT, 0);
    //==============================================================================================
    
    // draw sendi
    //KANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikanan.faces.length, GL.UNSIGNED_SHORT, 0);

    //KANAN BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANANBAWAH);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANANBAWAH);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANANBAWAH);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikananbawah.faces.length, GL.UNSIGNED_SHORT, 0);

    //KIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRI);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRI);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRI);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikiri.faces.length, GL.UNSIGNED_SHORT, 0);

    //KIRI BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRIBAWAH);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRIBAWAH);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRIBAWAH);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikiribawah.faces.length, GL.UNSIGNED_SHORT, 0);
    
    
    //LVL2
    //KANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANAN2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANAN2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANAN2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikanan2.faces.length, GL.UNSIGNED_SHORT, 0);

    //KANAN BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKANANBAWAH2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKANANBAWAH2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKANANBAWAH2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikananbawah2.faces.length, GL.UNSIGNED_SHORT, 0);

    //KIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRI2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRI2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRI2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikiri2.faces.length, GL.UNSIGNED_SHORT, 0);

    //KIRI BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXSENDIKIRIBAWAH2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSSENDIKIRIBAWAH2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESSENDIKIRIBAWAH2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sendikiribawah2.faces.length, GL.UNSIGNED_SHORT, 0);
    //==============================================================================================
    
    //DRAW KAKI TANGAN TABUNG
    //TANGAN KANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKANAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKANAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKANAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, tangankanan.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //TANGAN KIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKIRI);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKIRI);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKIRI);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, tangankiri.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //KAKI KANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKANAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKANAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKANAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kakikanan.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //KAKI KIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKIRI);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKIRI);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKIRI);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kakikiri.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //lvl 2
    //TANGAN KANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKANAN2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKANAN2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKANAN2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, tangankanan2.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //TANGAN KIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTANGANKIRI2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTANGANKIRI2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTANGANKIRI2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, tangankiri2.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //KAKI KANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKANAN2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKANAN2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKANAN2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kakikanan2.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //KAKI KIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXKAKIKIRI2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSKAKIKIRI2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESKAKIKIRI2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kakikiri2.faces.length, GL.UNSIGNED_SHORT, 0);
    
    //==============================================================================================

    //TELAPAK
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKANAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKANAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKANAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, telapakkanan.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKIRI);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKIRI);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKIRI);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, telapakkiri.faces.length, GL.UNSIGNED_SHORT, 0);
    //==============================================================================================

    //telapak sikil
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKAKIKANAN);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKAKIKANAN);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKAKIKANAN);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, telapakkakikanan.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEXTELAPAKKAKIKIRI);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORSTELAPAKKAKIKIRI);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACESTELAPAKKAKIKIRI);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, telapakkakikiri.faces.length, GL.UNSIGNED_SHORT, 0);









    GL.flush();

    window.requestAnimationFrame(animate);
};

animate(0);
}


window.addEventListener('load', main);