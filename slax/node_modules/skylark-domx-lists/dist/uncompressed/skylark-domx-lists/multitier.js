define([
	"skylark-langx",
	"skylark-domx-query",
	"./lists"
],function(langx,$,lists){
  'use strict'

	function multitier(elm,options) {
		options = langx.mixin({

			classes : {
				active : "active",
				collapse : "collapse",
				in : "in",
			},

			selectors : {
				item : "li",                   // ".list-group-item"
				sublist : "ul",  // "> .list-group"
				hasSublist : ":has(ul)",
				handler : " > a"
			},


			mode   : "",  // "tree" or "accordion" or "popover"

			levels : 2,

			togglable : false,
			multiExpand : false,

			/*
			show : function($el) {
				$el.show();
			},

			hide : function($el) {
				//$el.hide();
				$el.add
			},

			toggle : function($el) {
				$el.toggle();
			}
			*/
		},options,true);

    var itemSelector = options.selectors.item,
        $items = $(itemSelector,elm),

        activeClass = options.classes.active,
        activeSelector = "." + activeClass,

		multitierMode = options.mode,

        sublistSelector = options.selectors.sublist,  
        togglable = options.togglable,   
        multiExpand = options.multiExpand,
        handlerSelector = options.selectors.handler,

        collapseClass = options.classes.collapse,
        inClass = options.classes.in,
        inSelector = "." + inClass,

        show = options.show || function($el) {
        	$el.addClass(inClass);
        },
        hide = options.hide || function($el) {
        	$el.addClass(collapseClass).removeClass(inClass);

        },
        toggle = options.toggle || function($el) {
			if ($el.hasClass(inClass)) {
				hide($el);
			} else {
				show($el);
			}
        };

     $items.find(handlerSelector).on("click.multitier", function(e) {
          e.preventDefault();

          let $children,
          	  $clickedItem =  $(this).closest(itemSelector);

          if (!multiExpand) {
              ///langx.scall($(this).closest(itemSelector).siblings().removeClass("active").children(sublistSelector+".in").plugin("domx.toggles.collapse"),"hide");
              //$clildren = $(this).closest(itemSelector).siblings().removeClass(activeClass).children(sublistSelector+"."+options.classes.in);
              $children = $clickedItem.siblings().removeClass(activeClass).children(sublistSelector);
              if ($children) {
	              hide($children);
              }
          }
          //$(this).closest(itemSelector).toggleClass(activeClass).children(sublistSelector).plugin("domx.toggles.collapse").toggle();
          let isActiveItem = $clickedItem.hasClass(activeClass);
          if (!isActiveItem || togglable) {
	          $children = $clickedItem.children(options.selectors.sublist);
	          if (isActiveItem) {
				$clickedItem.removeClass(activeClass);
				hide($children)  	
	          } else {
				$clickedItem.addClass(activeClass);
				show($children)  	
	          }

          }
      });

      hide($items.has(sublistSelector).children(sublistSelector));

      show($items.filter(activeSelector).has(sublistSelector).children(sublistSelector))


	}

	return lists.multitier = multitier
});