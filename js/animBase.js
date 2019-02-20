define(["ASYNC/synchroniser"], 
	function( Synchroniser ){
	/**
    * animBase is a ES2015+ base "class" who implement animation lifecycle methods using requestAnimationFrame for performance
    * Childs "class" have to override "setNext", private methods "setup", and hook on "anim"
    * Internals variables/functions are encapsulated and shared with childs using Symbol 
    * @param {DOMElement} el is the element to animate
    * @param {object} transformations describe the animation ( childs deal with them on setup )
    * @param {number} numberFrame is number of frame the animation will last
    * @param {function} callback is a function to call when animation is over
    * @param {function} customStarter if set can replace the "play" function
    * @return {object} Return the instance and his internal key
    * @exports animBase
    */
	var animBase = function( el, transformations, numberFrame, callback, customStarter )
	{
// INTERFACE---------------------------------------------------------------------------------  
		var self = 
		{
			/**
			* @method Start the animation
		    * @param {boolean} useCustomStarter if set can replace the "play" function
		   	*/
			start : function( useCustomStarter ) 
			{
				// If useCustomStarter and customStarter was provided
				( !useCustomStarter && this[pk].customStarter )? this[pk].customStarter() : this[pk].play();
			},

			/**
			* @method setNext is used to chain animation
		    * Should be implemented by child
		   	*/
			setNext: function () 
			{  
				console.warn( "animBase.setNext hasn't been implemented for : ", this );
			},

			// Explicit ENUM for boolean useCustomStarter parameter
			useCustomStarter : Object.freeze({ YES:true, NO:false })
		}

// INTERNAL/PRIVATE---------------------------------------------------------------------------------
		/** private key to internals  */
		var pk = Symbol( el.id + numberFrame );

		/**
		* @method init create internals variables/methods
		*/
		init = function()
		{
			this[pk] = {};
			this[pk].el = el;
			this[pk].transformations = transformations;
			this[pk].numberFrame = numberFrame;
			// Internal callbacks ( releaser, ect )
			this[pk].callbacks = [];
			// Param provided callback
			this[pk].lastCallback = callback;
			this[pk].customStarter = customStarter;


			/**
			* @method Play will start the animation
			*/
			this[ pk ].play = function() 
			{
				// Use a Synchroniser to order execution of "setup" and the first call to "anim"
				// setup can be async if it use fastdom
				// Once setup is done, it will use requestAnimationFrame for the method anim
				var sync = new Synchroniser(
				[
					()=>setTimeout( ()=> requestAnimationFrame( () => this.anim.call( this, 1 ) ), 50 )
				]);

				var releaser = sync.addLock("set_data");
				this.setup( releaser );
				sync.InitOver();
			}

			/**
			* 	@method setup compltete animation setup  
			*	Implemented by child class
			*/
			this[ pk ].setup = function() 
			{
				console.warn( "animBase.setup hasn't been implemented for : ", this );
			}

			/**
			* 	@method anim call the animation payload implemented by the child class ( animHook )
			*	and call the nextFrame
			*	@param {number} numIteration is the number of frame this animation is playing
			*/
			this[ pk ].anim = function( numIteration ) 
			{
				this.animHook( numIteration );
				this.nextFrame( numIteration );
			}

			/**
			* 	@method nextFrame either call requestAnimationFrame while incrementing numIteration
			*	or call onFinished if the animation is done 
			*	@param {number} numIteration is the number of frame this animation is playing
			*/
			this[ pk ].nextFrame = function( numIteration ) 
			{
				if ( numIteration < this.numberFrame  )
				{
		 			requestAnimationFrame(() => this.anim( ++numIteration ));
				}
				else
				{
					this.onFinished();		
				}
			}
			
			/**
			* @method onFinished is called on last frame of animation
			* It call callbacks and start the next animation if any
			*/
			this[ pk ].onFinished = function()
			{
				this.callbacks.forEach( (callback)=> callback && callback() );
				this.lastCallback && this.lastCallback();

				this.next && this.next();
			}
		};


		init.apply( self );
		return { instance:self , protectedKey: pk };

	}
	return animBase;
});