function main(){
    var CANVAS =  document.getElementById("your_canvas");

    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    var drag = false;
    var x_prev, y_prev;
    var dX = 0, dY = 0;
    var THETA = 0, PHI = 0;
    var AMORTIZATION = 0.95; //gaya gesek
    var mouseDown = function(e){
        drag = true;
        x_prev = e.pageX;
        y_prev = e.pageY;
        e.preventDefault(); //mencegah fungsi awal dri tombol yg di klik, misal klik kanan biasa keluarin inspect dkk tpi itu bisa dibatesi
        return false;
    }

    var mouseUp = function(e){
        drag = false;
    }

    var mouseMove = function(e){
        if(!drag) return false; 
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width;
        dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        x_prev = e.pageX;
        y_prev = e.pageY;
        e.preventDefault();
    }

    CANVAS.addEventListener("mousedown", mouseDown, false); //selama mouse ditekan
    CANVAS.addEventListener("mouseup", mouseUp, false); //selama mouse dilepas
    CANVAS.addEventListener("mouseout", mouseUp, false); //selama mouse keluar dari canvas
    CANVAS.addEventListener("mousemove", mouseMove, false); //selama mouse gerak2

    var GL;
    try {
        GL = CANVAS.getContext("webgl",{antialias: false});
    } catch (error) {
        alert("WebGL context cannot be initialized");
        return false;
    }

    //shaders
    var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;

    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;

    varying vec3 vColor;
    void main(void){
        gl_Position = Pmatrix * Vmatrix *Mmatrix * vec4(position, 1.0);
        vColor = color;
    } 
    `;

    var shader_fragment_source = `
    precision mediump float;
    varying vec3 vColor;
    void main(void){
        gl_FragColor = vec4(vColor,1.0);
    }
    `;

    var compile_shader = function(source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if(!GL.getShaderParameter(shader,GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: "
            + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    }

    var shader_vertex = compile_shader(shader_vertex_source
        ,GL.VERTEX_SHADER, "VERTEX");

    var shader_fragment = compile_shader(shader_fragment_source,
        GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(SHADER_PROGRAM);

    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM,"Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM,"Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM,"Mmatrix");

    var _color = GL.getAttribLocation(SHADER_PROGRAM,"color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM,"position");

    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);

    GL.useProgram(SHADER_PROGRAM);

    var radius = 1.0;
    var sectorCount = 72;
    var stackCount = 24;

    var vertices = [];
    var normals = [];
    var texCoords = [];

    var x, y, z, xy;                                    // vertex position
    var nx, ny, nz, lengthInv = 1.0 / radius;           // vertex normal
    var s, t;                                           // vertex texCoord

    var sectorStep = 2 * Math.PI / sectorCount / 2;         // starting from pi/2 to -pi/2
    var stackStep = Math.PI / stackCount;               // r * cos(u)
    var sectorAngle, stackAngle;                        // r * sin(u)

    for (let i = 0; i <= stackCount; i++) {
        stackAngle = Math.PI / 2 - i * stackStep;
        xy = radius * Math.cos(stackAngle);
        z = radius * Math.sin(stackAngle);
        
        // add (sectorCount+1) vertices per stack
        // first and last vertices have same position and normal, but different tex coords
        for (let j = 0; j <= sectorCount; j++) {
            sectorAngle = j * sectorStep;               // starting from 0 to 2pi

            // vertex position (x, y, z)
            x = xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
            y = xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)
            vertices.push(x);
            vertices.push(y);
            vertices.push(z);

            // normalized vertex normal (nx, ny, nz)
            nx = x * lengthInv;
            ny = y * lengthInv;
            nz = z * lengthInv;
            normals.push(nx);
            normals.push(ny);
            normals.push(nz);

            // vertex tex coord (s, t) range between [0, 1]
            s = j / sectorCount;
            t = i / stackCount;
            texCoords.push(s);
            texCoords.push(t);
        }
    }

    // generate CCW index list of sphere triangles
    // k1--k1+1
    // |  / |
    // | /  |
    // k2--k2+1
    var indices = [];
    var lineIndices = [];
    var k1, k2;
    for (let i = 0; i < stackCount; i++) {
        k1 = i * (sectorCount + 1);                         // beginning of current stack
        k2 = k1 + sectorCount + 1;                          // beginning of next stack

        for (let j = 0; j < sectorCount; j++) {
            // 2 triangles per sector excluding first and last stacks
            // k1 => k2 => k1+1
            if (i != 0) {
                indices.push(k1);
                indices.push(k2);
                indices.push(k1 + 1);
            }

            // k1+1 => k2 => k2+1
            if (i != (stackCount-1)) {
                indices.push(k1 + 1);
                indices.push(k2);
                indices.push(k2 + 1);
            }

            // store indices for lines
            // vertical lines for all stacks, k1 => k2
            lineIndices.push(k1);
            lineIndices.push(k2);
            if(i != 0) {    // horizontal lines except 1st stack, k1 => k+1
                lineIndices.push(k1);
                lineIndices.push(k1 + 1);
            }

            k1++;
            k2++;
        }
    }

    // buffer itu buat ngehandle ke layar
    var VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);

    //FACES
    var FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), GL.STATIC_DRAW);

    //MATRIX//
    var PROJMATRIX = LIBS.get_projection(40,CANVAS.width/CANVAS.height,1,100);
    var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEWMATRIX,-5);
    
    GL.clearColor(0.0,0.0,0.0,0.0);

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    
    GL.clearDepth(1.0);
    var time_prev = 0;
    var animate = function(time){
        if(time > 0){
            var dt = (time - time_prev);
            console.log(dt);
            if(!drag){
                dX *= AMORTIZATION;
                dY *= AMORTIZATION;
                THETA += dX;
                PHI += dY;
            }
            LIBS.set_I4(MOVEMATRIX);
            LIBS.rotateX(MOVEMATRIX,PHI);       
            LIBS.rotateY(MOVEMATRIX,THETA);
            time_prev = time;
        }

        GL.viewport(0,0,CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        GL.uniformMatrix4fv(_Pmatrix,false,PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix,false,VIEWMATRIX);
        GL.uniformMatrix4fv(_Mmatrix,false,MOVEMATRIX);

        //DRAWINGS
        //DRAWING TRIANGLE
        GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX);

        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4*(3+3), 0);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(3+3), 3*4);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES);
        GL.drawElements(GL.TRIANGLES, indices.length, GL.UNSIGNED_SHORT, 0);

        GL.flush();
        window.requestAnimationFrame(animate);
    };

    animate();
}
window.addEventListener('load',main);