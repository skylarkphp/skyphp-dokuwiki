/**
 * skylark-domx-plugins-menus - The skylark menu plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-menus/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-plugins-menus/menus',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("domx.plugins.menus");
});
define('skylark-domx-plugins-menus/menu',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus"
],function(langx,$,lists,plugins,menus){
  'use strict'


  var Menu = plugins.Plugin.inherit({
    klassName : "Menu",

    pluginName : "lark.menus.menu",

    options : {
      template : "",

      classes : {
        base : "lark-menu"
      },

      selectors : {
        container : null
      },

      item : {
        templates : {
          general : '<li class="menu-item"><a href="#" class="link"><%= title %></a></li>',
          separator : "",
          hasChildren : '<li class="menu-item hasChildren"><a href="#" class="link"><%= title %></a><ul class="submenu"></ul>',
        },

        classes : {
          base : "menu-item",
          active : "active",
          hasChildren : "hasChildren"
        },

        selectors : {
          general : "li",
          hasChildren : ":has(ul)"
        }
      },

      submenu : {
        template : "<ul></ul>",
        classes : {
          base : "submenu"
        },
        selectors : {
          children : "> ul",
          descendant : "ul"
        }
      },

      data : {
        ///items : []
      },

      onAction : null
    },

    _construct : function(elm,options) {
        plugins.Plugin.prototype._construct.call(this,elm,options);

        this._$container = this.$(this.options.selectors.container);

        if (this.options.onAction) {
          this.listenTo(this._$container,"click",`.${this.options.item.classes.base}`,(e)=>{
              var itemData = $(e.currentTarget).data("item");
              this.options.onAction(itemData);

          });
        }

    },

    renderMenuItemHtml : function(itemData) {
      if (!this._renderItemHtml) {
        let itemTpl = this.options.item.template;
        if (langx.isString(itemTpl)) {
          this._renderItemHtml = langx.template(itemTpl);
        } else if (langx.isFunction(itemTpl)) {
          this._renderItemHtml = itemTpl;
        }
      }

      return this._renderItemHtml(itemData);
    },

    renderGeneralMenuItem : function(itemData) {
      if (!this._renderGeneralItemHtml) {
        let itemTpl = this.options.item.templates.general;
        if (langx.isString(itemTpl)) {
          this._renderGeneralItemHtml = langx.template(itemTpl);
        } else if (langx.isFunction(itemTpl)) {
          this._renderGeneralItemHtml = itemTpl;
        }
      }
      return $(this._renderGeneralItemHtml(itemData));
    },

    renderHasChildrenMenuItem : function(itemData) {
      if (!this._renderHasChildrenItemHtml) {
        let itemTpl = this.options.item.templates.hasChildren;
        if (langx.isString(itemTpl)) {
          this._renderHasChildrenItemHtml = langx.template(itemTpl);
        } else if (langx.isFunction(itemTpl)) {
          this._renderHasChildrenItemHtml = itemTpl;
        }
      }

      return $(this._renderHasChildrenItemHtml(itemData));
    }   


  });


  plugins.register(Menu);

  return menus.Menu = Menu; 
});
define('skylark-domx-plugins-menus/accordion-menu',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'
  
   var AccordionMenu = Menu.inherit({
    klassName : "AccordionMenu",

    pluginName : "lark.menus.accordion",

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        lists.multitier(elm, {
          togglable : true,

          classes : {
            active :  this.options.item.classes.active  // active
           /// collapse : "collapse",
           /// in : "in",
          },

          selectors : {
            item : this.options.item.selectors.general,          //li
            sublist : this.options.submenu.selectors.descendant, //"ul",
            hasSublist : this.options.item.selectors.hasChildren//":has(ul)",
            ///handler : " > a"
          },

          multiExpand : false

        });
    }

  });


  plugins.register(AccordionMenu);

  return menus.AccordionMenu = AccordionMenu; 
});
define('skylark-domx-plugins-menus/cascade-menu',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'

  var CascadeMenu = Menu.inherit({
    klassName : "CascadeMenu",

    pluginName : "lark.menus.cascade",

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        lists.multitier(elm, {
          togglable : true,

          classes : {
            active :  this.options.item.classes.active  // active
           /// collapse : "collapse",
           /// in : "in",
          },

          selectors : {
            item : this.options.item.selectors.general,          //li
            sublist : this.options.submenu.selectors.descendant, //"ul",
            hasSublist : this.options.item.selectors.hasChildren//":has(ul)",
            ///handler : " > a"
          },

          multiExpand : false

        });
    }

  });


  plugins.register(CascadeMenu);

  return menus.CascadeMenu = CascadeMenu;	
});
define('skylark-domx-plugins-menus/mega-menu',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'

  var MegaMenu = Menu.inherit({
    klassName : "MegaMenu",

    pluginName : "lark.menus.mega",

    options : {
      menuBehaviour: "click",
      stickyHeader: true,
      //selector: $(this),
      caret:false,
      caretArrows: [{
        up: "caret-up",
        down: "caret-down",
        upUrl:"",
        downUrl:"",
      }],
      highlighter: true,
      followingHighlighter: false,
      highlightColor:"",
      textHighlighter: false,
      textHighlighterColor: "",
      animation:false,
      animationClass: "",

    },

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        let settings = this.options;
        
        var element = settings.selector;
        var mainLinks = $(".main-links ul li a");
        var subMenu = $(".menu-dropdown .menu-item-wrapper");
        var mainLinksDataAttribute = [];
        var iDofSubMenus = [];
        var selectElementwithId = $("#"+subMenu.attr("id"));

        var caretUp = this.options.caretArrows[0].up;
        var caretDown = this.options.caretArrows[0].down;

        // Sticky Heder

        if (settings.stickyHeader === false) {
          $(".mega-menu").removeClass("sticky-header");
        }
        else {
          $(".mega-menu").addClass("sticky-header");
        }

        // If caret: custom then it will exclude default settings mentioned above
        if (settings.caret === true) {
          var caretUp = settings.caretArrows[0].up;
          var caretDown = settings.caretArrows[0].down;
        }

        // If icon caret (up or down) is not empty image caret should be hidden
        if (settings.caretArrows[0].up || settings.caretArrows[0].down ) {
          settings.caretArrows[0].upUrl = null;
          settings.caretArrows[0].downUrl = null;
        }

        // Creating Caret icon for every link which have data-submenu attribute
        $("a[data-submenu]").append('<span class="caret ' + caretDown + '"></span>');

        // Set Initial Image path for carret (Default is down)
        if (settings.caret === true && settings.caretArrows[0].downUrl !== "") {
          $(".mega-menu span.caret").removeClass("undefined");
          $(".mega-menu span.caret").addClass("caret-img down");
          $(".mega-menu span.caret.caret-img.down").css({"background-image" : "url(" +settings.caretArrows[0].downUrl+ ")"});
        }

        // Append Style on DOM
        $(`<style>
            .mega-menu .main-links ul li a:hover{
              border-color:` +settings.highlightColor+
            `}
          </style>`).appendTo("head");

        // Remove Active link Highlight
        mainLinks.on(settings.menuBehaviour, function(){
          mainLinks.removeClass("highlight");
          mainLinks.css({"border-color":""});
        });

        // If a user didn't defined menu behaviour
        if (settings.menuBehaviour === "") {
          settings.menuBehaviour = "click";
        }

        // Menu Toggle Works
        mainLinks.each(function(i){

          var linkID = $(this).attr("data-submenu");

          mainLinksDataAttribute.push($(this).attr("data-submenu"));

          $(this).on(settings.menuBehaviour,function(){
            // Find Position of Menu ULs to help pass index for perticular ID on each menu links
            var findPositionOfSubmenus = langx.inArray( linkID, iDofSubMenus );

            var imageCaret = $(this).find(".caret.caret-img");

            // Sets every links default behavour for caret except currently clicked
            mainLinks.find("span").removeClass(caretUp);
            mainLinks.find("span").addClass(caretDown);

            // $(".caret.caret-img").css("background-image").replace(/\"/g, "") == "url(" +settings.caretArrows[0].downUrl+ ")"

            // Icon Caret toggling
            if (mainLinksDataAttribute[i] == iDofSubMenus[findPositionOfSubmenus] && !$(subMenu[findPositionOfSubmenus]).hasClass("active")) {

              subMenu.removeClass("active");
              $(subMenu[findPositionOfSubmenus]).addClass("active");

              $(this).find("span").removeClass(caretDown);
              $(this).find("span").addClass(caretUp);
            }
            else {
                $(subMenu[findPositionOfSubmenus]).removeClass("active");

                $(this).find("span").removeClass(caretUp);
                $(this).find("span").addClass(caretDown);
            }

            // Sets every links default behavour for image caret except currently clicked
            if ($(".menu-dropdown").find(".menu-item-wrapper").hasClass("active")) {
              $(".mega-menu span.caret").addClass("down");
              $(".mega-menu span.caret").css({"background-image" : "url(" +settings.caretArrows[0].downUrl+ ")"});
            }

            // Image caret toggling
            if (imageCaret.hasClass("down")) {
              imageCaret.removeClass("down");
              imageCaret.addClass("up");
              imageCaret.css({"background-image" : "url(" +settings.caretArrows[0].upUrl+ ")"});
              // console.log(imageCaret[0].className);
            }
            else {
              imageCaret.removeClass("up");
              imageCaret.addClass("down");
              imageCaret.css({"background-image" : "url(" +settings.caretArrows[0].downUrl+ ")"});
              // console.log(imageCaret[0].className);
            }

            // Active link Highlight
            if (mainLinks.find("span").hasClass("caret-up") || $(this).find("span").hasClass("up") && !$(this).hasClass("highlight") ) {
              $(this).addClass("highlight");

              // Changing Highlight Color
              $(this).css({"border-color": settings.highlightColor});
            }

            // Normal Dropdown Positioning
            if (subMenu.hasClass("dropdown") ) {
              var dropDownforClickedLink = $("#"+iDofSubMenus[findPositionOfSubmenus]+".dropdown");
              dropDownforClickedLink.css({"left": $(this).offset().left })
            }

          });

        });


        // If Follow highlighter set true
        if (settings.followingHighlighter === true) {

          // Add a element with class first
          $(".main-links ul").append('<div class="follow-highlighter"></div>');

          // While Mouser Hover
          mainLinks.mouseover(function(e,i){

            var getCurrentElementMousePos = e.pageX - $(this).offset().left;
            var currentElementHalfWidth = $(this).innerWidth() / 2;

            $(".follow-highlighter").css({"display": "block"});
            $(".main-links ul").addClass("follow-highlighter-enabled")
            $(".follow-highlighter").css({"width" : $(this).innerWidth() , "left" : $(this).offset().left , "background-color": settings.highlightColor});

          });
        }

        // While Mouse Unhover
        $(".main-links ul").each(function(){
          $(this).mouseleave(function(){
            $(".main-links ul").removeClass("follow-highlighter-enabled");
            $(".follow-highlighter").css({"display": "none", "left" : $(mainLinks[0]).offset().left});
          })
        })

        // If no need of highighter
        if (settings.highlighter === false) {
          $(".main-links").addClass("disable-highlighter");
          $(".follow-highlighter").remove();
        }

        // If Text Highlighter Set to true
        if (settings.textHighlighter === true) {
          $(".main-links").addClass("text-highlighter");
        }
        // Text Highlighter Color
        if (settings.textHighlighterColor) {
          $("style").append(`.mega-menu .text-highlighter.main-links ul li a:hover{
            color:` + settings.textHighlighterColor +
          `}`);
        }

          // Get menus IDs
          subMenu.each(function(i){
            iDofSubMenus.push($(subMenu[i]).attr("id"));
          });

          // Add Animations
          if (settings.animation === true) {
            subMenu.addClass(settings.animationClass);
          }

          // Mobile Nav icon
          $(".mobile-nav-icon a").click(function(){
            $(".follow-highlighter").remove();
            if ($(".main-links").hasClass("active")) {
              $(".main-links").removeClass("active");
              $(".menu-dropdown").hide();
            }
            else {
              $(".main-links").addClass("active");
              $(".menu-dropdown").show();
            }
          });


          // Responsive options

          $(".menu-item-wrapper").prepend('<a href="#" class="back-link">Back</a>');

          $(window).resize(function() {
           if ($(window).width() < 768) {

             // Get main-links marging top as height of mobile-nav-icon
             if ($(".mega-menu").hasClass("sticky-header")) {
               $(".mega-menu").addClass("responsive-menu");
               $(".main-links").css({"margin-top": $(".mobile-nav-icon").outerHeight()+"px"});

               // $(".menu-item-wrapper").prepend('<a href="#" class="back-link">Back</a>');

             }

           } else {
             $(".main-links").css({"margin-top": "0px"});
             // $(".back-link").remove();
            // $(".mega-menu").removeClass("responsive-menu");
           }
          });

          ///$(document).ready(
          ///  function(){
          ///    $(".back-link").on('click', function(){
          ///      mainLinks.trigger('click');
         ///       $(mainLinks[mainLinks.length - 1]).trigger('click');
          ///    });
          ///  }
          ///)
    }

  });


  plugins.register(MegaMenu);

  return menus.MegaMenu = MegaMenu;	
});
define('skylark-domx-plugins-menus/nav-menu',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'

  var NavMenu = Menu.inherit({
    klassName : "NavMenu",

    pluginName : "lark.menus.nav",

    options : {
      item : {
        templates : {
        } 
      }
    },

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        if (this.options.data.items) {
          this.resetItems(this.options.data.items);
        }

        lists.multitier(elm, {
          togglable : false,

          classes : {
            active :  this.options.item.classes.active  // active
           /// collapse : "collapse",
           /// in : "in",
          },

          selectors : {
            item : this.options.item.selectors.general,          //li
            sublist : this.options.submenu.selectors.descendant, //"ul",
            hasSublist : this.options.item.selectors.hasChildren//":has(ul)",
            ///handler : " > a"
          },

          multiExpand : false

        });
    },

    resetItems : function(itemsData) {
      let self = this;

      function renderItem(itemData,$container) {
        let $item;
        if (itemData.children) {
          $item = self.renderHasChildrenMenuItem(itemData);
        } else {
          $item = self.renderGeneralMenuItem(itemData);
        }

        $item.data("item",itemData);
        $container.append($item)

        if (itemData.children) {
          let $childrenContainer = $item.find(self.options.submenu.selectors.children);
          itemData.children.forEach((childItemData) => {
            renderItem(childItemData,$childrenContainer);            
          });
        }
      }
        
      let $itemsContainer = this.$(this.options.selectors.container)

      itemsData.forEach((itemData)=>{
        renderItem(itemData,$itemsContainer);
      });
    }

  });


  plugins.register(NavMenu);

  return menus.NavMenu = NavMenu;	
});
 define('skylark-domx-plugins-menus/tree-menu',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu",
  "skylark-domx-plugins-toggles"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'

  var TreeMenu = Menu.inherit({
    klassName : "Tree",

    pluginName : "lark.menus.tree",

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        lists.multitier(elm,langx.mixin({
          hide : function($el) {
            $el.plugin("lark.toggles.collapse").hide();
          },
          toggle : function($el) {
            $el.plugin("lark.toggles.collapse").toggle();
          }
        },this.options));
    }

  });


  plugins.register(TreeMenu);

  return menus.TreeMenu = TreeMenu;	
});
define('skylark-domx-plugins-menus/popup-menu',[
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

define('skylark-domx-plugins-menus/main',[
    "./menus",
    "./accordion-menu",
    "./cascade-menu",
    "./mega-menu",
    "./nav-menu",
    "./tree-menu",
    "./popup-menu"
], function(menus) {
    return menus;
});
define('skylark-domx-plugins-menus', ['skylark-domx-plugins-menus/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-menus.js.map
