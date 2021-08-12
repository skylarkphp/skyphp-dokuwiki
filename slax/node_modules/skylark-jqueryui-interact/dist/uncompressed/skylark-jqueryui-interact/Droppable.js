define( [
	"skylark-langx/langx",
	"skylark-domx-eventer",
	"skylark-domx-noder",
	"skylark-domx-query",
	"skylark-domx-plugins-base",
	"skylark-jquery/JqueryPlugin",
	"./patch",
	"./ddmanager",
],function(langx, eventer, noder, $, plugins, JqPlugin, patch, ddmanager) {

	var Droppable = JqPlugin.inherit({
		klassName: "Droppable",

		pluginName : "ui.Droppable",

		widgetEventPrefix: "drop",
		
		options: {
			accept: "*",
			addClasses: true,
			greedy: false,
			scope: "default",
			tolerance: "intersect",

			// Callbacks
			activate: null,
			deactivate: null,
			drop: null,
			out: null,
			over: null
		},
		_create: function() {

			var proportions,
				o = this.options,
				accept = o.accept;

			this.isover = false;
			this.isout = true;

			this.accept = langx.isFunction( accept ) ? accept : function( d ) {
				return d.is( accept );
			};

			this.proportions = function( /* valueToWrite */ ) {
				if ( arguments.length ) {

					// Store the droppable's proportions
					proportions = arguments[ 0 ];
				} else {

					// Retrieve or derive the droppable's proportions
					return proportions ?
						proportions :
						proportions = {
							width: this.element[ 0 ].offsetWidth,
							height: this.element[ 0 ].offsetHeight
						};
				}
			};

			this._addToManager( o.scope );

			o.addClasses && this._addClass( "ui-droppable" );

		},

		_addToManager: function( scope ) {

			// Add the reference and positions to the manager
			ddmanager.droppables[ scope ] = ddmanager.droppables[ scope ] || [];
			ddmanager.droppables[ scope ].push( this );
		},

		_splice: function( drop ) {
			var i = 0;
			for ( ; i < drop.length; i++ ) {
				if ( drop[ i ] === this ) {
					drop.splice( i, 1 );
				}
			}
		},

		_destroy: function() {
			var drop = ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
		},

		_setOption: function( key, value ) {

			if ( key === "accept" ) {
				this.accept = langx.isFunction( value ) ? value : function( d ) {
					return d.is( value );
				};
			} else if ( key === "scope" ) {
				var drop = ddmanager.droppables[ this.options.scope ];

				this._splice( drop );
				this._addToManager( value );
			}

			this._super( key, value );
		},

		_activate: function( event ) {
			var draggable = ddmanager.current;

			this._addActiveClass();
			if ( draggable ) {
				this._trigger( "activate", event, this.ui( draggable ) );
			}
		},

		_deactivate: function( event ) {
			var draggable = ddmanager.current;

			this._removeActiveClass();
			if ( draggable ) {
				this._trigger( "deactivate", event, this.ui( draggable ) );
			}
		},

		_over: function( event ) {

			var draggable = ddmanager.current;

			// Bail if draggable and droppable are same element
			if ( !draggable || ( draggable.currentItem ||
					draggable.element )[ 0 ] === this.element[ 0 ] ) {
				return;
			}

			if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem ||
					draggable.element ) ) ) {
				this._addHoverClass();
				this._trigger( "over", event, this.ui( draggable ) );
			}

		},

		_out: function( event ) {

			var draggable = ddmanager.current;

			// Bail if draggable and droppable are same element
			if ( !draggable || ( draggable.currentItem ||
					draggable.element )[ 0 ] === this.element[ 0 ] ) {
				return;
			}

			if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem ||
					draggable.element ) ) ) {
				this._removeHoverClass();
				this._trigger( "out", event, this.ui( draggable ) );
			}

		},

		_drop: function( event, custom ) {

			var draggable = custom || ddmanager.current,
				childrenIntersection = false;

			// Bail if draggable and droppable are same element
			if ( !draggable || ( draggable.currentItem ||
					draggable.element )[ 0 ] === this.element[ 0 ] ) {
				return false;
			}

			this.element
				.find( ":data(ui-droppable)" )
				.not( ".ui-draggable-dragging" )
				.each( function() {
					var inst = $( this ).droppable( "instance" );
					if (
						inst.options.greedy &&
						!inst.options.disabled &&
						inst.options.scope === draggable.options.scope &&
						inst.accept.call(
							inst.element[ 0 ], ( draggable.currentItem || draggable.element )
						) &&
						ddmanager.intersect(
							draggable,
							langx.extend( inst, { offset: inst.element.offset() } ),
							inst.options.tolerance, event
						)
					) {
						childrenIntersection = true;
						return false; }
				} );
			if ( childrenIntersection ) {
				return false;
			}

			if ( this.accept.call( this.element[ 0 ],
					( draggable.currentItem || draggable.element ) ) ) {
				this._removeActiveClass();
				this._removeHoverClass();

				this._trigger( "drop", event, this.ui( draggable ) );
				return this.element;
			}

			return false;

		},

		ui: function( c ) {
			return {
				draggable: ( c.currentItem || c.element ),
				helper: c.helper,
				position: c.position,
				offset: c.positionAbs
			};
		},

		// Extension points just to make backcompat sane and avoid duplicating logic
		// TODO: Remove in 1.13 along with call to it below
		_addHoverClass: function() {
			this._addClass( "ui-droppable-hover" );
		},

		_removeHoverClass: function() {
			this._removeClass( "ui-droppable-hover" );
		},

		_addActiveClass: function() {
			this._addClass( "ui-droppable-active" );
		},

		_removeActiveClass: function() {
			this._removeClass( "ui-droppable-active" );
		}
	} );

	plugins.register(Droppable,"droppable");

	return Droppable;

});
