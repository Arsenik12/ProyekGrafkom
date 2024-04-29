var LIBS = {

    degToRad: function(angle){

      return(angle*Math.PI/180);

    },

  

    get_projection: function(angle, a, zMin, zMax) {

      var tan = Math.tan(LIBS.degToRad(0.5*angle)),

          A = -(zMax+zMin)/(zMax-zMin),

          B = (-2*zMax*zMin)/(zMax-zMin);

  

      return [

        0.5/tan, 0 ,   0, 0,

        0, 0.5*a/tan,  0, 0,

        0, 0,         A, -1,

        0, 0,         B, 0

      ];

    },

    get_I4: function() {

        return [1,0,0,0,

                0,1,0,0,

                0,0,1,0,

                0,0,0,1];

      },

    

      rotateX: function(m, angle) {

        var c = Math.cos(angle);

        var s = Math.sin(angle);

        var mv1=m[1], mv5=m[5], mv9=m[9];

        m[1]=m[1]*c-m[2]*s;

        m[5]=m[5]*c-m[6]*s;

        m[9]=m[9]*c-m[10]*s;

    

        m[2]=m[2]*c+mv1*s;

        m[6]=m[6]*c+mv5*s;

        m[10]=m[10]*c+mv9*s;

      },

    

      rotateY: function(m, angle) {

        var c = Math.cos(angle);

        var s = Math.sin(angle);

        var mv0=m[0], mv4=m[4], mv8=m[8];

        m[0]=c*m[0]+s*m[2];

        m[4]=c*m[4]+s*m[6];

        m[8]=c*m[8]+s*m[10];

    

        m[2]=c*m[2]-s*mv0;

        m[6]=c*m[6]-s*mv4;

        m[10]=c*m[10]-s*mv8;

      },

    

      rotateZ: function(m, angle) {

        var c = Math.cos(angle);

        var s = Math.sin(angle);

        var mv0=m[0], mv4=m[4], mv8=m[8];

        m[0]=c*m[0]-s*m[1];

        m[4]=c*m[4]-s*m[5];

        m[8]=c*m[8]-s*m[9];

    

        m[1]=c*m[1]+s*mv0;

        m[5]=c*m[5]+s*mv4;

        m[9]=c*m[9]+s*mv8;

      },

      translateZ: function(m, t){

        m[14]+=t;

      },

      translateY: function(m ,t){
        m[13]+=t;
      },

      
      translateX: function(m ,t){
        m[12]+=t;
      },
      setPosition: function(m,x,y,z){
        m[12]=x, m[13]=y, m[14]=z;
      },
      scale: function(m, scaleX, scaleY, scaleZ) {
        m[0] *= scaleX;
        m[5] *= scaleY;
        m[10] *= scaleZ;
    }
  };











  // var LIBS = {

  //   degToRad: function(angle){

  //     return(angle*Math.PI/180);

  //   },

  

  //   get_projection: function(angle, a, zMin, zMax) {

  //     var tan = Math.tan(LIBS.degToRad(0.5*angle)),

  //         A = -(zMax+zMin)/(zMax-zMin),

  //         B = (-2*zMax*zMin)/(zMax-zMin);

  

  //     return [

  //       0.5/tan, 0 ,   0, 0,

  //       0, 0.5*a/tan,  0, 0,

  //       0, 0,         A, -1,

  //       0, 0,         B, 0

  //     ];

  //   },

  //   get_I4: function() {

  //       return [1,0,0,0,

  //               0,1,0,0,

  //               0,0,1,0,

  //               0,0,0,1];

  //     },

    

  //     rotateX: function(m, angle) {

  //       var c = Math.cos(angle);

  //       var s = Math.sin(angle);

  //       var mv1=m[1], mv5=m[5], mv9=m[9];

  //       m[1]=m[1]*c-m[2]*s;

  //       m[5]=m[5]*c-m[6]*s;

  //       m[9]=m[9]*c-m[10]*s;

    

  //       m[2]=m[2]*c+mv1*s;

  //       m[6]=m[6]*c+mv5*s;

  //       m[10]=m[10]*c+mv9*s;

  //     },

    

  //     rotateY: function(m, angle) {

  //       var c = Math.cos(angle);

  //       var s = Math.sin(angle);

  //       var mv0=m[0], mv4=m[4], mv8=m[8];

  //       m[0]=c*m[0]+s*m[2];

  //       m[4]=c*m[4]+s*m[6];

  //       m[8]=c*m[8]+s*m[10];

    

  //       m[2]=c*m[2]-s*mv0;

  //       m[6]=c*m[6]-s*mv4;

  //       m[10]=c*m[10]-s*mv8;

  //     },

    

  //     rotateZ: function(m, angle) {

  //       var c = Math.cos(angle);

  //       var s = Math.sin(angle);

  //       var mv0=m[0], mv4=m[4], mv8=m[8];

  //       m[0]=c*m[0]-s*m[1];

  //       m[4]=c*m[4]-s*m[5];

  //       m[8]=c*m[8]-s*m[9];

    

  //       m[1]=c*m[1]+s*mv0;

  //       m[5]=c*m[5]+s*mv4;

  //       m[9]=c*m[9]+s*mv8;

  //     },

  //     translateZ: function(m, t){

  //       m[14]+=t;

  //     },

  //     translateY: function(m ,t){
  //       m[13]+=t;
  //     },

      
  //     translateX: function(m ,t){
  //       m[12]+=t;
  //     },
  //     setPosition: function(m,x,y,z){
  //       m[12]=x, m[13]=y, m[14]=z;
  //     },

      // Fungsi Translasi
  //     translate: function(m, x, y, z) {
  //         m[12] += x;
  //         m[13] += y;
  //         m[14] += z;
  //     },

      // Fungsi Skalasi
      // scale: function(m, scaleX, scaleY, scaleZ) {
      //     m[0] *= scaleX;
      //     m[5] *= scaleY;
      //     m[10] *= scaleZ;
      // },

  // //     // Fungsi Rotasi pada sumbu-sumbu X, Y, dan Z (sudah ada)

  //     // Fungsi Rotasi Terhadap Sumbu Aritmetika Sembarang
  //     rotateArbitraryAxis: function(m, angle, axisX, axisY, axisZ) {
  //         var c = Math.cos(angle);
  //         var s = Math.sin(angle);
  //         var t = 1 - c;
  //         var len = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
  //         if (len !== 1) {
  //             var invLen = 1 / len;
  //             axisX *= invLen;
  //             axisY *= invLen;
  //             axisZ *= invLen;
  //         }
  //         var a00 = m[0], a01 = m[1], a02 = m[2],
  //             a10 = m[4], a11 = m[5], a12 = m[6],
  //             a20 = m[8], a21 = m[9], a22 = m[10],
  //             b00 = axisX * axisX * t + c,
  //             b01 = axisY * axisX * t + axisZ * s,
  //             b02 = axisZ * axisX * t - axisY * s,
  //             b10 = axisX * axisY * t - axisZ * s,
  //             b11 = axisY * axisY * t + c,
  //             b12 = axisZ * axisY * t + axisX * s,
  //             b20 = axisX * axisZ * t + axisY * s,
  //             b21 = axisY * axisZ * t - axisX * s,
  //             b22 = axisZ * axisZ * t + c;
  //         m[0] = a00 * b00 + a10 * b01 + a20 * b02;
  //         m[1] = a01 * b00 + a11 * b01 + a21 * b02;
  //         m[2] = a02 * b00 + a12 * b01 + a22 * b02;
  //         m[4] = a00 * b10 + a10 * b11 + a20 * b12;
  //         m[5] = a01 * b10 + a11 * b11 + a21 * b12;
  //         m[6] = a02 * b10 + a12 * b11 + a22 * b12;
  //         m[8] = a00 * b20 + a10 * b21 + a20 * b22;
  //         m[9] = a01 * b20 + a11 * b21 + a21 * b22;
  //         m[10] = a02 * b20 + a12 * b21 + a22 * b22;
  //     },

  //     // Fungsi Kombinasi Transformasi
  //     combineTransformations: function(transformations) {
  //         var result = LIBS.get_I4();
  //         for (var i = 0; i < transformations.length; i++) {
  //             var transformation = transformations[i];
  //             var type = transformation[0];
  //             var args = transformation.slice(1);
  //             switch (type) {
  //                 case 'translate':
  //                     LIBS.translate(result, args[0], args[1], args[2]);
  //                     break;
  //                 case 'rotateX':
  //                     LIBS.rotateX(result, args[0]);
  //                     break;
  //                 case 'rotateY':
  //                     LIBS.rotateY(result, args[0]);
  //                     break;
  //                 case 'rotateZ':
  //                     LIBS.rotateZ(result, args[0]);
  //                     break;
  //                 case 'scale':
  //                     LIBS.scale(result, args[0], args[1], args[2]);
  //                     break;
  //                 case 'rotateArbitraryAxis':
  //                     LIBS.rotateArbitraryAxis(result, args[0], args[1], args[2], args[3]);
  //                     break;
  //                 default:
  //                     console.error('Unknown transformation type: ' + type);
  //                     break;
  //             }
  //         }
  //         return result;
  //     }
  // };

