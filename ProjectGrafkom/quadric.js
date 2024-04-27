window.quadric = {
    Ellipsoid: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
        var vertices = [];
        var colors = [];
        var angleIncrement = (2 * Math.PI) / segments;
        var rainbowColors = [
            [16 / 200, 200 / 210, 150 / 250]
            // [1.0, 0.0, 0.0],
            // [0.0, 0.0, 1.0]
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
    },

    EllipticCone: function(x, y, z, radius, segments, coneScaleX, coneScaleY, coneScaleZ, rotationX, rotationY, rotationZ){
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

    Taabung: function(x, y, z, radius, height, segments, tabScaleX, tabScaleY, tabScaleZ, rotationX, rotationY, rotationZ){
        var vertices = [];
        var colors = [];
    
        var rainbowColors = [
            [16 / 200, 200 / 210, 150 / 250]
            // [1.0, 0.0, 0.0],
            // [0.0, 0.0, 1.0]
        ];
    
        for (var i = 0; i <= segments; i++) {
            var angle = 2 * Math.PI * (i / segments);
            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
    
            for (var j = 0; j <= segments; j++) {
                var heightFraction = j / segments;
                var xCoord = radius * cosAngle * tabScaleX;
                var yCoord = radius * sinAngle * tabScaleY;
                var zCoord = height * heightFraction - height / 2 * tabScaleZ;
    
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

    EllipticParaboloid: function(x, y, z, radius, segments, coneScaleX, coneScaleY, coneScaleZ, rotationX, rotationY, rotationZ){
        var vertices = [];
        var colors = [];
    
        var angleIncrement = (2 * Math.PI) / segments;
    
        var rainbowColors = [
            [1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0]
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
                var zCoord = Math.pow(vLat,2) * coneScaleZ;
    
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
    }
};



