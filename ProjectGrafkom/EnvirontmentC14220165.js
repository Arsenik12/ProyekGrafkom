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
        }

        //render
        // ENVIRONMENT
        piring.render(piring.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        LIBS.setPosition(neptunus.MODEL_MATRIX, 40, 20, 20);
        neptunus.render(neptunus.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        LIBS.setPosition(uranus.MODEL_MATRIX, 0, 20, 30);
        uranus.render(uranus.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        LIBS.setPosition(mars.MODEL_MATRIX, -40, 20, 20);
        mars.render(mars.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);