define(["UTILS/utils_matrix", "./animBase", "ASYNC/synchroniser"], 
	function( Utils_matrix, AnimBase, Synchroniser ){

	/**
    * animTransform is a module who "inherit" from AnimBase and allow animation of CSS' transform or matrix using fastdom for performance
    * It's override AnimBase's "setNext", private methods "setup", and hook on his "anim" method
    * using the protectedKey
    * @param {DOMElement} el is the element to animate
    * @param {object} transformations describe the animation using { utils_matrix_function_name : parameter, ... }
    * @param {number} numberFrame is number of frame the animation will last
    * @param {function} callback is a function to call when animation is over
    * @param {function} customStarter if set can replace the "play" function
    * @return {animTransform} Return an instance of animTransform
    * @exports animTransform
    */
	var animTransform = function( el, transformations, numberFrame, callback, customStarter, from )
	{
		var base = new AnimBase( el, transformations, numberFrame, callback, customStarter );
		var self = base.instance;
		var pk = base.protectedKey;
		/** releaserWillChange is used to remove el'CSS property tranform */
		var releaserWillChange = null;

// INTERFACE---------------------------------------------------------------------------------  

		/**
		* @method setNext is used to chain animation
		* @return {animTransform} nextAnim is the new animation and is return for chainning purpose
		*/
		self.setNext = function ( el, transformationsNext, numberFrameNext, callbackNext ) 
		{  
			var self = this;
			var customStarter = ( this[pk].customStarter )? this[pk].customStarter : () => self[pk].play();
			// Instantiate the next animation
			var nextAnim =  new animTransform( el, transformationsNext, numberFrameNext, callbackNext, customStarter );
			// Set the next property to start nextAnim with customStarter
			this[pk].next = () => nextAnim.start( this.useCustomStarter.YES ) ;
			return nextAnim;
		};

// INTERNAL/PRIVATE---------------------------------------------------------------------------------
		init = function()
		{
			self[ pk ].startMatrixStr = "matrix3d(";
			self[ pk ].matrixStr = "";
			self[ pk ].field = "";
			self[ pk ].val = "";
			self[ pk ].from = from;
		},

		/**
		* @method setup is used to calculate the new matrix
		* @param {function} releaserPlay is a function (lock releaser) that will call the
		* play method once it's called
		*/		
		self[ pk ].setup = function( releaserPlay )
		{
			var self = this;

			var onMatrixGetted = function( matrix )
			{
				requestAnimationFrame( function()
				{
					//Set the element's will-change CSS property and get a releaser to remove it
					releaserWillChange = askForChangeTransform( el, "animTransform.setup");
					
					// if element must start from a specific transform
					if ( self.from )
						matrix.matrix = Utils_matrix.applyTranformation( matrix.matrix, self.from );

					// Compute the last animation frame matrix
					var transformedMatrix = Utils_matrix.applyTranformation( matrix.matrix, transformations );
					// Get an array of {intial_value,step} where for element of indice i : intial_value + step * numberFrame =  transformedMatrix[i] 
					self.interpolatedMatrix = Utils_matrix.interpolateMatrix( matrix.matrix, transformedMatrix, numberFrame );
					// Remove appropriate will-change CSS property
					self.callbacks.push( releaserWillChange );
					// Can start anim
					releaserPlay();
				});
			}
			//Get the CSS matrix using fastdom
			Utils_matrix.useMatrix3d( el, onMatrixGetted );
	
		};

		/**
		* @method animHook is where the animation occur
		* Called by animBase.anim each AnimationFrame
		* @param {numIteration} progress of the animation
		*/	
		self[ pk ].animHook = function( numIteration )
		{
			this.matrixStr = this.startMatrixStr;

			var self = this;

			//Calcul each element and construct the matrix CSS property
			// ex "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1)"
			self.field = self.interpolatedMatrix[ 0 ];
			self.val = self.field.initialValue + self.field.step * numIteration;

			this.matrixStr +=  self.val; 
	
			//TOO MUCH CONCATENATION 
			for ( var i = 1; i < this.interpolatedMatrix.length; i++ )
			{
				self.field = self.interpolatedMatrix[ i ];
				self.val = self.field.initialValue + self.field.step * numIteration;
				this.matrixStr += "," + self.val;
			}

			this.matrixStr += ")";

			// Apply the transform
			el.style.transform = this.matrixStr;
		};	

//-Managing Will-Change CSS-------------------------------------------------------------------------------------------
		const willChangeStr = "will-change";
		const transformStr 	= "transform";

		var askForChangeTransform = function( el, lock_name ) 
		{
			if ( !el.synchChangeTransform )
			{
				el.synchChangeTransform = new Synchroniser( 
					[ () => removeFromWillChange( el, transformStr ) ] );
			}

			var releaser = el.synchChangeTransform.addLock( lock_name );
			addToWillChange( el, transformStr );


			el.synchChangeTransform.InitOver();
			return releaser;
		}

		var addToWillChange = function( el, to_add )
		{
			fastdom.measure(function() 
			{
				var change = el.style[ willChangeStr ];
				fastdom.mutate(function() 
				{
					if( change.indexOf( to_add ) == -1 )
					{
						if ( change )
							el.style[ willChangeStr ] = change + "," + to_add;
						else
							el.style[ willChangeStr ] = to_add;
					}
				});
	      	});
			
		}

		var removeFromWillChange = function( el, strToRemove )
		{
			var oldWillChange = el.style[ willChangeStr ];
			oldWillChange = oldWillChange.replace( " ", "");

			var changesArray = oldWillChange.split( "," );
			changesArray = changesArray.filter( (c) => c != strToRemove );

			var newWillChangeStr = changesArray.join( ",");
			el.style[ willChangeStr ] = newWillChangeStr;
		}

		init.apply( self );
		return self;
	}

	return animTransform;
});