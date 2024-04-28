window.quadric = {
    // Fungsi untuk membuat dan menggambar objek
    createAndBindBuffer: function (GL, data) {
        var vertexBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data.vertices), GL.STATIC_DRAW);

        var colorBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data.colors), GL.STATIC_DRAW);

        var indexBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.faces), GL.STATIC_DRAW);

        return { vertexBuffer: vertexBuffer, colorBuffer: colorBuffer, indexBuffer: indexBuffer };
    },

    Curves: function (object, x, y, z, segments, rotationX, rotationY, rotationZ, thickness, rainbowColors) {
        var vertices = [];
        var colors = [];

        for (var i = 0; i <= segments; i++) {
            var t = i / segments;
            var xCoord = Math.pow(1 - t, 3) * object[0][0] + 3 * Math.pow(1 - t, 2) * t * object[1][0] + 3 * (1 - t) * Math.pow(t, 2) * object[2][0] + Math.pow(t, 3) * object[3][0];
            var yCoord = Math.pow(1 - t, 3) * object[0][1] + 3 * Math.pow(1 - t, 2) * t * object[1][1] + 3 * (1 - t) * Math.pow(t, 2) * object[2][1] + Math.pow(t, 3) * object[3][1];
            var zCoord = Math.pow(1 - t, 3) * object[0][2] + 3 * Math.pow(1 - t, 2) * t * object[1][2] + 3 * (1 - t) * Math.pow(t, 2) * object[2][2] + Math.pow(t, 3) * object[3][2];

            // Menerapkan rotasi di sekitar sumbu X, Y, dan Z
            var rotatedX = xCoord * Math.cos(rotationY) - zCoord * Math.sin(rotationY);
            var rotatedZ = xCoord * Math.sin(rotationY) + zCoord * Math.cos(rotationY);

            var rotatedY = yCoord * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
            rotatedZ = yCoord * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);

            var tempX = rotatedX;
            rotatedX = tempX * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
            rotatedY = tempX * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);

            // Menambahkan vertice untuk membuat garis yang lebih tebal
            var width = thickness / 2;
            vertices.push(rotatedX + x - width, y + rotatedY, rotatedZ + z);
            vertices.push(rotatedX + x + width, y + rotatedY, rotatedZ + z);
            vertices.push(rotatedX + x - width, y + rotatedY, rotatedZ + z);
            vertices.push(rotatedX + x + width, y + rotatedY, rotatedZ + z);
            vertices.push(rotatedX + x, y + rotatedY, rotatedZ + z - width);
            vertices.push(rotatedX + x, y + rotatedY, rotatedZ + z + width);

            for (var j = 0; j <= segments; j++) {
                var colorIndex = j % rainbowColors.length;
                colors = colors.concat(rainbowColors[colorIndex]);
                colors = colors.concat(rainbowColors[colorIndex]);
            }
        }

        var faces = [];
        for (var i = 0; i < segments; i++) {
            var index = i * 6;
            faces.push(index, index + 1, index + 2); //// membuat triangles untuk setiap titik sudut
            faces.push(index + 1, index + 3, index + 2);
            faces.push(index + 2, index + 3, index + 4);
            faces.push(index + 3, index + 5, index + 4);
        }

        return { vertices: vertices, colors: colors, faces: faces };
    },

    Ellipsoid: function (x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rainbowColors) {
        var vertices = [];
        var colors = [];

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
    },

    SetengahEllipsoid: function (x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rainbowColors) {
        var vertices = [];
        var colors = [];
        var angleIncrement = (2 * Math.PI) / segments;

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
            for (var j = 0; j < segments / 2; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;

                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
        return { vertices: vertices, colors: colors, faces: faces };
    },

    EllipticCone: function (x, y, z, radius, segments, coneScaleX, coneScaleY, coneScaleZ, rotationX, rotationY, rotationZ, rainbowColors) {
        var vertices = [];
        var colors = [];
        var angleIncrement = (2 * Math.PI) / segments;

        for (var i = 0; i <= segments; i++) {
            var latAngle = (i / segments);
            var v = latAngle

            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);

                var xCoord = cosLon * v * coneScaleX;
                var yCoord = sinLon * v * coneScaleY;
                var zCoord = v * coneScaleZ;

                // Rotasi
                var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
                var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
                var rotatedZ = zCoord;
                // Pemutaran tambahan untuk diagonal
                rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
                rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
                // Rotasi horizontal (rotasi pada sumbu Y)
                var rotatedXHorizontal = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
                rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
                rotatedX = rotatedXHorizontal;
                var vertexX = x + rotatedX * radius;
                var vertexY = y + rotatedY * radius;
                var vertexZ = z + rotatedZ * radius;
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
    },

    Tabung: function (x, y, z, radius, height, segments, tabScaleX, tabScaleY, tabScaleZ, rotationX, rotationY, rotationZ, rainbowColors) {
        var vertices = [];
        var colors = [];

        for (var i = 0; i <= segments; i++) {
            var angle = 2 * Math.PI * (i / segments);
            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
            for (var j = 0; j <= segments; j++) {
                var heightFraction = j / segments;
                var xCoord = radius * cosAngle * tabScaleX;
                var yCoord = radius * sinAngle * tabScaleY;
                var zCoord = (height * heightFraction - height / 2) * tabScaleZ;
                // Rotasi
                var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
                var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
                var rotatedZ = zCoord;
                // Pemutaran tambahan untuk diagonal
                rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
                rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
                // Rotasi horizontal (rotasi pada sumbu Y)
                var rotatedXHorizontal = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
                rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
                rotatedX = rotatedXHorizontal;
                var vertexX = x + rotatedX;
                var vertexY = y + rotatedY;
                var vertexZ = z + rotatedZ;
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
    },

    EllipticParaboloid: function (x, y, z, radius, segments, coneScaleX, coneScaleY, coneScaleZ, rotationX, rotationY, rotationZ, rainbowColors) {
        var vertices = [];
        var colors = [];
    
        var rainbowColors = [
            [190 / 255, 215 / 255, 84 / 255] // Warna BED754
        ];
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var vLat = latAngle;
    
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
    
                var xCoord = cosLon * vLat * coneScaleX;
                var yCoord = sinLon * vLat * coneScaleY;
                var zCoord = Math.pow(vLat, 2) * coneScaleZ;
    
                // Rotasi sumbu x
                var rotatedY = Math.cos(rotationX) * yCoord - Math.sin(rotationX) * zCoord;
                var rotatedZ = Math.sin(rotationX) * yCoord + Math.cos(rotationX) * zCoord;
    
                // Rotasi sumbu y
                var rotatedX = Math.cos(rotationY) * xCoord + Math.sin(rotationY) * rotatedZ;
                rotatedZ = -Math.sin(rotationY) * xCoord + Math.cos(rotationY) * rotatedZ;
    
                // Rotasi sumbu z
                var tempX = rotatedX;
                rotatedX = Math.cos(rotationZ) * tempX - Math.sin(rotationZ) * rotatedY;
                var rotatedY = Math.sin(rotationZ) * tempX + Math.cos(rotationZ) * rotatedY;
    
                var vertexX = x + radius * rotatedX;
                var vertexY = y + radius * rotatedY;
                var vertexZ = z + radius * rotatedZ;
    
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
};



