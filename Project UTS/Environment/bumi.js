function generateSphere(x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var textureCoords = [];

    var angleIncrement = (2 * Math.PI) / segments;

    var rainbowColors = [
        [1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0]
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);

        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);

            var xCoord = cosLon * cosLat;
            var yCoord = sinLon * cosLat;
            var zCoord = sinLat;

            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);

            var u = 1 - (j / segments);
            var v = 1 - (i / segments);
            textureCoords.push(u, v);
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
    return { vertices: vertices, colors: colors, textureCoords: textureCoords, faces: faces };
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

    // Shaders
    var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;
    attribute vec2 textureCoord;

    uniform mat4 PMatrix;
    uniform mat4 VMatrix;
    uniform mat4 MMatrix;
    
    varying vec3 vColor;
    varying vec2 vTextureCoord;

    void main(void) {
        gl_Position = PMatrix * VMatrix * MMatrix * vec4(position, 1.0);
        vColor = color;
        vTextureCoord = textureCoord;
    }`;

    var shader_fragment_source = `
    precision mediump float;
    varying vec3 vColor;
    varying vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
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
    var _textureCoord = GL.getAttribLocation(SHADER_PROGRAM, "textureCoord");

    var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix");
    var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix");
    var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix");
    var _uSampler = GL.getUniformLocation(SHADER_PROGRAM, "uSampler");

    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);
    GL.enableVertexAttribArray(_textureCoord);

    GL.useProgram(SHADER_PROGRAM);

    var tubeData = generateSphere(0, 0, 0.5, 0.8, 50);

    // Create buffers
    var TUBE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tubeData.vertices), GL.STATIC_DRAW);

    var TUBE_COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tubeData.colors), GL.STATIC_DRAW);

    var TUBE_TEXTURE_COORDS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_TEXTURE_COORDS);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tubeData.textureCoords), GL.STATIC_DRAW);

    var TUBE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tubeData.faces), GL.STATIC_DRAW);

    var texture;
    var image = new Image();
    image.onload = function () {
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.generateMipmap(GL.TEXTURE_2D);
    };
    image.src = 'ressources/Earth.png'; 

    // Check for NPOT support
    var npotExt = GL.getExtension('OES_texture_npot');
    if (!npotExt) {
        console.error('NPOT textures are not supported');
    }

    texture = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.uniform1i(_uSampler, 0);

    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEW_MATRIX, -4);

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

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_TEXTURE_COORDS);
        GL.vertexAttribPointer(_textureCoord, 2, GL.FLOAT, false, 0, 0);

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
