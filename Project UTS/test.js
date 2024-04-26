function generateSphere(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];

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
function loadTexture(url) {
    var texture = GL.createTexture();
    var image = new Image();
    image.onload = function() {
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
        GL.generateMipmap(GL.TEXTURE_2D);
        GL.bindTexture(GL.TEXTURE_2D, null);
    };
    image.src = url;
    return texture;
}

function main() {
    var CANVAS = document.getElementById("your_canvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }

    /*========================= CAPTURE MOUSE EVENTS ========================= */

    var AMORTIZATION = 0.95;
    var drag = false;

    var x_prev, y_prev;

    var dX = 0, dY = 0;
    var mouseDown = function (e) {
        drag = true;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
        return false;
    };

    var mouseUp = function (e) {
        drag = false;
    };

    var mouseMove = function (e) {
        if (!drag) return false;
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width,
            dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
    };

    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);

    /*========================= SHADERS ========================= */

    var shader_vertex_source = "\n\
    attribute vec3 position;\n\
    uniform mat4 Pmatrix, Vmatrix, Mmatrix;\n\
    attribute vec2 uv;\n\
    varying vec2 vUV;\n\
    \n\
    void main(void) {\n\
    gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);\n\
    vUV=uv;\n\
    }";

    var shader_fragment_source = "\n\
    precision mediump float;\n\
    uniform sampler2D sampler;\n\
    varying vec2 vUV;\n\
    \n\
    \n\
    void main(void) {\n\
    gl_FragColor = texture2D(sampler, vUV);\n\
    }";

    /*========================= THE SPHERE ========================= */

    var planet = generateSphere(0, 0, 0.5, 1.2, 50, 1, 1, 1.2); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(planet.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(planet.colors), GL.STATIC_DRAW);
    var TUBE_FACES1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(planet.faces), GL.STATIC_DRAW);

    var texture = loadTexture("ressources/Jupiter.jpeg"); // Load texture
    var object1 = new MyObject(TUBE_VERTEX1, TUBE_FACES1, shader_vertex_source, shader_fragment_source, texture);

    /*========================= MATRIX ========================= */

    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEWMATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEWMATRIX, -10);
    var THETA = 0,
        PHI = 0;

    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(1.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    var time_prev = 0;
    var animate = function (time) {
        var dt = time - time_prev;
        if (!drag) {
            dX *= AMORTIZATION, dY *= AMORTIZATION;
            THETA += dX, PHI += dY;
        }
        object1.setIdentityMove();
        object1.setRotateMove(PHI, THETA, 0);

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        object1.draw();

        object1.setuniformmatrix4(PROJMATRIX, VIEWMATRIX);

        GL.flush();

        window.requestAnimationFrame(animate);
    };
    animate(0);
}

window.addEventListener('load', main);
