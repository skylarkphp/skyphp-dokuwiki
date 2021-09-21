define([
], function() {
	// patch($.ui.plugin) is deprecated. .
	return  {
		add: function( module, option, set ) {
			var i,
				proto = module.prototype;
			for ( i in set ) {
				proto.patches[ i ] = proto.patches[ i ] || [];
				proto.patches[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args, allowDisconnected ) {
			var i,
				set = instance.patches[ name ];

			if ( !set ) {
				return;
			}

			if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode ||
					instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	};

});
