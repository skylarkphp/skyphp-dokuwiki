define([
  "skylark-langx/langx",
  "skylark-devices-keyboard/keys",
  "skylark-domx-noder",
  "skylark-domx-styler",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
 	"skylark-domx-plugins-popups/popups",
  "./menus",
  "./menu"
],function(langx,keys,noder,styler, $,lists,plugins,popups,menus,Menu){
  'use strict'

  	var PopupMenu = Menu.inherit({

    	klassName : "PopupMenu",

    	pluginName : "lark.menus.popup",

		delay: 300,
		options: {
			icons: {
				submenu: "ui-icon-caret-1-e"
			},
			///items: "> *",
			///menus: "ul",
			position: {
				my: "left top",
				at: "right top"
			},

			role: "menu",


			item : {
				classes : {
					base : "menu-item",
          			active : "active",
          			disabled : "disabled",
          			wrapper : "menu-item-wrapper"
				},
				selector : "> *"
			},

			// Callbacks
			blur: null,
			focus: null,
			select: null
		},

    	_construct : function(elm,options) {
        	Menu.prototype._construct.call(this,elm,options);
			this.element = this.$();

			this.activeMenu = this.element;

			// Flag used to prevent firing of the click handler
			// as the event bubbles up through nested menus
			this.mouseHandled = false;
			this.lastMousePosition = { x: null, y: null };
			this.element
				.attr( {
					role: this.options.role,
					tabIndex: 0
				} );

			this.listenTo(this.element, {

				// Prevent focus from sticking to links inside menu after clicking
				// them (focus should always stay on UL during navigation).
				'mousedown': function( event ) {
					event.preventDefault();

					this._activateItem( event );
				},
				"click": function( event ) {
					var target = $( event.target );
					//var active = $( $.ui.safeActiveElement( this.document[ 0 ] ) );
					var active = $(noder.active());
					if ( !this.mouseHandled && target.not(`.${this.options.item.classes.disable}`).length ) {
						this.select( event );

						// Only set the mouseHandled flag if the event will bubble, see #9469.
						if ( !event.isPropagationStopped() ) {
							this.mouseHandled = true;
						}

						// Open submenu on click
						if ( target.has(`.${this.options.submenu.classes.base}`).length ) {
							this.expand( event );
						} else if ( !this.element.is( ":focus" ) &&
								active.closest( `.${this.options.submenu.classes.base}` ).length ) {

							// Redirect focus to the menu
							this.element.trigger( "focus", [ true ] );

							// If the active item is on the top level, let it stay active.
							// Otherwise, blur the active item since it is no longer visible.
							if ( this.active && this.active.parents( `.${this.options.submenu.classes.base}` ).length === 1 ) {
								clearTimeout( this.timer );
							}
						}
					}
				},
				"mouseenter": "_activateItem",
				"mousemove": "_activateItem",
			}, `.${this.options.item.classes.base}`);

			this.listenTo(this.element, {
				"mouseleave": "collapseAll",
				"focus": function( event, keepActiveItem ) {

					// If there's already an active item, keep it active
					// If not, activate the first item
					var item = this.active || this._menuItems().first();

					if ( !keepActiveItem ) {
						this.focus( event, item );
					}
				},
				"blur": function( event ) {
					this._delay( function() {
						var notContained = !noder.contains(
							this.element[ 0 ],
							//$.ui.safeActiveElement( this.document[ 0 ] )
							noder.active()
						);
						if ( notContained ) {
							this.collapseAll( event );
						}
					} );
				},
				"keydown": "_keydown"
			} );

			this.listenTo(this.element, "mouseleave",  `.${this.options.submenu.classes.base}`, "collapseAll");

			///this.refresh();

			// Clicks outside of a menu collapse any open menus
			this.listenTo( $(document), {
				click: function( event ) {
					if ( this._closeOnDocumentClick( event ) ) {
						this.collapseAll( event, true );
					}

					// Reset the mouseHandled flag
					this.mouseHandled = false;
				}
			} );
		},

		_activateItem: function( event ) {

			// Ignore mouse events while typeahead is active, see #10458.
			// Prevents focusing the wrong item when typeahead causes a scroll while the mouse
			// is over an item in the menu
			if ( this.previousFilter ) {
				return;
			}

			// If the mouse didn't actually move, but the page was scrolled, ignore the event (#9356)
			if ( event.clientX === this.lastMousePosition.x &&
					event.clientY === this.lastMousePosition.y ) {
				return;
			}

			this.lastMousePosition = {
				x: event.clientX,
				y: event.clientY
			};

			var actualTarget = $( event.target ).closest( `.${this.options.item.classes.base}` ),
				target = $( event.currentTarget );

			// Ignore bubbled events on parent items, see #11641
			if ( actualTarget[ 0 ] !== target[ 0 ] ) {
				return;
			}

			// If the item is already active, there's nothing to do
			if ( target.is(`.${this.options.item.classes.active}`) ) {
				return;
			}

			// Remove ui-state-active class from siblings of the newly focused menu item
			// to avoid a jump caused by adjacent elements both having a class with a border
			///this._removeClass( target.siblings().children( ".ui-state-active" ),
			///	null, "ui-state-active" );
			target.siblings().children( `.${this.options.item.classes.active}` ).removeClass(this.options.item.classes.active);
			this.focus( event, target );
		},

		_keydown: function( event ) {
			var match, prev, character, skip,
				preventDefault = true;

			switch ( event.keyCode ) {
			case keys.PAGE_UP:
				this.previousPage( event );
				break;
			case keys.PAGE_DOWN:
				this.nextPage( event );
				break;
			case keys.HOME:
				this._move( "first", "first", event );
				break;
			case keys.END:
				this._move( "last", "last", event );
				break;
			case keys.UP:
				this.previous( event );
				break;
			case keys.DOWN:
				this.next( event );
				break;
			case keys.LEFT:
				this.collapse( event );
				break;
			case keys.RIGHT:
				if ( this.active && !this.active.is( `.${this.options.item.classes.disabled}`) ) {
					this.expand( event );
				}
				break;
			case keys.ENTER:
			case keys.SPACE:
				this._activate( event );
				break;
			case keys.ESC:
				this.collapse( event );
				break;
			default:
				preventDefault = false;
				prev = this.previousFilter || "";
				skip = false;

				// Support number pad values
				character = event.keyCode >= 96 && event.keyCode <= 105 ?
					( event.keyCode - 96 ).toString() : String.fromCharCode( event.keyCode );

				clearTimeout( this.filterTimer );

				if ( character === prev ) {
					skip = true;
				} else {
					character = prev + character;
				}

				match = this._filterMenuItems( character );
				match = skip && match.index( this.active.next() ) !== -1 ?
					this.active.nextAll( `.${this.options.item.classes.base}` ) :
					match;

				// If no matches on the current filter, reset to the last character pressed
				// to move down the menu to the first item that starts with that character
				if ( !match.length ) {
					character = String.fromCharCode( event.keyCode );
					match = this._filterMenuItems( character );
				}

				if ( match.length ) {
					this.focus( event, match );
					this.previousFilter = character;
					this.filterTimer = this._delay( function() {
						delete this.previousFilter;
					}, 1000 );
				} else {
					delete this.previousFilter;
				}
			}

			if ( preventDefault ) {
				event.preventDefault();
			}
		},

		_activate: function( event ) {
			if ( this.active && !this.active.is( `.${this.options.item.classes.disabled}` ) ) {
				if ( this.active.children( "[aria-haspopup='true']" ).length ) {
					this.expand( event );
				} else {
					this.select( event );
				}
			}
		},

		_itemRole: function() {
			return {
				menu: "menuitem",
				listbox: "option"
			}[ this.options.role ];
		},

		focus: function( event, item ) {
			var nested, focused, activeParent;
			this.blur( event, event && event.type === "focus" );

			this._scrollIntoView( item );

			this.active = item.first();

			focused = this.active.children( `.${this.options.item.classes.wrapper}` );
			///this._addClass( focused, null, "ui-state-active" );
			focused.addClass(this.options.item.classes.active);

			// Only update aria-activedescendant if there's a role
			// otherwise we assume focus is managed elsewhere
			if ( this.options.role ) {
				this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
			}

			// Highlight active parent menu item, if any
			activeParent = this.active
				.parent()
					.closest( `.${this.options.item.classes.base}`)
						.children( `.${this.options.item.classes.wrapper}`);
			///this._addClass( activeParent, null, "ui-state-active" );
			activeParent.addClass(this.options.item.classes.active );

			if ( event && event.type === "keydown" ) {
				this._close();
			} else {
				this.timer = this._delay( function() {
					this._close();
				}, this.delay );
			}

			nested = item.children( `.${this.options.submenu.classes.base}` );
			if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
				this._startOpening( nested );
			}
			this.activeMenu = item.parent();

			///this._trigger( "focus", event, { item: item } );
			this.trigger("focus",{item : item})
		},

		_scrollIntoView: function( item ) {
			var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
			if ( this._hasScroll() ) {
				borderTop = parseFloat( styler.css( this.activeMenu[ 0 ], "borderTopWidth" ) ) || 0;
				paddingTop = parseFloat( styler.css( this.activeMenu[ 0 ], "paddingTop" ) ) || 0;
				offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
				scroll = this.activeMenu.scrollTop();
				elementHeight = this.activeMenu.height();
				itemHeight = item.outerHeight();

				if ( offset < 0 ) {
					this.activeMenu.scrollTop( scroll + offset );
				} else if ( offset + itemHeight > elementHeight ) {
					this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
				}
			}
		},

		blur: function( event, fromFocus ) {
			if ( !fromFocus ) {
				clearTimeout( this.timer );
			}

			if ( !this.active ) {
				return;
			}

			///this._removeClass( this.active.children( ".ui-menu-item-wrapper" ),
			///	null, "ui-state-active" );
			this.active.children( `.${this.options.item.classes.wrapper}` ).removeClass(this.options.item.classes.active);

			///this._trigger( "blur", event, { item: this.active } );
			this.trigger( "blur", { item: this.active } );
			this.active = null;
		},

		_startOpening: function( submenu ) {
			clearTimeout( this.timer );

			// Don't open if already open fixes a Firefox bug that caused a .5 pixel
			// shift in the submenu position when mousing over the caret icon
			///if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			///	return;
			///}

			this.timer = this._delay( function() {
				this._close();
				this._open( submenu );
			}, this.delay );
		},

		_open: function( submenu ) {
			var position = langx.extend( {
				of: this.active
			}, this.options.position );

			clearTimeout( this.timer );
			this.element.find( `.${this.options.submenu.classes.base}`).not( submenu.parents( `.${this.options.submenu.classes.base}` ) )
				.hide()
				.attr( "aria-hidden", "true" );

			//submenu
			//	.show()
			//	.removeAttr( "aria-hidden" )
			//	.attr( "aria-expanded", "true" )
			//	.position( position );
			popups.open(submenu.attr( "aria-expanded", "true" ),{
				position
			});
		},

		collapseAll: function( event, all ) {
			clearTimeout( this.timer );
			this.timer = this._delay( function() {

				// If we were passed an event, look for the submenu that contains the event
				var currentMenu = all ? this.element :
					$( event && event.target ).closest( this.element.find( `.${this.options.submenu.classes.base}`) );

				// If we found no valid submenu ancestor, use the main menu to close all
				// sub menus anyway
				if ( !currentMenu.length ) {
					currentMenu = this.element;
				}

				this._close( currentMenu );

				this.blur( event );

				// Work around active item staying active after menu is blurred
				///this._removeClass( currentMenu.find( ".ui-state-active" ), null, "ui-state-active" );
				currentMenu.find( `.${this.options.item.classes.active}`).removeClass(this.options.item.classes.active );

				this.activeMenu = currentMenu;
			}, all ? 0 : this.delay );
		},

		// With no arguments, closes the currently active menu - if nothing is active
		// it closes all menus.  If passed an argument, it will search for menus BELOW
		_close: function( startMenu ) {
			if ( !startMenu ) {
				startMenu = this.active ? this.active.parent() : this.element;
			}

			//startMenu.find(`.${this.options.submenu.classes.base}` )
			//	.hide()
			//	.attr( "aria-hidden", "true" )
			//	.attr( "aria-expanded", "false" );
			popups.close(startMenu.find(`.${this.options.submenu.classes.base}` ).attr( "aria-expanded", "false" ));
		},

		_closeOnDocumentClick: function( event ) {
			return !$( event.target ).closest(`.${this.options.submenu.classes.base}` ).length;
		},

		_isDivider: function( item ) {

			// Match hyphen, em dash, en dash
			return !/[^\-\u2014\u2013\s]/.test( item.text() );
		},

		collapse: function( event ) {
			var newItem = this.active &&
				this.active.parent().closest( `.${this.options.item.classes.base}`, this.element );
			if ( newItem && newItem.length ) {
				this._close();
				this.focus( event, newItem );
			}
		},

		expand: function( event ) {
			var newItem = this.active && this._menuItems( this.active.children( `.${this.options.submenu.classes.base}` ) ).first();

			if ( newItem && newItem.length ) {
				this._open( newItem.parent() );

				// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
				this._delay( function() {
					this.focus( event, newItem );
				} );
			}
		},

		next: function( event ) {
			this._move( "next", "first", event );
		},

		previous: function( event ) {
			this._move( "prev", "last", event );
		},

		isFirstItem: function() {
			return this.active && !this.active.prevAll( `.${this.options.item.classes.base}` ).length;
		},

		isLastItem: function() {
			return this.active && !this.active.nextAll( `.${this.options.item.classes.base}` ).length;
		},

		_menuItems: function( menu ) {
			return ( menu || this.element )
				.find( this.options.items )
				.filter( `.${this.options.item.classes.base}` );
		},

		_move: function( direction, filter, event ) {
			var next;
			if ( this.active ) {
				if ( direction === "first" || direction === "last" ) {
					next = this.active
						[ direction === "first" ? "prevAll" : "nextAll" ]( `.${this.options.item.classes.base}` )
						.last();
				} else {
					next = this.active
						[ direction + "All" ]( `.${this.options.item.classes.base}` )
						.first();
				}
			}
			if ( !next || !next.length || !this.active ) {
				next = this._menuItems( this.activeMenu )[ filter ]();
			}

			this.focus( event, next );
		},

		nextPage: function( event ) {
			var item, base, height;

			if ( !this.active ) {
				this.next( event );
				return;
			}
			if ( this.isLastItem() ) {
				return;
			}
			if ( this._hasScroll() ) {
				base = this.active.offset().top;
				height = this.element.height();
				this.active.nextAll( `.${this.options.item.classes.base}` ).each( function() {
					item = $( this );
					return item.offset().top - base - height < 0;
				} );

				this.focus( event, item );
			} else {
				this.focus( event, this._menuItems( this.activeMenu )
					[ !this.active ? "first" : "last" ]() );
			}
		},

		previousPage: function( event ) {
			var item, base, height;
			if ( !this.active ) {
				this.next( event );
				return;
			}
			if ( this.isFirstItem() ) {
				return;
			}
			if ( this._hasScroll() ) {
				base = this.active.offset().top;
				height = this.element.height();
				this.active.prevAll( `.${this.options.item.classes.base}` ).each( function() {
					item = $( this );
					return item.offset().top - base + height > 0;
				} );

				this.focus( event, item );
			} else {
				this.focus( event, this._menuItems( this.activeMenu ).first() );
			}
		},

		_hasScroll: function() {
			return this.element.outerHeight() < this.element.prop( "scrollHeight" );
		},

		select: function( event ) {

			// TODO: It should never be possible to not have an active item at this
			// point, but the tests don't trigger mouseenter before click.
			this.active = this.active || $( event.target ).closest( `.${this.options.item.classes.base}` );
			var ui = { item: this.active };
			if ( !this.active.has( `.${this.options.submenu.classes.base}` ).length ) {
				this.collapseAll( event, true );
			}
			///this._trigger( "select", event, ui );
			this.trigger( "select", ui );
		},

		_filterMenuItems: function( character ) {
			var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
				regex = new RegExp( "^" + escapedCharacter, "i" );

			return this.activeMenu
				.find( this.options.items )

					// Only match on items, not dividers or other content (#10571)
					.filter( `.${this.options.item.classes.base}` )
						.filter( function() {
							return regex.test(
								langx.trim( $( this ).children( `.${this.options.item.classes.wrapper}`).text() ) );
						} );
		}
	} );

  plugins.register(PopupMenu);

  return menus.PopupMenu = PopupMenu;	

});
