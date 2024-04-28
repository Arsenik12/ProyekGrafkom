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
    // var compile_shader = function (source, type, typeString) {
    //     var shader = GL.createShader(type);
    //     GL.shaderSource(shader, source);
    //     GL.compileShader(shader);
    //     if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
    //         alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
    //         return false;
    //     }
    //     return shader;
    // };

    //                                  Bagian Kepala
    // Pemancar: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rainbowColors
    var pemancarData = quadric.Ellipsoid(0, 0, 3.8, 0.2, 100, 0.6, 0.6, 0.6, [[190 / 255, 215 / 255, 84 / 255]]);
    var pemancar = new MyObj(pemancarData.vertices, pemancarData.faces, shader_vertex_source, shader_fragment_source, pemancarData.colors);
    pemancar.setup();


    // Antena: x, y, z, radius, height, segments, tabScaleX, tabScaleY, tabScaleZ, rotationX, rotationY, rotationZ, rainbowColors
    var antenaData = quadric.Tabung(0, 0, 3.5, 0.4, 2, 100, 0.2, 0.2, 0.25, 0, 0, 0, [[190 / 255, 215 / 255, 84 / 255]]);
    var antena = new MyObj(antenaData.vertices, antenaData.faces, shader_vertex_source, shader_fragment_source, antenaData.colors);
    antena.setup();

    // Kepala: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rainbowColors
    var kepalaData = quadric.Ellipsoid(0, 0, 2, 1.5, 100, 1.2, 1, 1, [[190 / 255, 215 / 255, 84 / 255]]);
    var kepala = new MyObj(kepalaData.vertices, kepalaData.faces, shader_vertex_source, shader_fragment_source, kepalaData.colors);
    kepala.setup();

    // Mata Tengah: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rainbowColors
    var mata_tengahData = quadric.Ellipsoid(0, -1.1, 2.5, 2, 100, 0.2, 0.19, 0.2, [[1.1, 1.1, 1.1]]);
    var mata_tengah = new MyObj(mata_tengahData.vertices, mata_tengahData.faces, shader_vertex_source, shader_fragment_source, mata_tengahData.colors);
    mata_tengah.setup();

    // Mata Kiri: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var mata_kiriData = quadric.Ellipsoid(-0.6, -1.1, 2.25, 2, 100, 0.2, 0.19, 0.2, [[1.1, 1.1, 1.1]]);
    var mata_kiri = new MyObj(mata_kiriData.vertices, mata_kiriData.faces, shader_vertex_source, shader_fragment_source, mata_kiriData.colors);
    mata_kiri.setup();

    // Mata Kanan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var mata_kananData = quadric.Ellipsoid(0.6, -1.1, 2.25, 2, 100, 0.2, 0.19, 0.2, [[1.1, 1.1, 1.1]]);
    var mata_kanan = new MyObj(mata_kananData.vertices, mata_kananData.faces, shader_vertex_source, shader_fragment_source, mata_kananData.colors);
    mata_kanan.setup();

    // Pupil Mata Hitam Tengah: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupil_hitam_tengahData = quadric.Ellipsoid(0, -1.4, 2.6, 0.8, 100, 0.17, 0.1, 0.2, [[0.0, 0.0, 0.0]]);
    var pupil_hitam_tengah = new MyObj(pupil_hitam_tengahData.vertices, pupil_hitam_tengahData.faces, shader_vertex_source, shader_fragment_source, pupil_hitam_tengahData.colors);
    pupil_hitam_tengah.setup();

    // Pupil Mata Hitam Kiri: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupil_hitam_kiriData = quadric.Ellipsoid(-0.62, -1.45, 2.3, 0.8, 100, 0.17, 0.1, 0.2, [[0.0, 0.0, 0.0]]);
    var pupil_hitam_kiri = new MyObj(pupil_hitam_kiriData.vertices, pupil_hitam_kiriData.faces, shader_vertex_source, shader_fragment_source, pupil_hitam_kiriData.colors);
    pupil_hitam_kiri.setup();

    // Pupil Mata Hitam Kanan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupil_hitam_kananData = quadric.Ellipsoid(0.62, -1.45, 2.3, 0.8, 100, 0.17, 0.1, 0.2, [[0.0, 0.0, 0.0]]);
    var pupil_hitam_kanan = new MyObj(pupil_hitam_kananData.vertices, pupil_hitam_kananData.faces, shader_vertex_source, shader_fragment_source, pupil_hitam_kananData.colors);
    pupil_hitam_kanan.setup();

    // Pupil Mata Putih Tengah: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupil_putih_tengahData = quadric.Ellipsoid(0.05, -1.45, 2.7, 0.2, 100, 0.17, 0.1, 0.2, [[1.1, 1.1, 1.1]]);
    var pupil_putih_tengah = new MyObj(pupil_putih_tengahData.vertices, pupil_putih_tengahData.faces, shader_vertex_source, shader_fragment_source, pupil_putih_tengahData.colors);
    pupil_putih_tengah.setup();

    // Pupil Mata Putih Kiri: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupil_putih_kiriData = quadric.Ellipsoid(-0.57, -1.5, 2.4, 0.2, 100, 0.17, 0.1, 0.2, [[1.1, 1.1, 1.1]]);
    var pupil_putih_kiri = new MyObj(pupil_putih_kiriData.vertices, pupil_putih_kiriData.faces, shader_vertex_source, shader_fragment_source, pupil_putih_kiriData.colors);
    pupil_putih_kiri.setup();

    // Pupil Mata Putih Kanan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pupil_putih_kananData = quadric.Ellipsoid(0.67, -1.5, 2.4, 0.2, 100, 0.17, 0.1, 0.2, [[1.1, 1.1, 1.1]]);
    var pupil_putih_kanan = new MyObj(pupil_putih_kananData.vertices, pupil_putih_kananData.faces, shader_vertex_source, shader_fragment_source, pupil_putih_kananData.colors);
    pupil_putih_kanan.setup();

    //                                      Bagian Badan
    // Leher: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var leherData = quadric.Ellipsoid(0, 0, 0.6, 2.6, 100, 0.6, 0.5, 0.1, [[171 / 255, 193 / 255, 76 / 255]]);
    var leher = new MyObj(leherData.vertices, leherData.faces, shader_vertex_source, shader_fragment_source, leherData.colors);
    leher.setup();

    // Badan tabung
    var badanData = quadric.Tabung(0, 0, -0.5, 1, 1, 100, 1.4, 1.15, 2, 0, 0, 0, [[190 / 255, 215 / 255, 84 / 255]]);
    var badan = new MyObj(badanData.vertices, badanData.faces, shader_vertex_source, shader_fragment_source, badanData.colors);
    badan.setup();

    // Badan Bawah: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var badan_bawahData = quadric.Ellipsoid(0, 0, -1.5, 1, 100, 1.4, 1.15, 0.5, [[190 / 255, 215 / 255, 84 / 255]]);
    var badan_bawah = new MyObj(badan_bawahData.vertices, badan_bawahData.faces, shader_vertex_source, shader_fragment_source, badan_bawahData.colors);
    badan_bawah.setup();


    //                                      Bagian Tangan
    // Engsel Tangan Kanan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var engsel_tangan_kananData = quadric.Ellipsoid(1.5, 0, -0.15, 0.95, 100, 0.325, 0.325, 0.3, [[1.1, 1.1, 1.1]]);
    var engsel_tangan_kanan = new MyObj(engsel_tangan_kananData.vertices, engsel_tangan_kananData.faces, shader_vertex_source, shader_fragment_source, engsel_tangan_kananData.colors);
    engsel_tangan_kanan.setup();

    // Engsel Tangan Kiri: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var engsel_tangan_kiriData = quadric.Ellipsoid(-1.5, 0, -0.15, 0.95, 100, 0.325, 0.325, 0.3, [[1.1, 1.1, 1.1]]);
    var engsel_tangan_kiri = new MyObj(engsel_tangan_kiriData.vertices, engsel_tangan_kiriData.faces, shader_vertex_source, shader_fragment_source, engsel_tangan_kiriData.colors);
    engsel_tangan_kiri.setup();

    // Lengan Kanan: x, y, z, radius, height, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var lengan_kananData = quadric.Tabung(2.35, 0, -0.16, 1, 2, 100, 0.325, 0.325, 1, 0, (Math.PI / 2), 0, [[190 / 255, 215 / 255, 84 / 255]]); // --> Rotasi y (Math.PI/2 radians) (90 derajat)
    var lengan_kanan = new MyObj(lengan_kananData.vertices, lengan_kananData.faces, shader_vertex_source, shader_fragment_source, lengan_kananData.colors);
    lengan_kanan.setup();

    // Lengan Kiri: x, y, z, radius, height, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var lengan_kiriData = quadric.Tabung(-2.35, 0, -0.16, 1, 2, 100, 0.325, 0.325, 1, 0, -(Math.PI / 2), 0, [[190 / 255, 215 / 255, 84 / 255]]); // --> Rotasi y -(Math.PI/2 radians) (-90 derajat)
    var lengan_kiri = new MyObj(lengan_kiriData.vertices, lengan_kiriData.faces, shader_vertex_source, shader_fragment_source, lengan_kiriData.colors);
    lengan_kiri.setup();

    // Tangan Kanan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var tangan_kananData = quadric.EllipticParaboloid(4, 0, -0.16, 2.5, 100, 0.1, 0.1, 0.12, 0, -(Math.PI / 2), 0, [[190 / 255, 215 / 255, 84 / 255]]); // --> Rotasi y -(Math.PI/2 radians) (-90 derajat)
    var tangan_kanan = new MyObj(tangan_kananData.vertices, tangan_kananData.faces, shader_vertex_source, shader_fragment_source, tangan_kananData.colors);
    tangan_kanan.setup();

    // Tangan Kiri: x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var tangan_kiriData = quadric.EllipticParaboloid(-4, 0, -0.16, 2.5, 100, 0.1, 0.1, 0.12, 0, (Math.PI / 2), 0, [[190 / 255, 215 / 255, 84 / 255]]); // --> Rotasi y (Math.PI/2 radians) (90 derajat)
    var tangan_kiri = new MyObj(tangan_kiriData.vertices, tangan_kiriData.faces, shader_vertex_source, shader_fragment_source, tangan_kiriData.colors);
    tangan_kiri.setup();

    // jari Kanan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    // radian= derajat*PI/180 --> rumus untuk rotate object  
    var jari_jempol_kananData = quadric.EllipticParaboloid(3.5, 0, 0.44, 1, 100, 0.1, 0.05, 0.12, 0, ((13 * Math.PI) / 12), 0, [[190 / 255, 215 / 255, 84 / 255]]); // Rotasi y -((13*Math.PI)/12) (-195 derajat)
    var jari_jempol_kanan = new MyObj(jari_jempol_kananData.vertices, jari_jempol_kananData.faces, shader_vertex_source, shader_fragment_source, jari_jempol_kananData.colors);
    jari_jempol_kanan.setup();

    // jari Kiri: x, y, z, radius, segment, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var jari_jempol_kiriData = quadric.EllipticParaboloid(-3.5, 0, 0.44, 1, 100, 0.1, 0.05, 0.12, 0, -((13 * Math.PI) / 12), 0, [[190 / 255, 215 / 255, 84 / 255]]); // Rotasi y ((13*Math.PI)/12) (195 derajat)
    var jari_jempol_kiri = new MyObj(jari_jempol_kiriData.vertices, jari_jempol_kiriData.faces, shader_vertex_source, shader_fragment_source, jari_jempol_kiriData.colors);
    jari_jempol_kiri.setup();


    //                                          Bagian Kaki
    // Engsel Kaki Kanan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var engsel_kaki_kananData = quadric.Ellipsoid(0.8, 0, -2, 1.5, 100, 0.325, 0.325, 0.3, [[1.1, 1.1, 1.1]]);
    var engsel_kaki_kanan = new MyObj(engsel_kaki_kananData.vertices, engsel_kaki_kananData.faces, shader_vertex_source, shader_fragment_source, engsel_kaki_kananData.colors);
    engsel_kaki_kanan.setup();

    // Engsel Kaki Kiri: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var engsel_kaki_kiriData = quadric.Ellipsoid(-0.8, 0, -2, 1.5, 100, 0.325, 0.325, 0.3, [[1.1, 1.1, 1.1]]);
    var engsel_kaki_kiri = new MyObj(engsel_kaki_kiriData.vertices, engsel_kaki_kiriData.faces, shader_vertex_source, shader_fragment_source, engsel_kaki_kiriData.colors);
    engsel_kaki_kiri.setup();

    // Kaki Kanan: x, y, z, radius, height, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var kaki_kananData = quadric.Tabung(0.8, 0, -2.46, 0.5, 1.5, 100, 1, 1, 1, 0, 0, 0, [[190 / 255, 215 / 255, 84 / 255]]);
    var kaki_kanan = new MyObj(kaki_kananData.vertices, kaki_kananData.faces, shader_vertex_source, shader_fragment_source, kaki_kananData.colors);
    kaki_kanan.setup();

    // Kaki Kiri: x, y, z, radius, height, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ
    var kaki_kiriData = quadric.Tabung(-0.8, 0, -2.46, 0.5, 1.5, 100, 1, 1, 1, 0, 0, 0, [[190 / 255, 215 / 255, 84 / 255]]);
    var kaki_kiri = new MyObj(kaki_kiriData.vertices, kaki_kiriData.faces, shader_vertex_source, shader_fragment_source, kaki_kiriData.colors);
    kaki_kiri.setup();

    // Telapak Kaki Kanan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapak_kaki_kananData = quadric.Ellipsoid(0.8, -0.3, -3.4, 0.5, 100, 1.2, 1.8, 0.8, [[190 / 255, 215 / 255, 84 / 255]]);
    var telapak_kaki_kanan = new MyObj(telapak_kaki_kananData.vertices, telapak_kaki_kananData.faces, shader_vertex_source, shader_fragment_source, telapak_kaki_kananData.colors);
    telapak_kaki_kanan.setup();

    // Telapak Kaki Kiri: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapak_kaki_kiriData = quadric.Ellipsoid(-0.8, -0.3, -3.4, 0.5, 100, 1.2, 1.8, 0.8, [[190 / 255, 215 / 255, 84 / 255]]);
    var telapak_kaki_kiri = new MyObj(telapak_kaki_kiriData.vertices, telapak_kaki_kiriData.faces, shader_vertex_source, shader_fragment_source, telapak_kaki_kiriData.colors);
    telapak_kaki_kiri.setup();

    // Bagian Mulut
    var mulutData = quadric.Curves(
        [
            [-0.15, 0, -0.1],
            [-0.12, 0, -0.3],
            [0.12, 0, -0.3],
            [0.15, 0, -0.1],
        ], // --> object
        0, // --> x
        -1.5, // --> y
        2, // --> z
        100, // --> segment
        0, // --> rotasi x
        0, // --> rotasi y
        0, // --> rotasi z
        0.04, // --> ketebalan garis
        [[0.0, 0.0, 0.0]] // --> warna
    );
    var mulut = new MyObj(mulutData.vertices, mulutData.faces, shader_vertex_source, shader_fragment_source, mulutData.colors);
    mulut.setup();

    // Child Push 
    kepala.child.push(pemancar);
    kepala.child.push(antena);
    kepala.child.push(mata_tengah);
    kepala.child.push(mata_kanan);
    kepala.child.push(mata_kiri);
    mata_tengah.child.push(pupil_hitam_tengah);
    mata_tengah.child.push(pupil_putih_tengah);
    mata_kanan.child.push(pupil_hitam_kanan);
    mata_kanan.child.push(pupil_putih_kanan);
    mata_kiri.child.push(pupil_hitam_kiri);
    mata_kiri.child.push(pupil_putih_kiri);
    lengan_kanan.child.push(tangan_kanan);
    lengan_kanan.child.push(jari_jempol_kanan);
    lengan_kiri.child.push(tangan_kiri);
    lengan_kiri.child.push(jari_jempol_kiri);
    kaki_kanan.child.push(telapak_kaki_kanan);
    kaki_kiri.child.push(telapak_kaki_kiri);
    engsel_tangan_kanan.child.push(lengan_kanan)
    engsel_tangan_kiri.child.push(lengan_kiri)
    engsel_kaki_kanan.child.push(kaki_kanan);
    engsel_kaki_kiri.child.push(kaki_kiri);
    badan.child.push(leher)
    badan.child.push(kepala);
    badan.child.push(mulut);
    badan.child.push(badan_bawah);
    badan.child.push(engsel_tangan_kanan);
    badan.child.push(engsel_tangan_kiri);
    badan.child.push(engsel_kaki_kanan);
    badan.child.push(engsel_kaki_kiri);

    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX2 = LIBS.get_I4();
    var MODEL_MATRIX3 = LIBS.get_I4();
    var MODEL_MATRIX4 = LIBS.get_I4();

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
    LIBS.translateZ(VIEW_MATRIX, -9);
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
        if (keyCode === 83) { // S key
            keysPressed.w = true;
        } else if (keyCode === 68) { // D key
            keysPressed.a = true;
        } else if (keyCode === 87) { // W key
            keysPressed.s = true;
        } else if (keyCode === 65) { // A key
            keysPressed.d = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        var keyCode = event.keyCode;
        if (keyCode === 83) { // S key
            keysPressed.w = false;
        } else if (keyCode === 68) { // D key
            keysPressed.a = false;
        } else if (keyCode === 87) { // W key
            keysPressed.s = false;
        } else if (keyCode === 65) { // A key
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
        }
        //posisi awal
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

        MODEL_MATRIX = LIBS.get_I4();
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

        var MODEL_MATRIX;

        // Apply rotations to kaki1 and kaki2
        MODEL_MATRIX2 = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX2, kaki1Angle);
        LIBS.translateZ(MODEL_MATRIX2, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(MODEL_MATRIX2, Math.PI);
        }
        kaki_kanan.MODEL_MATRIX = MODEL_MATRIX2;
        // alas1.MODEL_MATRIX = MODEL_MATRIX2;
        kaki_kanan.render(kaki_kanan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);


        MODEL_MATRIX3 = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX3, kaki2Angle);
        LIBS.translateZ(MODEL_MATRIX3, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(MODEL_MATRIX3, Math.PI);
        }
        // alas2.MODEL_MATRIX = MODEL_MATRIX3;
        kaki_kiri.MODEL_MATRIX = MODEL_MATRIX3;
        kaki_kiri.render(kaki_kiri.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);


        badan.MODEL_MATRIX = MODEL_MATRIX;
        badan.render(badan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);