define(["ASYNC/synchroniser", "UTILS/utils_reflection", "UTILS/utils_dic"], 
	function( Synchroniser, Utils_reflection, Utils_dic ){
	var Utils_array  = (function () 
	{
	});

	Utils_array.Remove = function( arr, el )
	{
		var index = arr.indexOf( el );
		if (index > -1) 
		{
		    arr.splice(index, 1);
		    return true;
		}
		else
		{
			return false;
		}
	}

	Utils_array.Remove_where = function( arr, prop, val )
	{
		var to_remove = [];

		for( var i= 0; i < arr.length; i++ )
		{
			if ( arr[i][prop] == val )
				to_remove.push( arr[i] );
		}

		to_remove.forEach( (el)=> Utils_array.Remove( arr, el));
	}

	
//**SORT-----------------------------------------------------------------------------------------------------

	Utils_array.Sort_number = function( numbers )
	{
		return numbers.sort(function(a, b) { return a - b; });
	}

	Utils_array.Sort_string = function( to_sort )
	{
		return to_sort.sort();
	}

	Utils_array.Sort_boolean = function( to_sort )
	{
		return to_sort.sort( function(a, b) { return a > b; });
	}

	var Sort_by_field = function( to_sort, field, if_field, if_no_field )
	{
		if ( field )
		{
			return to_sort.sort( if_field );
		}

		else
			return to_sort.sort( if_no_field );
	}

	Utils_array.Sort_by_field_number = function( to_sort, field, is_inc )
	{
		var if_field, if_no_field;

		if ( is_inc )
		{
			if_field 	= (a,b)=> a[field] - b[field]; 
			if_no_field = (a,b)=> a - b;
		}
		else
		{
			if_field 	= (a,b)=> ( b[field] - a[field] ); 
			if_no_field = (a,b)=> ( b - a );
		}

		Sort_by_field( to_sort, field, if_field, if_no_field );
	}

	Utils_array.Sort_by_field_string = function( to_sort, field, is_inc )
	{
		var if_field, if_no_field;

		if ( is_inc )
		{
			if_field 	= (a,b)=> a[field] > b[field] || + (a[field] === b[field]) - 1; 
			if_no_field = (a,b)=> a > b || + (a === b) - 1; 
		}
		else
		{
			if_field 	= (a,b)=> a[field] < b[field] || + (a[field] === b[field]) - 1; 
			if_no_field = (a,b)=> a < b || + (a === b) - 1; 
		}

		Sort_by_field( to_sort, field, if_field, if_no_field );
	}

	Utils_array.Sort_by_field_boolean = function( to_sort, field, is_inc )
	{
		var if_field, if_no_field;

		if ( is_inc )
		{
			if_field 	= (a,b)=> a[field] > b[field]; 
			if_no_field = (a,b)=> a > b; 
		}
		else
		{
			if_field 	= (a,b)=> a[field] < b[field]; 
			if_no_field = (a,b)=> a < b;  
		}

		Sort_by_field( to_sort, field, if_field, if_no_field );
	}

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort*
	Utils_array.mappedSort = function( array, path, is_inc, set_order )
	{
		var mapped = array.map(function(el, i) 
		{
		  return { index: i, value: Utils_reflection.Get_field( el, path ) };
		})

		Utils_array.sort( mapped, "value", is_inc );

		if ( set_order )
		{
			var order = 0,
			result = mapped.map(function(el)
			{
			 	array[el.index].order = order++;
			  return array[el.index];
			});
		}
		else
		{
			var result = mapped.map(function(el)
			{
			  return array[el.index];
			});
		}

		Utils_reflection.copy_attr( array, result );
		return result;
	}

	/*Utils_array.copy_attr = function( arr1, arr2 )
	{
		for( var key in arr1 )
		{
			if( Utils_reflection.isNumber( key ) )
				continue;
			else
				arr2[ key ] = arr1[ key ];
		}
	}
*/
	Utils_array.filter_and_keep_attr = function( arr, filtre )
	{
		var arr2 = arr.filter( filtre );
		Utils_reflection.copy_attr( arr, arr2 );

		return arr2;
	}

	var SORTS = 
	{
		"boolean"	: Utils_array.Sort_by_field_boolean,
		"string"	: Utils_array.Sort_by_field_string,
		"number"	: Utils_array.Sort_by_field_number,
	};

	Utils_array.sort = function( array, field, is_inc )
	{
		if ( array.length <= 1 )
			return array;

		var item1 = ( field )? array[0][field] : array[0];

		var sort_function = SORTS[ typeof( item1 ) ];

		if ( sort_function )
		{
			return sort_function( array, field, is_inc );
		}
		else
		{
			return array;
		}
	}

//**-----------------------------------------------------------------------------------------------------

	Utils_array.Map_and_Reduce = function( arr, field, initial_val )
	{
		initial_val = ( initial_val )? initial_val : 0;

		if ( Array.isArray( arr )  )
			arr_values = arr.map( el => el[ field ] );
		else
			arr_values = Object.keys( arr ).map( key = arr[key][field] );

		var reduce_result = arr_values.reduce( function( previous, current )
		{
			return previous + current;
		}, initial_val);

		return reduce_result;
	}

	Utils_array.MultiMapsAndReduces = function( dic, field, reduced_fieldname, cb_on_element )
	{
		var el;
		Object.keys( dic ).forEach( function ( id )
		{
			el = dic[ id ];
			el[reduced_fieldname] = Utils_array.Map_and_Reduce( el, field );	
			cb_on_element && cb_on_element( el, id );
		});
	}


	
	Utils_array.Safe_Push = function( arr, to_add )
	{
		if ( arr )
		{
			arr = [];
		}
		arr.push( to_add ); 
		return arr;
	}

	Utils_array.Action_on_iterable = function( iterrable, action )
	{
		if ( Array.isArray( arr ) )
		{
			iterrable.forEach( el => action( el ) );
		}
		else
		{
			Object.keys( iterable ).forEach( key => action( iterable[key] ) );
		}
	}

	Utils_array.Clone = function( arr )
	{
		return arr.slice(0);
	}

	Utils_array.PushDistinct = function( arr, to_add )
	{
		if ( arr.indexOf( to_add ) == -1 )
		{
			arr.push( to_add ); 
		}
	}

	Utils_array.getAllDistinct = function( arr, meta )
	{
		var result = {}, val;

		arr.forEach( function( e )
		{
			result[ e[ meta.id ] ] = 1;
		});

		return result;
	}



	Utils_array.Multi_getAllDistinct = function( arr, metas, set )
	{
		var result = {};
		
		metas.forEach( (m)=> ( result[m.id] = {} ) && ( m.all_unique = true )  );

		arr.forEach( function( e )
		{
			metas.forEach( function( meta )
			{
				path = ( meta.path )? meta.path : meta.id;
				val = Utils_reflection.Get_field( e, path );
				if ( !result[meta.id][ val ] ) 
					result[meta.id][ val ] = 1;
				else
				{
					result[meta.id][ val ]++;
				//	meta.same_value_count = ( !meta.same_value_count )? 1 : ++meta.same_value_count;
					meta.all_unique = false;
				}
			});

		});


		if ( set )
		{
			var meta;
			Object.keys( result ).forEach( function(id)
			{
				meta = metas.find( (m)=> m.id == id );
				meta.parts = Utils_dic.getKeys( result[id], meta.id_type  );
				meta.parts_occurence = result[id];
			//	meta.different_parts_ratio = meta.parts_occurence.length / arr.length;
			});
		}

		return result;
	}

	Utils_array.getAllDistinctUsingPath = function( arr, attr_path )
	{
		var result = {}, val;

		arr.forEach( function( e )
		{
			val = Utils_reflection.Get_field( e, attr_path );
			result[val] = 1;
		});

		return result;
	}

	Utils_array.getAllDistinctUsingPath_andCount = function( arr, attr_path )
	{
		var result = {}, val;

		arr.forEach( function( e )
		{
			val = Utils_reflection.Get_field( e, attr_path );
			if ( !result[val] )
				result[val] = 1;
			else
				result[val]++;
		});

		return result;
	}

	Utils_array.stagger = function( els, payload, delay, cb ) 
	{
		var sync = new Synchroniser( [ cb ] );
		var i = 0;

		els.forEach( function (li) 
		{
			var releaser = sync.Add_one_lock( i );
			setTimeout( ()=> payload( li, releaser ),  i++ * delay  );
		});

		sync.InitOver();

	}

	Utils_array.stagger = function( els, payload, delay, cb ) 
	{
		var sync = new Synchroniser( [ cb ] );
		var i = 0;

		els.forEach( function (li) 
		{
			var releaser = sync.Add_one_lock( i );
			setTimeout( ()=> payload( li, releaser ),  i++ * delay  );
		});

		sync.InitOver();
	}
	
	Utils_array.max = function( arr ) 
	{
		return Math.max.apply( Math, arr );
	}

	Utils_array.min = function( arr ) 
	{
		return Math.min.apply( Math, arr );
	}
	
	Utils_array.min_max = function( arr, field_name ) 
	{
		var min = 9999999; max = -99999999, val;
		arr.forEach( function( el )
		{
			val = el[field_name];
			if( min > val )
			{
				min = val;
			}
			if ( max < val )
			{
				max = val;
			}
		});

		return { min, max, diff: max - min };
	}

	Utils_array.flatten = function( arr_of_arr )
	{
		var flattened = arr_of_arr.reduce( function( accumulateur, valeurCourante )
		{
			return accumulateur.concat( valeurCourante );
		});

		return flattened;
	}

	Utils_array.getSliceAndPercent = function( arr, nbr_of_parts )
	{
		var selected = arr.slice(0, nbr_of_parts);
		var first = arr[0];
		var sum_selected = selected.reduce((a,b)=> a+b.value, first.value);
			  		
		var nbr_de_donnee = arr.reduce((a,b)=> a+b.value, first.value);
		var precent = sum_selected / nbr_de_donnee;

		return { arr:selected, precent };
	}

	

	return Utils_array;
});
