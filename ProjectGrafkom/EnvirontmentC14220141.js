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

    var gay = [
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


    //tanduk
    var tandukData = quadric.EllipticCone(0, 0, 5.6, 1, 50, 0.2, 0.2, 0.8, 0, Math.PI, 0, putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tanduk = new MyObj(tandukData.vertices, tandukData.faces, shader_vertex_source, shader_fragment_source, tandukData.colors);
    tanduk.setup();    
    //==============================================================================================

    //head
    var palapesawatData = quadric.Ellipsoid(0, 0, 4.2, 1.2, 50, 0.5, 0.5, 0.8,grey); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var palapesawat = new MyObj(palapesawatData.vertices, palapesawatData.faces, shader_vertex_source, shader_fragment_source, palapesawatData.colors);
    palapesawat.setup();    

    //kaca
    var glassData = quadric.Ellipsoid(0, 0.4, 4.2, 1.2, 50, 0.4, 0.2, 0.4,blue); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var glass = new MyObj(glassData.vertices, glassData.faces, shader_vertex_source, shader_fragment_source, glassData.colors);
    glass.setup(); 

    //badan
    var badanpesawatData = quadric.Ellipsoid(0, 0, 0, 1.2, 50, 1.2, 1, 2.5,grey); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var badanpesawat = new MyObj(badanpesawatData.vertices, badanpesawatData.faces, shader_vertex_source, shader_fragment_source, badanpesawatData.colors);
    badanpesawat.setup(); 

    //pipa
    var pipeData = quadric.Tabung(0, 0, 3.2, 3, 10, 50, 0.05, 0.05, 0.05, 0, 0, 0,grey); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var pipe = new MyObj(pipeData.vertices, pipeData.faces, shader_vertex_source, shader_fragment_source, pipeData.colors);
    pipe.setup(); 

    //kenalpot
    var kenData = quadric.Ellipsoid(1.5, 0, -3, 1, 50, 0.8, 0.8, 2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken = new MyObj(kenData.vertices, kenData.faces, shader_vertex_source, shader_fragment_source, kenData.colors);
    ken.setup(); 

    var ken2Data = quadric.Ellipsoid(-1.5, 0, -3, 1, 50, 0.8, 0.8, 2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken2 = new MyObj(ken2Data.vertices, ken2Data.faces, shader_vertex_source, shader_fragment_source, ken2Data.colors);
    ken2.setup(); 

    var ken3Data = quadric.Ellipsoid(0, 1.5, -3, 1, 50, 0.8, 0.8, 2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ken3 = new MyObj(ken3Data.vertices, ken3Data.faces, shader_vertex_source, shader_fragment_source, ken3Data.colors);
    ken3.setup(); 

    var ken4Data = quadric.Ellipsoid(0, -1.5, -3, 1, 50, 0.8, 0.8, 2,putih); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
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









    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
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
        }

    //draw

    var MODEL_MATRIX = LIBS.get_I4();
    badanpesawat.MODEL_MATRIX = MODEL_MATRIX;
    badanpesawat.render(badanpesawat.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);










    GL.flush();

    window.requestAnimationFrame(animate);
};

animate(0);
}


window.addEventListener('load', main);