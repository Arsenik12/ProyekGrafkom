var mouseX = 0, mouseY = 0;
var prevMouseX = 0, prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};

var GL;
class MyObj {
    canvas = null;
    vertex = [];
    faces = [];
    colors = [];

    SHADER_PROGRAM = null;
    _color = null;
    _position = null;

    _MMatrix = LIBS.get_I4();
    _PMatrix = LIBS.get_I4();
    _VMatrix = LIBS.get_I4();
    _greyScality = 0;

    TRIANGLE_VERTEX = null;
    TRIANGLE_FACES = null;
    TRIANGLE_COLORS = null;

    MODEL_MATRIX = LIBS.get_I4();
    child = [];

    constructor(vertex, faces, source_shader_vertex, source_shader_fragment, colors) {
        this.vertex = vertex;
        this.faces = faces;
        this.colors = colors;

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

        var shader_vertex = compile_shader(source_shader_vertex, GL.VERTEX_SHADER, "VERTEX");
        var shader_fragment = compile_shader(source_shader_fragment, GL.FRAGMENT_SHADER, "FRAGMENT");

        this.SHADER_PROGRAM = GL.createProgram();
        GL.attachShader(this.SHADER_PROGRAM, shader_vertex);
        GL.attachShader(this.SHADER_PROGRAM, shader_fragment);

        GL.linkProgram(this.SHADER_PROGRAM);

        // Get attribute and uniform locations
        this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color");
        this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");
        this._PMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "PMatrix"); //projection
        this._VMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "VMatrix"); //View
        this._MMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "MMatrix"); //Model
        this._greyScality = GL.getUniformLocation(this.SHADER_PROGRAM, "greyScality");//GreyScality

        // Enable attribute arrays
        GL.enableVertexAttribArray(this._color);
        GL.enableVertexAttribArray(this._position);
        GL.useProgram(this.SHADER_PROGRAM);

        // Create buffers
        this.TRIANGLE_VERTEX = GL.createBuffer();
        this.TRIANGLE_FACES = GL.createBuffer();
        this.TRIANGLE_COLORS = GL.createBuffer(); // Create color buffer
    }

    setup() {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_COLORS); // Use the color buffer
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.colors), GL.STATIC_DRAW); // Update with rainbow colors

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW);
        this.child.forEach(obj => {

            obj.setup();
        });
    }
    
    render(model_matrix, VIEW_MATRIX, PROJECTION_MATRIX) {
        GL.useProgram(this.SHADER_PROGRAM);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 0, 0); // Use the position buffer

        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_COLORS); // Bind the color buffer
        GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 0, 0); // Use the color buffer

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);

        GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(this._MMatrix, false, model_matrix); // Use the provided model_matrix
        GL.uniform1f(this._greyScality, 1);

        GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

        GL.flush();
        this.child.forEach(obj => {
            obj.render(model_matrix, VIEW_MATRIX, PROJECTION_MATRIX); // Pass model_matrix to child objects
        });
    }
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

    var rb = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0]
    ];

    //Kepala
    //==============================================================================================
    var headData = quadric.Ellipsoid(0, 0, 0, 1.2, 50, 1.5, 1, 1, hijaumuda);
    var head = new MyObj(headData.vertices, headData.faces, shader_vertex_source, shader_fragment_source, headData.colors);
    head.setup();    
    //==============================================================================================

    // Create buffers eye
    //==============================================================================================
    var mataTengahData = quadric.Ellipsoid(0, 0, 2.2, 2, 50, 0.2, 0.2, 0.2,putih);
    var mataTengah = new MyObj(mataTengahData.vertices, mataTengahData.faces, shader_vertex_source, shader_fragment_source, mataTengahData.colors);
    mataTengah.setup();    

    var mataKananData = quadric.Ellipsoid(1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var mataKanan = new MyObj(mataKananData.vertices, mataKananData.faces, shader_vertex_source, shader_fragment_source, mataKananData.colors);
    mataKanan.setup();    

    var mataKiriData = quadric.Ellipsoid(-1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var mataKiri = new MyObj(mataKiriData.vertices, mataKiriData.faces, shader_vertex_source, shader_fragment_source, mataKiriData.colors);
    mataKiri.setup();    

    // //pupil  
    var pupilMidData = quadric.Ellipsoid(0, -0.35, 2.2, 2, 50, 0.1, 0.05, 0.1, hitam); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupilMid = new MyObj(pupilMidData.vertices, pupilMidData.faces, shader_vertex_source, shader_fragment_source, pupilMidData.colors);
    pupilMid.setup();    

    var pupilRightData = quadric.Ellipsoid(1.2, -0.35, 1.95, 2, 50, 0.1, 0.05, 0.1, hitam); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupilRight = new MyObj(pupilRightData.vertices, pupilRightData.faces, shader_vertex_source, shader_fragment_source, pupilRightData.colors);
    pupilRight.setup();    

    var pupilLeftData = quadric.Ellipsoid(-1.2, -0.35, 1.95, 2, 50, 0.1, 0.05, 0.1, hitam); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupilLeft = new MyObj(pupilLeftData.vertices, pupilLeftData.faces, shader_vertex_source, shader_fragment_source, pupilLeftData.colors);
    pupilLeft.setup();    

    //hiasan
    var hiasanMidData = quadric.Ellipsoid(0.05, -0.40, 2.25, 1, 50, 0.1, 0.05, 0.1, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var hiasanMid = new MyObj(hiasanMidData.vertices, hiasanMidData.faces, shader_vertex_source, shader_fragment_source, hiasanMidData.colors);
    hiasanMid.setup();    

    var hiasanRightData = quadric.Ellipsoid(1.25, -0.4, 2, 1, 50, 0.1, 0.05, 0.1, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var hiasanRight = new MyObj(hiasanRightData.vertices, hiasanRightData.faces, shader_vertex_source, shader_fragment_source, hiasanRightData.colors);
    hiasanRight.setup();    

    var hiasanLeftData = quadric.Ellipsoid(-1.15, -0.4, 2, 1, 50, 0.1, 0.05, 0.1, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var hiasanLeft = new MyObj(hiasanLeftData.vertices, hiasanLeftData.faces, shader_vertex_source, shader_fragment_source, hiasanLeftData.colors);
    hiasanLeft.setup();    
    //==============================================================================================


    // Create buffers kelopak
    //==============================================================================================
    var kelopakMidData = quadric.SetengahEllipsoid(0, 0, 2.2, 2, 50, 0.2, 0.2, 0.2, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kelopakMid = new MyObj(kelopakMidData.vertices, kelopakMidData.faces, shader_vertex_source, shader_fragment_source, kelopakMidData.colors);
    kelopakMid.setup();    

    var kelopakRightData = quadric.SetengahEllipsoid(1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kelopakRight = new MyObj(kelopakRightData.vertices, kelopakRightData.faces, shader_vertex_source, shader_fragment_source, kelopakRightData.colors);
    kelopakRight.setup();    

    var kelopakLeftData = quadric.SetengahEllipsoid(-1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kelopakLeft = new MyObj(kelopakLeftData.vertices, kelopakLeftData.faces, shader_vertex_source, shader_fragment_source, kelopakLeftData.colors);
    kelopakLeft.setup();    
    //==============================================================================================

    //anten
    var anten1Data = quadric.Tabung(0, 0, 1.5, 2, 14, 50, 0.05, 0.05, 0.05, 0, Math.PI, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var anten1 = new MyObj(anten1Data.vertices, anten1Data.faces, shader_vertex_source, shader_fragment_source, anten1Data.colors);
    anten1.setup();    

    var anten2Data = quadric.Tabung(0.9, 0, 1.3, 2, 14, 50, 0.05, 0.05, 0.05, 0, -Math.PI/7, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var anten2 = new MyObj(anten2Data.vertices, anten2Data.faces, shader_vertex_source, shader_fragment_source, anten2Data.colors);
    anten2.setup();    

    var anten3Data = quadric.Tabung(-0.9, 0, 1.3, 2, 14, 50, 0.05, 0.05, 0.05, 0, Math.PI/7, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var anten3 = new MyObj(anten3Data.vertices, anten3Data.faces, shader_vertex_source, shader_fragment_source, anten3Data.colors);
    anten3.setup();    
    //==============================================================================================

    //leher
    var leherData = quadric.Tabung(0, 0, -1.5, 5.6, 15, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var leher = new MyObj(leherData.vertices, leherData.faces, shader_vertex_source, shader_fragment_source, leherData.colors);
    leher.setup();    
    //==============================================================================================

    //Pelengkap badan
    var pbadanData = quadric.Ellipsoid(0, 0, -2.4, 1.5, 50, 1, 1, 0.4,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pbadan = new MyObj(pbadanData.vertices, pbadanData.faces, shader_vertex_source, shader_fragment_source, pbadanData.colors);
    pbadan.setup();    

    var pbadan1Data = quadric.Ellipsoid(0, 0, -4.8, 1.5, 50, 1, 1, 0.4,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pbadan1 = new MyObj(pbadan1Data.vertices, pbadan1Data.faces, shader_vertex_source, shader_fragment_source, pbadan1Data.colors);
    pbadan1.setup();        
    //==============================================================================================
    
    //badan
    var badanzData = quadric.Tabung(0, 0, -3.6, 1.40, 2.3, 50, 1, 1, 1, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var badanz = new MyObj(badanzData.vertices, badanzData.faces, shader_vertex_source, shader_fragment_source, badanzData.colors);
    badanz.setup();        
    //==============================================================================================
    
    //sendi
    //KANAN
    var sendikananData = quadric.Ellipsoid(1.7, 0, -2.6, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikanan = new MyObj(sendikananData.vertices, sendikananData.faces, shader_vertex_source, shader_fragment_source, sendikananData.colors);
    sendikanan.setup();   

    //LVL2
    var sendikanan2Data = quadric.Ellipsoid(1.7, 0, -4.2, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikanan2 = new MyObj(sendikanan2Data.vertices, sendikanan2Data.faces, shader_vertex_source, shader_fragment_source, sendikanan2Data.colors);
    sendikanan2.setup();   

    //KANAN BAWAH
    var sendikananbawahData = quadric.Ellipsoid(1.2, 0, -5.4, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikananbawah = new MyObj(sendikananbawahData.vertices, sendikananbawahData.faces, shader_vertex_source, shader_fragment_source, sendikananbawahData.colors);
    sendikananbawah.setup();   

    //LVL2
    var sendikananbawah2Data = quadric.Ellipsoid(1.2, 0, -7, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikananbawah2 = new MyObj(sendikananbawah2Data.vertices, sendikananbawah2Data.faces, shader_vertex_source, shader_fragment_source, sendikananbawah2Data.colors);
    sendikananbawah2.setup();   

    //KIRI
    var sendikiriData = quadric.Ellipsoid(-1.7, 0, -2.6, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiri = new MyObj(sendikiriData.vertices, sendikiriData.faces, shader_vertex_source, shader_fragment_source, sendikiriData.colors);
    sendikiri.setup();   

    //LVL2
    var sendikiri2Data = quadric.Ellipsoid(-1.7, 0, -4.2, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiri2 = new MyObj(sendikiri2Data.vertices, sendikiri2Data.faces, shader_vertex_source, shader_fragment_source, sendikiri2Data.colors);
    sendikiri2.setup();   

    //KIRI BAWAH
    var sendikiribawahData = quadric.Ellipsoid(-1.2, 0, -5.4, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiribawah = new MyObj(sendikiribawahData.vertices, sendikiribawahData.faces, shader_vertex_source, shader_fragment_source, sendikiribawahData.colors);
    sendikiribawah.setup();   

    //LVL 2
    var sendikiribawah2Data = quadric.Ellipsoid(-1.2, 0, -7, 2, 50, 0.2, 0.2, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiribawah2 = new MyObj(sendikiribawah2Data.vertices, sendikiribawah2Data.faces, shader_vertex_source, shader_fragment_source, sendikiribawah2Data.colors);
    sendikiribawah2.setup();   
    //==============================================================================================

    //TABUNG TANGAN DAN KAKI LVL 1
    //==============================================================================================
    //TANGANkanan
    var tangankananData = quadric.Tabung(1.7, 0, -3.35, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankanan = new MyObj(tangankananData.vertices, tangankananData.faces, shader_vertex_source, shader_fragment_source, tangankananData.colors);
    tangankanan.setup();   

    //TANGANkiri
    var tangankiriData = quadric.Tabung(-1.7, 0, -3.35, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankiri = new MyObj(tangankiriData.vertices, tangankiriData.faces, shader_vertex_source, shader_fragment_source, tangankiriData.colors);
    tangankiri.setup();   

    //kaki kanan
    var kakikananData = quadric.Tabung(1.2, 0, -6.2, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikanan = new MyObj(kakikananData.vertices, kakikananData.faces, shader_vertex_source, shader_fragment_source, kakikananData.colors);
    kakikanan.setup();   

    //kaki kiri
    var kakikiriData = quadric.Tabung(-1.2, 0, -6.2, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikiri = new MyObj(kakikiriData.vertices, kakikiriData.faces, shader_vertex_source, shader_fragment_source, kakikiriData.colors);
    kakikiri.setup();   

    //lvl2
    //TANGANkanan
    var tangankanan2Data = quadric.Tabung(1.7, 0, -5.1, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankanan2 = new MyObj(tangankanan2Data.vertices, tangankanan2Data.faces, shader_vertex_source, shader_fragment_source, tangankanan2Data.colors);
    tangankanan2.setup();   

    //TANGANkiri
    var tangankiri2Data = quadric.Tabung(-1.7, 0, -5.1, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankiri2 = new MyObj(tangankiri2Data.vertices, tangankiri2Data.faces, shader_vertex_source, shader_fragment_source, tangankiri2Data.colors);
    tangankiri2.setup();  

    //kaki kanan
    var kakikanan2Data = quadric.Tabung(1.2, 0, -7.8, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikanan2 = new MyObj(kakikanan2Data.vertices, kakikanan2Data.faces, shader_vertex_source, shader_fragment_source, kakikanan2Data.colors);
    kakikanan2.setup();  

    //kaki kiri
    var kakikiri2Data = quadric.Tabung(-1.2, 0, -7.8, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0,hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikiri2 = new MyObj(kakikiri2Data.vertices, kakikiri2Data.faces, shader_vertex_source, shader_fragment_source, kakikiri2Data.colors);
    kakikiri2.setup();  
    //==========================================================================================

    //telapaktangan
    var telapakkananData = quadric.EllipticParaboloid(1.7, 0, -7, 5, 50, 0.05, 0.05, 0.1, 0, 0, 0,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkanan = new MyObj(telapakkananData.vertices, telapakkananData.faces, shader_vertex_source, shader_fragment_source, telapakkananData.colors);
    telapakkanan.setup();  

    var telapakkiriData = quadric.EllipticParaboloid(-1.7, 0, -7, 5, 50, 0.05, 0.05, 0.1, 0, 0, 0,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkiri = new MyObj(telapakkiriData.vertices, telapakkiriData.faces, shader_vertex_source, shader_fragment_source, telapakkiriData.colors);
    telapakkiri.setup();  

    //==========================================================================================
    //telapak sikil
    var telapakkakikananData = quadric.Ellipsoid(1.2, -0.4, -8.8, 2, 50, 0.3, 0.5, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkakikanan = new MyObj(telapakkakikananData.vertices, telapakkakikananData.faces, shader_vertex_source, shader_fragment_source, telapakkakikananData.colors);
    telapakkakikanan.setup();  

    var telapakkakikiriData = quadric.Ellipsoid(-1.2, -0.4, -8.8, 2, 50, 0.3, 0.5, 0.2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkakikiri = new MyObj(telapakkakikiriData.vertices, telapakkakikiriData.faces, shader_vertex_source, shader_fragment_source, telapakkakikiriData.colors);
    telapakkakikiri.setup();  

    //==========================================================================================
    // Bagian Mulut
    var lambeData = quadric.Curves(
        [
            [-0.25, 0, -0.1],
            [-0.12, 0, -0.3],
            [0.12, 0, -0.3],
            [0.1, 0, -0.1],
        ], // --> object
        -0.1, // --> x
        -1.2, // --> y
        0.1, // --> z
        100, // --> segment
        0, // --> rotasi x
        0, // --> rotasi y
        0, // --> rotasi z
        0.04, // --> ketebalan garis
        putih
    );
    var lambe = new MyObj(lambeData.vertices, lambeData.faces, shader_vertex_source, shader_fragment_source, lambeData.colors);
    lambe.setup();

    var lambe2Data = quadric.Curves(
        [
            [-0.1, 0, -0.1],
            [-0.12, 0, -0.3],
            [0.12, 0, -0.3],
            [0.25, 0, -0.1],
        ], // --> object
        0.1, // --> x
        -1.2, // --> y
        0.1, // --> z
        100, // --> segment
        0, // --> rotasi x
        0, // --> rotasi y
        0, // --> rotasi z
        0.04, // --> ketebalan garis
        putih
    );
    var lambe2 = new MyObj(lambe2Data.vertices, lambe2Data.faces, shader_vertex_source, shader_fragment_source, lambe2Data.colors);
    lambe2.setup();
    //==========================================================================================

    //parent child
    head.child.push(anten1);
    head.child.push(anten2);
    head.child.push(anten3);
    head.child.push(lambe);
    head.child.push(lambe2);
    head.child.push(leher);

    anten1.child.push(mataTengah);
    anten2.child.push(mataKanan);
    anten3.child.push(mataKiri);
    anten1.child.push(kelopakMid);
    anten2.child.push(kelopakRight);
    anten3.child.push(kelopakLeft);

    mataTengah.child.push(pupilMid);
    mataKanan.child.push(pupilRight);
    mataKiri.child.push(pupilLeft);

    pupilMid.child.push(hiasanMid);
    pupilRight.child.push(hiasanRight);
    pupilLeft.child.push(hiasanLeft);


    badanz.child.push(head);
    badanz.child.push(pbadan);
    badanz.child.push(pbadan1);

    // badan.child.push(sendikanan);
    // badan.child.push(sendikiri);
    // badan.child.push(sendikananbawah);
    // badan.child.push(sendikiribawah);


    sendikanan.child.push(sendikanan2);
    sendikanan.child.push(tangankanan);
    sendikanan.child.push(tangankanan2);
    sendikanan.child.push(telapakkanan);

    sendikiri.child.push(sendikiri2);
    sendikiri.child.push(tangankiri);
    sendikiri.child.push(tangankiri2);
    sendikiri.child.push(telapakkiri);

    sendikananbawah.child.push(sendikananbawah2);
    sendikananbawah.child.push(kakikanan);
    sendikananbawah.child.push(kakikanan2);
    sendikananbawah.child.push(telapakkakikanan);

    sendikiribawah.child.push(sendikiribawah2);
    sendikiribawah.child.push(kakikiri);
    sendikiribawah.child.push(kakikiri2);
    sendikiribawah.child.push(telapakkakikiri);









    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();


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

    var depressoMovementSpeed = 0.05; // Movement speed for badan2
    var walkFront = true; // Initial movement direction for badan2
    var depressoPos = [0, -0.9, 0.5];
    var depressoFeet1Pos = [0.2, -1.4, 0.5];
    var depressoFeet2Pos = [-0.2, -1.4, 0.5];

    var walkAngle = 0; // Initial angle for walking animation
    var walkSpeed = 0.010; // Speed of the walking animation
    var maxWalkAngle = Math.PI / 20;

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
        }        //posisi awal
        if (walkFront == true) {
            depressoPos[2] += depressoMovementSpeed;
            if (depressoPos[2] >= 10) {
                walkFront = false;
            }
        }
        else {
            depressoPos[2] -= depressoMovementSpeed;
            if (depressoPos[2] <= -10) {
                walkFront = true;
            }
        }

        var MODEL_MATRIX = LIBS.get_I4();
        LIBS.translateZ(MODEL_MATRIX, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(MODEL_MATRIX, Math.PI);
        }

        // Logic for walking animation
        walkAngle += walkSpeed;
        if (walkAngle > maxWalkAngle) {
            walkSpeed = -walkSpeed; // Reverse direction if reaching the maximum angle
        } else if (walkAngle < -maxWalkAngle) {
            walkSpeed = -walkSpeed; // Reverse direction if reaching the minimum angle
        }

        // Rotate kaki1 and kaki2 alternately
        var kaki1Angle = walkAngle;
        var kaki2Angle = -walkAngle;

        var animasiKakiKanan = LIBS.get_I4();
        LIBS.rotateX(animasiKakiKanan, kaki1Angle);
        LIBS.translateZ(animasiKakiKanan, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiKakiKanan, Math.PI);
        }
        sendikananbawah.MODEL_MATRIX = animasiKakiKanan;
        sendikananbawah.render(sendikananbawah.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);


        var animasiKakiKiri = LIBS.get_I4();
        LIBS.rotateX(animasiKakiKiri, kaki2Angle);
        LIBS.translateZ(animasiKakiKiri, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiKakiKiri, Math.PI);
        }
        sendikiribawah.MODEL_MATRIX = animasiKakiKiri;
        sendikiribawah.render(sendikiribawah.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var animasiTanganKanan = LIBS.get_I4();
        LIBS.rotateX(animasiTanganKanan, kaki2Angle);
        LIBS.translateZ(animasiTanganKanan, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiTanganKanan, Math.PI);
        }
        sendikanan.MODEL_MATRIX = animasiTanganKanan;
        sendikanan.render(sendikanan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var animasiTanganKiri = LIBS.get_I4();
        LIBS.rotateX(animasiTanganKiri, kaki1Angle);
        LIBS.translateZ(animasiTanganKiri, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiTanganKiri, Math.PI);
        }
        sendikiri.MODEL_MATRIX = animasiTanganKiri;
        sendikiri.render(sendikiri.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        //seluruh
        badanz.MODEL_MATRIX = MODEL_MATRIX;
        badanz.render(badanz.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
    


















    GL.flush();

    window.requestAnimationFrame(animate);
};

animate(0);
}


window.addEventListener('load', main);