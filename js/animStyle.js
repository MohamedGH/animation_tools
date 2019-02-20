define(["./animBase"], 
	function( animBase ){

	var animStyle = function( el, transformations, number_frame, callback, starter )
	{
		var base = new AnimBase( el, transformations, number_frame, callback, starter );
		var self = base.instance;
		var pk = base.protectedKey;

		//PRIVATE
		init = function()
		{
			self[pk].style_data =null;
			self[pk].val =null;
		},	

		// Reverse Protected...
		self[ pk ].setup = function( releaser_play )
		{
			var releasers_will_change = [];
			var el = null;

			for( style_name in transformations )
			{
				if ( style_name == "opacity"  )
				{
					var el = transformations[ style_name ].el;
					releaser_will_change = askForChangeOpacity( el, "animStyle.setup" );
					releasers_will_change.push( releaser_will_change );
				}
			};

			var callback_parent = function()
			{
				releasers_will_change.forEach(  ( releaser ) => releaser() );
				//callback && callback();
			};

			this.callbacks.push( callback_parent );

			var interpolated_styles = {};
			var start_val = 0;

			Object.keys( transformations ).forEach( function( style_name )
			{
				var interpolated_style_data = {};
				var style_data = transformations[ style_name ];
				
				if ( !style_data.start && style_data.start !== 0 )
				{
					var st = window.getComputedStyle( style_data.el, null );
					start_val = parseFloat( st[ style_name ] );
				} 
				else
					start_val = style_data.start;

				var anim_val = style_data.end - start_val;
				var step = anim_val / number_frame;

				interpolated_style_data.is_decreasing = style_data.final_val < start_val;
				interpolated_style_data.start_val = start_val;
				interpolated_style_data.final_val = style_data.end;
				interpolated_style_data.el = style_data.el;
				interpolated_style_data.step = step;

				interpolated_styles[ style_name ] = interpolated_style_data;
			});

			this.interpolated_styles = interpolated_styles;
			releaser_play();
		};

		self[ pk ].animHook = function( num_iteration )
		{
			var self = this;
			Object.keys( this.interpolated_styles ).forEach( function( style_name )
			{
				self.style_data = self.interpolated_styles[ style_name ]
				self.val = self.style_data.start_val + self.style_data.step * num_iteration;
				self.style_data.el.style[ style_name ] = self.val;
			});	

		//	this.next_frame( num_iteration );
		}

		init.apply( self );
		return self;
	}
	return animStyle;
});