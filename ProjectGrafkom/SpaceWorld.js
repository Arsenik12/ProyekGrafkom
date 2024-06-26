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
    textureCoords = [];

    SHADER_PROGRAM = null;
    _color = null;
    _position = null;
    _textureCoord = null;
    _MMatrix = LIBS.get_I4();
    _PMatrix = LIBS.get_I4();
    _VMatrix = LIBS.get_I4();
    _greyScality = 0;

    TRIANGLE_VERTEX = null;
    TRIANGLE_FACES = null;
    TRIANGLE_COLORS = null;
    TRIANGLE_TEXTURECOORDS = null;
    // _textureCoord = null;
    // _texture = null;

    MODEL_MATRIX = LIBS.get_I4();
    child = [];

    constructor(vertex, faces, source_shader_vertex, source_shader_fragment, colors) {
        this.vertex = vertex;
        this.faces = faces;
        this.colors = colors;
        // this.image = image;

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
        // this._texureCoord = GL.getAttribLocation(this.SHADER_PROGRAM, "textureCoord");
        // this._texture = GL.getUniformLocation(this.SHADER_PROGRAM, "texture");
        this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");
        this._PMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "PMatrix"); //projection
        this._VMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "VMatrix"); //View
        this._MMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "MMatrix"); //Model
        this._greyScality = GL.getUniformLocation(this.SHADER_PROGRAM, "greyScality");//GreyScality

        // Enable attribute arrays
        GL.enableVertexAttribArray(this._color);
        GL.enableVertexAttribArray(this._position);
        // GL.enableVertexAttribArray(this._texureCoord);
        GL.useProgram(this.SHADER_PROGRAM);

        // Create buffers
        this.TRIANGLE_VERTEX = GL.createBuffer();
        this.TRIANGLE_FACES = GL.createBuffer();
        this.TRIANGLE_COLORS = GL.createBuffer();
        // this.TRIANGLE_TEXTURECOORDS = GL.createBuffer();

        // // Load texture
        // this.image = new Image();
        // this.image.src = image;
        // this.image.onload = () => this.setupTexture();
    }

    // setupTexture() {
    //     GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_TEXTURE_COORDS);
    //     GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.textureCoords), GL.STATIC_DRAW);
    //     GL.bindTexture(GL.TEXTURE_2D, this._texture);
    //     GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this.image);
    //     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    //     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
    //     GL.generateMipmap(GL.TEXTURE_2D);
    //     GL.bindTexture(GL.TEXTURE_2D, null);
    // }

    setup() {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_COLORS); // Use the color buffer
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.colors), GL.STATIC_DRAW); // Update with rainbow colors

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW);


        // GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_TEXTURECOORDS);
        // GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.textureCoords), GL.STATIC_DRAW);

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

        // GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_TEXTURECOORDS);
        // GL.vertexAttribPointer(this._textureCoord, 2, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);

        GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(this._MMatrix, false, model_matrix); // Use the provided model_matrix
        GL.uniform1f(this._greyScality, 1);

        // GL.activeTexture(GL.TEXTURE0);
        // GL.bindTexture(GL.TEXTURE_2D, this._texture);
        // GL.uniform1i(GL.getUniformLocation(this.SHADER_PROGRAM, "uSampler"), 0);

        GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

        GL.flush();
        this.child.forEach(obj => {
            obj.render(model_matrix, VIEW_MATRIX, PROJECTION_MATRIX); // Pass model_matrix to child objects
        });
    }

    // loadTexture(imageSrc) {
    //     var texture = GL.createTexture();
    //     var image = new Image();
    //     image.onload = function () {
    //         GL.bindTexture(GL.TEXTURE_2D, texture);
    //         GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
    //         GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    //         GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    //         GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    //         GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    //         GL.bindTexture(GL.TEXTURE_2D, null);
    //     };
    //     image.src = imageSrc;
    //     return texture;
    // }
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

    var grey = [
        [0.6, 0.6, 0.7]
    ];

    var blue = [
        [0.0, 0.0, 1.0]
    ];

    //ENVIRONMENT
    // Pesawat UFO
    var piringData = quadric.Ellipsoid(0, 0, 0, 10, 100, 1, 1, 0.2, [[71 / 255, 78 / 255, 104 / 255]]);
    var piring = new MyObj(piringData.vertices, piringData.faces, shader_vertex_source, shader_fragment_source, piringData.colors);
    piring.setup();

    var bulatData = quadric.Ellipsoid(0, 0, 2, 5, 100, 0.9, 0.9, 0.5, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulat = new MyObj(bulatData.vertices, bulatData.faces, shader_vertex_source, shader_fragment_source, bulatData.colors);
    bulat.setup();

    var bulatKecil1Data = quadric.Ellipsoid(3.5, -8.5, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil1 = new MyObj(bulatKecil1Data.vertices, bulatKecil1Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil1Data.colors);
    bulatKecil1.setup();

    var bulatKecil2Data = quadric.Ellipsoid(-3.5, -8.5, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil2 = new MyObj(bulatKecil2Data.vertices, bulatKecil2Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil2Data.colors);
    bulatKecil2.setup();

    var bulatKecil3Data = quadric.Ellipsoid(3.5, 8.5, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil3 = new MyObj(bulatKecil3Data.vertices, bulatKecil3Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil3Data.colors);
    bulatKecil3.setup();

    var bulatKecil4Data = quadric.Ellipsoid(-3.5, 8.5, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil4 = new MyObj(bulatKecil4Data.vertices, bulatKecil4Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil4Data.colors);
    bulatKecil4.setup();

    var bulatKecil5Data = quadric.Ellipsoid(8.5, -4, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil5 = new MyObj(bulatKecil5Data.vertices, bulatKecil5Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil5Data.colors);
    bulatKecil5.setup();

    var bulatKecil6Data = quadric.Ellipsoid(-8.5, -4, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil6 = new MyObj(bulatKecil6Data.vertices, bulatKecil6Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil6Data.colors);
    bulatKecil6.setup();

    var bulatKecil7Data = quadric.Ellipsoid(8.5, 4, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil7 = new MyObj(bulatKecil7Data.vertices, bulatKecil7Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil7Data.colors);
    bulatKecil7.setup();

    var bulatKecil8Data = quadric.Ellipsoid(-8.5, 4, 0.8, 0.5, 100, 0.6, 0.6, 0.8, [[175 / 255, 209 / 255, 152 / 255]]);
    var bulatKecil8 = new MyObj(bulatKecil8Data.vertices, bulatKecil8Data.faces, shader_vertex_source, shader_fragment_source, bulatKecil8Data.colors);
    bulatKecil8.setup();

    //CHILD PUSH
    piring.child.push(bulat);
    piring.child.push(bulatKecil1);
    piring.child.push(bulatKecil2);
    piring.child.push(bulatKecil3);
    piring.child.push(bulatKecil4);
    piring.child.push(bulatKecil5);
    piring.child.push(bulatKecil6);
    piring.child.push(bulatKecil7);
    piring.child.push(bulatKecil8);

    //Roket
    //tanduk
    var tandukData = quadric.EllipticCone(0, 0, 5.6, 1, 50, 0.2, 0.2, 0.8, 0, Math.PI, 0, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tanduk = new MyObj(tandukData.vertices, tandukData.faces, shader_vertex_source, shader_fragment_source, tandukData.colors);
    tanduk.setup();
    //==============================================================================================

    //head
    var palapesawatData = quadric.Ellipsoid(0, 0, 4.2, 1.2, 50, 0.5, 0.5, 0.8, grey); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var palapesawat = new MyObj(palapesawatData.vertices, palapesawatData.faces, shader_vertex_source, shader_fragment_source, palapesawatData.colors);
    palapesawat.setup();

    //kaca
    var glassData = quadric.Ellipsoid(0, 0.4, 4.2, 1.2, 50, 0.4, 0.2, 0.4, blue); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var glass = new MyObj(glassData.vertices, glassData.faces, shader_vertex_source, shader_fragment_source, glassData.colors);
    glass.setup();

    //badan
    var badanpesawatData = quadric.Ellipsoid(0, 0, 0, 1.2, 50, 1.2, 1, 2.5, grey); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var badanpesawat = new MyObj(badanpesawatData.vertices, badanpesawatData.faces, shader_vertex_source, shader_fragment_source, badanpesawatData.colors);
    badanpesawat.setup();

    //pipa
    var pipeData = quadric.Tabung(0, 0, 3.2, 3, 10, 50, 0.05, 0.05, 0.05, 0, 0, 0, grey); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pipe = new MyObj(pipeData.vertices, pipeData.faces, shader_vertex_source, shader_fragment_source, pipeData.colors);
    pipe.setup();

    //kenalpot
    var kenData = quadric.Ellipsoid(1.5, 0, -3, 1, 50, 0.8, 0.8, 2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken = new MyObj(kenData.vertices, kenData.faces, shader_vertex_source, shader_fragment_source, kenData.colors);
    ken.setup();

    var ken2Data = quadric.Ellipsoid(-1.5, 0, -3, 1, 50, 0.8, 0.8, 2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken2 = new MyObj(ken2Data.vertices, ken2Data.faces, shader_vertex_source, shader_fragment_source, ken2Data.colors);
    ken2.setup();

    var ken3Data = quadric.Ellipsoid(0, 1.5, -3, 1, 50, 0.8, 0.8, 2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken3 = new MyObj(ken3Data.vertices, ken3Data.faces, shader_vertex_source, shader_fragment_source, ken3Data.colors);
    ken3.setup();

    var ken4Data = quadric.Ellipsoid(0, -1.5, -3, 1, 50, 0.8, 0.8, 2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken4 = new MyObj(ken4Data.vertices, ken4Data.faces, shader_vertex_source, shader_fragment_source, ken4Data.colors);
    ken4.setup();

    //parent child

    palapesawat.child.push(tanduk);
    palapesawat.child.push(glass);

    pipe.child.push(palapesawat);

    badanpesawat.child.push(pipe);
    badanpesawat.child.push(ken);
    badanpesawat.child.push(ken2);
    badanpesawat.child.push(ken3);
    badanpesawat.child.push(ken4);



    // Planet

    // // Bulan 
    // var bulanData = quadric.Ellipsoid(0, 0, 0.5, 0.8, 100, 0, 0, 0, 0);
    // var bulan = new MyObj(bulanData.vertices, bulanData.faces, shader_vertex_source, shader_fragment_source, bulanData.colors);
    // bulan.setupTexture();
    // bulan.setup();

    // Mars 
    var marsData = quadric.Ellipsoid(0, 0, 0.5, 10, 100, 0.6, 0.6, 0.5, [[212 / 255, 87 / 255, 57 / 255]]);
    var mars = new MyObj(marsData.vertices, marsData.faces, shader_vertex_source, shader_fragment_source, marsData.colors);
    mars.setup();

    // Neptunus 
    var neptunusData = quadric.Ellipsoid(0, 0, 0.5, 10, 100, 0.6, 0.6, 0.5, [[64 / 255, 102 / 255, 255 / 255]]);
    var neptunus = new MyObj(neptunusData.vertices, neptunusData.faces, shader_vertex_source, shader_fragment_source, neptunusData.colors);
    neptunus.setup();

    // Uranus
    var uranusData = quadric.Ellipsoid(0, 0, 0.5, 10, 100, 0.6, 0.6, 0.5, [[159 / 255, 209 / 255, 227 / 255]]);
    var uranus = new MyObj(uranusData.vertices, neptunusData.faces, shader_vertex_source, shader_fragment_source, neptunusData.colors);
    uranus.setup();


    //OBJECT CHARACTER 1
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

    // Mulut
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


    //CHILD PUSH
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
    // badan.child.push(engsel_kaki_kanan);
    // badan.child.push(engsel_kaki_kiri);

    //OBJECT2 CHARACTER 2
    //Kepala
    //==============================================================================================
    var headData = quadric.Ellipsoid(0, 0, 0, 1.2, 50, 1.5, 1, 1, hijaumuda);
    var head = new MyObj(headData.vertices, headData.faces, shader_vertex_source, shader_fragment_source, headData.colors);
    head.setup();
    //==============================================================================================

    // Create buffers eye
    //==============================================================================================
    var mataTengahData = quadric.Ellipsoid(0, 0, 2.2, 2, 50, 0.2, 0.2, 0.2, putih);
    var mataTengah = new MyObj(mataTengahData.vertices, mataTengahData.faces, shader_vertex_source, shader_fragment_source, mataTengahData.colors);
    mataTengah.setup();

    var mataKananData = quadric.Ellipsoid(1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var mataKanan = new MyObj(mataKananData.vertices, mataKananData.faces, shader_vertex_source, shader_fragment_source, mataKananData.colors);
    mataKanan.setup();

    var mataKiriData = quadric.Ellipsoid(-1.2, 0, 1.9, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
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
    var anten1Data = quadric.Tabung(0, 0, 1.5, 2, 14, 50, 0.05, 0.05, 0.05, 0, Math.PI, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var anten1 = new MyObj(anten1Data.vertices, anten1Data.faces, shader_vertex_source, shader_fragment_source, anten1Data.colors);
    anten1.setup();

    var anten2Data = quadric.Tabung(0.9, 0, 1.3, 2, 14, 50, 0.05, 0.05, 0.05, 0, -Math.PI / 7, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var anten2 = new MyObj(anten2Data.vertices, anten2Data.faces, shader_vertex_source, shader_fragment_source, anten2Data.colors);
    anten2.setup();

    var anten3Data = quadric.Tabung(-0.9, 0, 1.3, 2, 14, 50, 0.05, 0.05, 0.05, 0, Math.PI / 7, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var anten3 = new MyObj(anten3Data.vertices, anten3Data.faces, shader_vertex_source, shader_fragment_source, anten3Data.colors);
    anten3.setup();
    //==============================================================================================

    //leher
    var leherData = quadric.Tabung(0, 0, -1.5, 5.6, 15, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var leher = new MyObj(leherData.vertices, leherData.faces, shader_vertex_source, shader_fragment_source, leherData.colors);
    leher.setup();
    //==============================================================================================

    //Pelengkap badan
    var pbadanData = quadric.Ellipsoid(0, 0, -2.4, 1.5, 50, 1, 1, 0.4, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pbadan = new MyObj(pbadanData.vertices, pbadanData.faces, shader_vertex_source, shader_fragment_source, pbadanData.colors);
    pbadan.setup();

    var pbadan1Data = quadric.Ellipsoid(0, 0, -4.8, 1.5, 50, 1, 1, 0.4, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
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
    var sendikananData = quadric.Ellipsoid(1.7, 0, -2.6, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikanan = new MyObj(sendikananData.vertices, sendikananData.faces, shader_vertex_source, shader_fragment_source, sendikananData.colors);
    sendikanan.setup();

    //LVL2
    var sendikanan2Data = quadric.Ellipsoid(1.7, 0, -4.2, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikanan2 = new MyObj(sendikanan2Data.vertices, sendikanan2Data.faces, shader_vertex_source, shader_fragment_source, sendikanan2Data.colors);
    sendikanan2.setup();

    //KANAN BAWAH
    var sendikananbawahData = quadric.Ellipsoid(1.2, 0, -5.4, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikananbawah = new MyObj(sendikananbawahData.vertices, sendikananbawahData.faces, shader_vertex_source, shader_fragment_source, sendikananbawahData.colors);
    sendikananbawah.setup();

    //LVL2
    var sendikananbawah2Data = quadric.Ellipsoid(1.2, 0, -7, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikananbawah2 = new MyObj(sendikananbawah2Data.vertices, sendikananbawah2Data.faces, shader_vertex_source, shader_fragment_source, sendikananbawah2Data.colors);
    sendikananbawah2.setup();

    //KIRI
    var sendikiriData = quadric.Ellipsoid(-1.7, 0, -2.6, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiri = new MyObj(sendikiriData.vertices, sendikiriData.faces, shader_vertex_source, shader_fragment_source, sendikiriData.colors);
    sendikiri.setup();

    //LVL2
    var sendikiri2Data = quadric.Ellipsoid(-1.7, 0, -4.2, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiri2 = new MyObj(sendikiri2Data.vertices, sendikiri2Data.faces, shader_vertex_source, shader_fragment_source, sendikiri2Data.colors);
    sendikiri2.setup();

    //KIRI BAWAH
    var sendikiribawahData = quadric.Ellipsoid(-1.2, 0, -5.4, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiribawah = new MyObj(sendikiribawahData.vertices, sendikiribawahData.faces, shader_vertex_source, shader_fragment_source, sendikiribawahData.colors);
    sendikiribawah.setup();

    //LVL 2
    var sendikiribawah2Data = quadric.Ellipsoid(-1.2, 0, -7, 2, 50, 0.2, 0.2, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var sendikiribawah2 = new MyObj(sendikiribawah2Data.vertices, sendikiribawah2Data.faces, shader_vertex_source, shader_fragment_source, sendikiribawah2Data.colors);
    sendikiribawah2.setup();
    //==============================================================================================

    //TABUNG TANGAN DAN KAKI LVL 1
    //==============================================================================================
    //TANGANkanan
    var tangankananData = quadric.Tabung(1.7, 0, -3.35, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankanan = new MyObj(tangankananData.vertices, tangankananData.faces, shader_vertex_source, shader_fragment_source, tangankananData.colors);
    tangankanan.setup();

    //TANGANkiri
    var tangankiriData = quadric.Tabung(-1.7, 0, -3.35, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankiri = new MyObj(tangankiriData.vertices, tangankiriData.faces, shader_vertex_source, shader_fragment_source, tangankiriData.colors);
    tangankiri.setup();

    //kaki kanan
    var kakikananData = quadric.Tabung(1.2, 0, -6.2, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikanan = new MyObj(kakikananData.vertices, kakikananData.faces, shader_vertex_source, shader_fragment_source, kakikananData.colors);
    kakikanan.setup();

    //kaki kiri
    var kakikiriData = quadric.Tabung(-1.2, 0, -6.2, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikiri = new MyObj(kakikiriData.vertices, kakikiriData.faces, shader_vertex_source, shader_fragment_source, kakikiriData.colors);
    kakikiri.setup();

    //lvl2
    //TANGANkanan
    var tangankanan2Data = quadric.Tabung(1.7, 0, -5.1, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankanan2 = new MyObj(tangankanan2Data.vertices, tangankanan2Data.faces, shader_vertex_source, shader_fragment_source, tangankanan2Data.colors);
    tangankanan2.setup();

    //TANGANkiri
    var tangankiri2Data = quadric.Tabung(-1.7, 0, -5.1, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tangankiri2 = new MyObj(tangankiri2Data.vertices, tangankiri2Data.faces, shader_vertex_source, shader_fragment_source, tangankiri2Data.colors);
    tangankiri2.setup();

    //kaki kanan
    var kakikanan2Data = quadric.Tabung(1.2, 0, -7.8, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikanan2 = new MyObj(kakikanan2Data.vertices, kakikanan2Data.faces, shader_vertex_source, shader_fragment_source, kakikanan2Data.colors);
    kakikanan2.setup();

    //kaki kiri
    var kakikiri2Data = quadric.Tabung(-1.2, 0, -7.8, 7.5, 30, 50, 0.05, 0.05, 0.05, 0, 0, 0, hijaumuda); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kakikiri2 = new MyObj(kakikiri2Data.vertices, kakikiri2Data.faces, shader_vertex_source, shader_fragment_source, kakikiri2Data.colors);
    kakikiri2.setup();
    //==========================================================================================

    //telapaktangan
    var telapakkananData = quadric.EllipticParaboloid(1.7, 0, -7, 5, 50, 0.05, 0.05, 0.1, 0, 0, 0, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkanan = new MyObj(telapakkananData.vertices, telapakkananData.faces, shader_vertex_source, shader_fragment_source, telapakkananData.colors);
    telapakkanan.setup();

    var telapakkiriData = quadric.EllipticParaboloid(-1.7, 0, -7, 5, 50, 0.05, 0.05, 0.1, 0, 0, 0, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkiri = new MyObj(telapakkiriData.vertices, telapakkiriData.faces, shader_vertex_source, shader_fragment_source, telapakkiriData.colors);
    telapakkiri.setup();

    //==========================================================================================
    //telapak sikil
    var telapakkakikananData = quadric.Ellipsoid(1.2, -0.4, -8.8, 2, 50, 0.3, 0.5, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var telapakkakikanan = new MyObj(telapakkakikananData.vertices, telapakkakikananData.faces, shader_vertex_source, shader_fragment_source, telapakkakikananData.colors);
    telapakkakikanan.setup();

    var telapakkakikiriData = quadric.Ellipsoid(-1.2, -0.4, -8.8, 2, 50, 0.3, 0.5, 0.2, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
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
        putih // --> warna
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

  
    document.addEventListener('mousemove', function (event) {
        if (isMouseDown) {
            var sensitivity = 0.01; 
            var dx = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var dy = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            mouseX -= dx * sensitivity;
            mouseY -= dy * sensitivity;

            updateViewMatrix();
        }
    });
    document.addEventListener('mousedown', function (event) {
        isMouseDown = true;
        updateViewMatrix();
    });
    document.addEventListener('mouseup', function (event) {
        isMouseDown = false;
    });
    function updateViewMatrix() {
        var sensitivity = 0.001; 
        var dx = mouseX - prevMouseX;
        var dy = mouseY - prevMouseY;
        LIBS.rotateY(VIEW_MATRIX, -dx);
        LIBS.rotateX(VIEW_MATRIX, -dy);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
    }

    LIBS.translateZ(VIEW_MATRIX, -5);
    var zoomSpeed = 0.2; 
    document.addEventListener('wheel', function (event) {
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        LIBS.translateZ(VIEW_MATRIX, delta * zoomSpeed);
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

    var walkFront = true;
    var alienPos = [-1.9 * 0.4, -0.35 * 0.4, 0.5 * 0.4];
    var walkAngle = 0;
    var walkSpeed = 0.005;
    var maxWalkAngle = Math.PI / 32;

var scaleFactor = 1; // Faktor scaling awal
var scaleSpeed = 0.002; // Kecepatan animasi scaling
var maxScale = 2; // Batas maksimum faktor scaling
var minScale = 0.5; // Batas minimum faktor scaling


// Inisialisasi posisi awal dan tujuan pesawat
var initialPosition = [0, 0, 0]; // Posisi awal pesawat
var targetPosition = [50, 0, 50]; // Posisi tujuan pesawat
var planeDirection = 1; // Arah pergerakan pesawat (1 untuk maju, -1 untuk mundur)






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


        //render
        // ENVIRONMENT

        // LIBS.setPosition(badanpesawat.MODEL_MATRIX, 30, 0, 0);
        // badanpesawat.render(badanpesawat.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        piring.render(piring.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        LIBS.setPosition(neptunus.MODEL_MATRIX, 40, 20, 20);
        neptunus.render(neptunus.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        LIBS.setPosition(uranus.MODEL_MATRIX, 0, 20, 30);
        uranus.render(uranus.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        LIBS.setPosition(mars.MODEL_MATRIX, -40, 20, 20);
        mars.render(mars.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        //OBJECT CHARACTER1
        //posisi awal
        if (walkFront == true) {
            alienPos[2] += walkSpeed;
            if (alienPos[2] >= 1) {
                walkFront = false;
            }
        }
        else {
            alienPos[2] -= walkSpeed;
            if (alienPos[2] <= 0.65) {
                walkFront = true;
            }
        }

        // OBJECT CHARACTER1
        var badanAlien = LIBS.get_I4();
        LIBS.translateZ(badanAlien, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(badanAlien, Math.PI);
        }

        //walking 
        walkAngle += walkSpeed;
        if (walkAngle > maxWalkAngle || walkAngle < -maxWalkAngle) {
            walkSpeed = -walkSpeed;
        }
        // Rotate kaki1 and kaki2
        var kaki1Angle = walkAngle;
        var kaki2Angle = -walkAngle;

        var tangan1Angle = -walkAngle;
        var tangan2Angle = walkAngle;


        var kakiAlien1 = LIBS.get_I4();
        //rotations 
        LIBS.rotateX(kakiAlien1, kaki1Angle);
        LIBS.translateZ(kakiAlien1, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(kakiAlien1, Math.PI);
        }
        kaki_kanan.MODEL_MATRIX = kakiAlien1;
        LIBS.setPosition(kaki_kanan.MODEL_MATRIX, -6.5, 0, 5);
        kaki_kanan.render(kaki_kanan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var kakiAlien2 = LIBS.get_I4();
        LIBS.rotateX(kakiAlien2, kaki2Angle);
        LIBS.translateZ(kakiAlien2, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(kakiAlien2, Math.PI);
        }

        kaki_kiri.MODEL_MATRIX = kakiAlien2;
        LIBS.setPosition(kaki_kiri.MODEL_MATRIX, -6.5, 0, 5);
        kaki_kiri.render(kaki_kiri.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var tanganAlien1 = LIBS.get_I4();
        LIBS.rotateX(tanganAlien1, tangan1Angle);
        LIBS.translateZ(tanganAlien1, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateZ(tanganAlien1, Math.PI / 2);
        }

        lengan_kanan.MODEL_MATRIX = tanganAlien1;
        LIBS.setPosition(lengan_kanan.MODEL_MATRIX, -6.5, 0, 5);
        lengan_kanan.render(lengan_kanan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var tanganAlien2 = LIBS.get_I4();
        LIBS.rotateX(tanganAlien2, tangan2Angle);
        LIBS.translateZ(tanganAlien2, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateZ(tanganAlien2, Math.PI / 2);
        }

        lengan_kiri.MODEL_MATRIX = tanganAlien2;
        LIBS.setPosition(lengan_kiri.MODEL_MATRIX, -6.5, 0, 5);
        lengan_kiri.render(lengan_kiri.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);


        badan.MODEL_MATRIX = badanAlien;
        LIBS.setPosition(badan.MODEL_MATRIX, -6.5, 0, 5);
        badan.render(badan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);


        // OBJECT CHARACTER2
        var MODEL_MATRIX = LIBS.get_I4();
        LIBS.translateZ(MODEL_MATRIX, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(MODEL_MATRIX, Math.PI);
        }

        var animasiKakiKanan = LIBS.get_I4();
        LIBS.rotateX(animasiKakiKanan, kaki1Angle);
        LIBS.translateZ(animasiKakiKanan, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiKakiKanan, Math.PI);
        }
        sendikananbawah.MODEL_MATRIX = animasiKakiKanan;
        LIBS.setPosition(sendikananbawah.MODEL_MATRIX, 6.5, 0, 10.5);
        sendikananbawah.render(sendikananbawah.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var animasiKakiKiri = LIBS.get_I4();
        LIBS.rotateX(animasiKakiKiri, kaki2Angle);
        LIBS.translateZ(animasiKakiKiri, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiKakiKiri, Math.PI);
        }
        sendikiribawah.MODEL_MATRIX = animasiKakiKiri;
        LIBS.setPosition(sendikiribawah.MODEL_MATRIX, 6.5, 0, 10.5);
        sendikiribawah.render(sendikiribawah.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var animasiTanganKanan = LIBS.get_I4();
        LIBS.rotateX(animasiTanganKanan, kaki2Angle);
        LIBS.translateZ(animasiTanganKanan, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiTanganKanan, Math.PI);
        }
        sendikanan.MODEL_MATRIX = animasiTanganKanan;
        LIBS.setPosition(sendikanan.MODEL_MATRIX, 6.5, 0, 10.5);
        sendikanan.render(sendikanan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        var animasiTanganKiri = LIBS.get_I4();
        LIBS.rotateX(animasiTanganKiri, kaki1Angle);
        LIBS.translateZ(animasiTanganKiri, alienPos[2]);
        if (!walkFront) {
            LIBS.rotateY(animasiTanganKiri, Math.PI);
        }
        sendikiri.MODEL_MATRIX = animasiTanganKiri;
        LIBS.setPosition(sendikiri.MODEL_MATRIX, 6.5, 0, 10.5);
        sendikiri.render(sendikiri.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        //seluruh
        badanz.MODEL_MATRIX = MODEL_MATRIX;
        LIBS.setPosition(badanz.MODEL_MATRIX, 6.5, 0, 10.5);
        badanz.render(badanz.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);


scaleFactor += scaleSpeed;

if (scaleFactor >= maxScale || scaleFactor <= minScale) {
    scaleSpeed *= -1; 
}

var scaledModelMatrix = badanpesawat.MODEL_MATRIX.slice(); 
LIBS.scale(scaledModelMatrix, scaleFactor, scaleFactor, scaleFactor);


var speed = 0.1; 
var step = speed * planeDirection; 

LIBS.translateZ(badanpesawat.MODEL_MATRIX, step);

if (
    (planeDirection == 1 && badanpesawat.MODEL_MATRIX[14] >= targetPosition[0]) ||
    (planeDirection == -1 && badanpesawat.MODEL_MATRIX[14] <= initialPosition[0])
) {
    planeDirection *= -1; 
    LIBS.rotateY(badanpesawat.MODEL_MATRIX, Math.PI); 
}

badanpesawat.render(badanpesawat.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

LIBS.setPosition(scaledModelMatrix, 30, 0, 0); 

badanpesawat.render(scaledModelMatrix, VIEW_MATRIX, PROJECTION_MATRIX);




        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}

window.addEventListener('load', main);