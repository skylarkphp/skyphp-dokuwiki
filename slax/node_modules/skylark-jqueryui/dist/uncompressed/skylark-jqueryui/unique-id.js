define( [ "skylark-jquery", "./version" ], function( $ ) {

	return $.fn.extend( {
		uniqueId: ( function() {
			var uuid = 0;

			return function() {
				return this.each( function() {
					if ( !this.id ) {
						this.id = "ui-id-" + ( ++uuid );
					}
				} );
			};
		} )(),

		removeUniqueId: function() {
			return this.each( function() {
				if ( /^ui-id-\d+$/.test( this.id ) ) {
					$( this ).removeAttr( "id" );
				}
			} );
		}
	});

} );
