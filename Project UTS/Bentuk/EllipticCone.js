function generateSphere(x, y, z, radius, segments) {
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

            var xCoord = cosLon * v;
            var yCoord = sinLon * v;
            var zCoord = v;

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



    var tubeData = generateSphere(0, 0, 0.5, 0.8, 100); // Example sphere: x=0, y=0, z=0.5, radius=0.8, segments=100

    // Create buffers
    var TUBE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tubeData.vertices), GL.STATIC_DRAW);

    var TUBE_COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tubeData.colors), GL.STATIC_DRAW);

    var TUBE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tubeData.faces), GL.STATIC_DRAW);

    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEW_MATRIX, -5);


    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var time_prev = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        var dt = time - time_prev;
        time_prev = time;

        LIBS.rotateZ(MODEL_MATRIX, dt * LIBS.degToRad(0.1));
        LIBS.rotateX(MODEL_MATRIX, dt * LIBS.degToRad(0.1));
        LIBS.rotateY(MODEL_MATRIX, dt * LIBS.degToRad(0.1));

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, tubeData.faces.length, GL.UNSIGNED_SHORT, 0);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);