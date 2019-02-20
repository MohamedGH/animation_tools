define(["UTILS/utils_array", "fastdom"], function( Utils_array, fastdom ){
	var Utils_matrix  = {};
	
	Utils_matrix.applyTranformation = function ( matrix, transformations ) 
	{
		var tr = null;
		var result_matrix = Utils_array.Clone( matrix );
		Object.keys( transformations ).forEach( function( transformation_type )
		{
			tr_val = transformations[ transformation_type ];
			Utils_matrix[ transformation_type ]( result_matrix, tr_val );
		});

		return result_matrix;
	}


	Utils_matrix.interpolateMatrix = function( matrix1, matrix2, number_frames )
	{
		var interpolated_matrix = [];
		var c1,c2 = 0;

		for ( var i = 0; i < matrix1.length; i++ )
		{ 
			c1 = matrix1[i];
			c2 = matrix2[i];

			var diff = c1 - c2;

			var step = diff / number_frames * -1;

			interpolated_matrix.push( { initialValue: c1, step: step });
		}

		return interpolated_matrix;
	}

	Utils_matrix.interpolate = function( c1, c2, number_frames )
	{
		var diff = c1 - c2;
		var step = diff / number_frames * -1;

		return { val: c1, step: step };
	}

	var getVal = function ( val, def ) 
	{
		return ( val || val == 0 )? val : def; 
	}

	/*
	var translationMatrix = 
	[
	    1,    0,    0,   0,
	    0,    1,    0,   0,
	    0,    0,    1,   0,
	    x,    y,    z,   1
	];
*/

	Utils_matrix.translateToX = function ( matrix, x ) 
	{
		matrix[12] = x;
		return matrix;
	}

	Utils_matrix.translateToY = function ( matrix, y ) 
	{
		matrix[13] = y;
		return matrix;
	}

	Utils_matrix.translateToZ = function ( matrix, z ) 
	{
		matrix[14] = z;
		return matrix;
	}

	Utils_matrix.translateTo = function ( matrix, coordinates ) 
	{
		var x = getVal( coordinates.x, matrix[12] ); 
		var y = getVal( coordinates.y, matrix[13] ); 
		var z = getVal( coordinates.z, matrix[14] ); 

		matrix[12] = x;
		matrix[13] = y;
		matrix[14] = z;

		return matrix;
	}


	Utils_matrix.translateX = function ( matrix, x ) 
	{
		matrix[12] += x;
		return matrix;
	}

	Utils_matrix.translateY = function ( matrix, y ) 
	{
		matrix[13] += y;
		return matrix;
	}

	Utils_matrix.translateZ = function ( matrix, z ) 
	{
		matrix[14] += z;
		return matrix;
	}

	Utils_matrix.translate = function ( matrix, coordinates ) 
	{
		var x = ( coordinates.x ) || 0; 
		var y = ( coordinates.y ) || 0;
		var z = ( coordinates.z ) || 0;

		matrix[12] += x;
		matrix[13] += y;
		matrix[14] += z;

		return matrix;
	}

	/*
	var scaleMatrix = 
	[
	    w,    0,    0,   0,
	    0,    h,    0,   0,
	    0,    0,    d,   0,
	    0,    0,    0,   1
	];
	*/

	Utils_matrix.scaleToX = function ( matrix, x ) 
	{
		matrix[0] = x;
		return matrix;
	}

	Utils_matrix.scaleToY = function ( matrix, y ) 
	{
		matrix[5] = y;
		return matrix;
	}

	Utils_matrix.scaleToZ = function ( matrix, z ) 
	{
		matrix[10] = z;
		return matrix;
	}

	Utils_matrix.scaleTo = function ( matrix, scales ) 
	{
		var x = getVal( scales.x, matrix[0] ); 
		var y = getVal( scales.y, matrix[5] ); 
		var z = getVal( scales.z, matrix[10] ); 

		matrix[0] = x;
		matrix[5] = y;
		matrix[10] = z;

		return matrix;
	}


	Utils_matrix.scaleX = function ( matrix, x ) 
	{
		matrix[0] *= x;
		return matrix;
	}

	Utils_matrix.scaleY = function ( matrix, y ) 
	{
		matrix[5] *= y;
		return matrix;
	}

	Utils_matrix.scaleZ = function ( matrix, z ) 
	{
		matrix[10] *= z;
		return matrix;
	}

	Utils_matrix.scale = function ( matrix, coordinates ) 
	{
		var x = ( coordinates.x ) || 1; 
		var y = ( coordinates.y ) || 1;
		var z = ( coordinates.z ) || 1;

		matrix[0] *= x;
		matrix[5] *= y;
		matrix[10] *= z;

		return matrix;
	}

	Utils_matrix.rotateX = function ( matrix, angle ) 
	{
		var cos = Utils_matrix.cosDegrees ( angle )
		, sin =  Utils_matrix.sinDegrees( angle );

		matrix[5] = cos;
		matrix[6] = -sin ;
		matrix[9] = sin;
		matrix[10] = cos;

		return matrix;
	}

	Utils_matrix.rotateY = function ( matrix, angle ) 
	{
		var cos = Utils_matrix.cosDegrees ( angle )
		, sin =  Utils_matrix.sinDegrees( angle );

		matrix[0] = cos;
		matrix[2] = sin ;
		matrix[8] = -sin;
		matrix[10] = cos;

		return matrix;
	}

	Utils_matrix.rotateZ = function ( matrix, angle ) 
	{
		var cos = Utils_matrix.cosDegrees ( angle )
		, sin =  Utils_matrix.sinDegrees( angle );

		matrix[0] = cos;
		matrix[1] = -sin ;
		matrix[4] = sin;
		matrix[5] = cos;

		return matrix;
	}

	function rotateAroundXAxis(a) 
	{
  
	  return [
	       1,       0,        0,     0,
	       0,  cos(a),  -sin(a),     0,
	       0,  sin(a),   cos(a),     0,
	       0,       0,        0,     1
	  ];
	}

	function rotateAroundYAxis(a) {
	  
	  return [
	     cos(a),   0, sin(a),   0,
	          0,   1,      0,   0,
	    -sin(a),   0, cos(a),   0,
	          0,   0,      0,   1
	  ];
	}

	function rotateAroundZAxis(a) {
	  
	  return [
	    cos(a), -sin(a),    0,    0,
	    sin(a),  cos(a),    0,    0,
	         0,       0,    1,    0,
	         0,       0,    0,    1
	  ];
	}

	Utils_matrix.toDegrees = function (angle) 
	{
  		return angle * (180 / Math.PI);
	}

	Utils_matrix.toRadians = function (angle) 
	{
  		return angle / (180 / Math.PI);
	}

	Utils_matrix.cosDegrees = function( angle )
	{
		return Math.cos( Utils_matrix.toRadians( angle ));
	}

	Utils_matrix.sinDegrees = function( angle )
	{
		return Math.sin( Utils_matrix.toRadians( angle ));
	}

	Utils_matrix.tanDegrees = function( angle )
	{
		return Math.tan( Utils_matrix.toRadians( angle ));
	}

	// MOZILLA
	Utils_matrix.multiplyMatrices = function (matrixA, matrixB) 
	{ 
		  // Slice the second matrix up into columns
		  var column0 = [matrixB[0], matrixB[4], matrixB[8], matrixB[12]];
		  var column1 = [matrixB[1], matrixB[5], matrixB[9], matrixB[13]];
		  var column2 = [matrixB[2], matrixB[6], matrixB[10], matrixB[14]];
		  var column3 = [matrixB[3], matrixB[7], matrixB[11], matrixB[15]];
		  
		  // Multiply each column by the matrix
		  var result0 = Utils_matrix.multiplyMatrixAndPoint( matrixA, column0 );
		  var result1 = Utils_matrix.multiplyMatrixAndPoint( matrixA, column1 );
		  var result2 = Utils_matrix.multiplyMatrixAndPoint( matrixA, column2 );
		  var result3 = Utils_matrix.multiplyMatrixAndPoint( matrixA, column3 );
		  
		  // Turn the result columns back into a single matrix
		  return [
		    result0[0], result1[0], result2[0], result3[0],
		    result0[1], result1[1], result2[1], result3[1],
		    result0[2], result1[2], result2[2], result3[2],
		    result0[3], result1[3], result2[3], result3[3]
		  ]
	}

	// MOZILLA
	Utils_matrix.multiplyMatrixAndPoint = function(matrix, point) 
	{
  
	  //Give a simple variable name to each part of the matrix, a column and row number
	  var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
	  var c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
	  var c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
	  var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
	  
	  //Now set some simple names for the point
	  var x = point[0];
	  var y = point[1];
	  var z = point[2];
	  var w = point[3];
	  
	  //Multiply the point against each part of the 1st column, then add together
	  var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
	  
	  //Multiply the point against each part of the 2nd column, then add together
	  var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
	  
	  //Multiply the point against each part of the 3rd column, then add together
	  var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
	  
	  //Multiply the point against each part of the 4th column, then add together
	  var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
	  
	  return [resultX, resultY, resultZ, resultW]
	}

	Utils_matrix.getRotation = function ( el )
	{
		var st = window.getComputedStyle(el, null);
		var tr = st.getPropertyValue("-webkit-transform") ||
				 st.getPropertyValue("-moz-transform") ||
				 st.getPropertyValue("-ms-transform") ||
				 st.getPropertyValue("-o-transform") ||
				 st.getPropertyValue("transform") ||
				 "FAIL";

		// With rotate(30deg)...
		// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
		//	console.log('Matrix: ' + tr);
		if ( tr == "none" )
			return 0;
		// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

		var values = tr.split('(')[1].split(')')[0].split(',');
		var a = values[0];
		var b = values[1];
		var c = values[2];
		var d = values[3];

		var scale = Math.sqrt(a*a + b*b);

		//	console.log('Scale: ' + scale);

		// arc sin, convert from radians to degrees, round
		var sin = b/scale;
		// next line works for 30deg but not 130deg (returns 50);
		// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
		var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
			
		//	console.log('Rotate: ' + angle + 'deg');
		return angle;
	}

	Utils_matrix.useMatrix3d = function( el, payload )
	{
		var matrix = 
		{
			scaleX 		: 1,
			skewY 		: 0, 
			unknow1		: 0,
			unknow2		: 0,

			skewX 		: 0,
			scaleY 		: 1,
			unknow3		: 0,
			unknow4		: 0,

			unknow5		: 0,
			unknow6		: 0,
			scaleZ		: 1,
			unknow7		: 0,

			translateX	: 0,
			translateY	: 0,
			translateZ	: 0,
			unknow8		: 1,
		}

		fastdom.measure(function() 
		{
			var st = window.getComputedStyle(el, null);
			var transform = st.transform;
			if ( !transform || transform == "none" )
				transform = el.style.transform;
		
			if ( transform )
			{
				var matrix_vals = transform.match(/[0-9.e-]{1,32}/g);	
				if ( transform.indexOf( "3d" ) != -1 )
				{
					matrix.scaleX 		= parseFloat ( matrix_vals[ 1 ] ),
					matrix.skewY 		= parseFloat ( matrix_vals[ 2 ] ), 
					matrix.unknow1		= parseFloat ( matrix_vals[ 3] ),
					matrix.unknow2		= parseFloat ( matrix_vals[ 4 ] ),

					matrix.skewX 		= parseFloat ( matrix_vals[ 5 ] ),
					matrix.scaleY 		= parseFloat ( matrix_vals[ 6 ] ),
					matrix.unknow3		= parseFloat ( matrix_vals[ 7 ] ),
					matrix.unknow4		= parseFloat ( matrix_vals[ 8 ] ),

					matrix.unknow5		= parseFloat ( matrix_vals[ 9 ] ),
					matrix.unknow6		= parseFloat ( matrix_vals[ 10 ] ),
					matrix.scaleZ		= parseFloat ( matrix_vals[ 11 ] ),
					matrix.unknow7		= parseFloat ( matrix_vals[ 12 ] ),

					matrix.translateX	= parseFloat ( matrix_vals[ 13 ] ),
					matrix.translateY	= parseFloat ( matrix_vals[ 14 ] ),
					matrix.translateZ	= parseFloat ( matrix_vals[ 15 ] ),
					matrix.unknow8		= parseFloat ( matrix_vals[ 16 ] )
				}
				else if ( transform.indexOf( "matrix" )  != -1 )
				{
					matrix.scaleX 	= parseFloat ( matrix_vals[ 0 ] );
					matrix.skewY 	= parseFloat ( matrix_vals[ 1 ] );
					matrix.skewX 	= parseFloat ( matrix_vals[ 2 ] );
					matrix.scaleY 	= parseFloat ( matrix_vals[ 3 ] );
					matrix.translateX = parseFloat ( matrix_vals[ 4 ] );
					matrix.translateY = parseFloat ( matrix_vals[ 5 ] );
				}
			}
		

			var true_matrix = 
			[
				 matrix.scaleX, matrix.skewY, matrix.unknow1, matrix.unknow2,
				 matrix.skewX,	 matrix.scaleY, matrix.unknow3, matrix.unknow4,
				 matrix.unknow5, matrix.unknow6, matrix.scaleZ, matrix.unknow7,
				 matrix.translateX, matrix.translateY, matrix.translateZ, matrix.unknow8
			];

			payload ( { matrix: true_matrix, data: matrix } );
		});
	}
	return Utils_matrix ;
});