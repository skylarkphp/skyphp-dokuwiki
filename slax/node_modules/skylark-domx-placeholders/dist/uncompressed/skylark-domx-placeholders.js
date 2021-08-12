/**
 * skylark-domx-placeholders - The skylark placeholders library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
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

define('skylark-domx-placeholders/placeholders',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-data"
], function(skylark,langx,datax) {
	const dataSpaceStyle = "placeholder-style";

    function placeholders() {
        return placeholders;
    }


	function saveStyle(elm) {
		datax.data(elm, dataSpaceStyle, elm.style.cssText );
	}

	function restoreStyle(elm) {
		elm.style.cssText = datax.data(elm,dataSpaceStyle) || "";
		datax.removeData(elm, dataSpaceStyle );
	}

	langx.mixin(placeholders,{
		saveStyle,
		restoreStyle
	});

    return skylark.attach("domx.placeholders", placeholders);
});
define('skylark-domx-placeholders/create',[
	"skylark-domx-styler",
	"skylark-domx-noder",
	"skylark-domx-geom",
	"skylark-domx-data",
	"./placeholders"
],function(styler,noder,geom,datax,placeholders){
	// Creates a placeholder element so that the original element can be made absolute
	function createPlaceholder( elm ) {
		var placeholder,
			cssPosition = styler.css(elm,"position" ),
			position = geom.relativePosition(elm);

		// Lock in margins first to account for form elements, which
		// will change margin if you explicitly set height
		// see: http://jsfiddle.net/JZSMt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
		// Support: Safari
		styler.css(elm, styler.css(elm,["marginTop","marginBottom","marginLeft", "marginRight"]));
		geom.size(elm,geom.size(elm));

		if ( /^(static|relative)/.test( cssPosition ) ) {
			cssPosition = "absolute";

			placeholder = noder.createElement(elm.nodeName);

			styler.css(placeholder,{
				// Convert inline to inline block to account for inline elements
				// that turn to inline block based on content (like img)
				display: /^(inline|ruby)/.test( styler.css(elm,"display" ) ) ?
					"inline-block" :
					"block",
				visibility: "hidden"
			});

			// Margins need to be set to account for margin collapse
			styler.css(placeholder, styler.css(elm,["marginTop","marginBottom","marginLeft", "marginRight","float"]));

			datax.data(elm, "placeholder", placeholder );

			geom.size(placeholder,geom.size(elm));

			noder.after(elm,placeholder);

		}

		styler.css(elm, {
			position: cssPosition,
			left: position.left,
			top: position.top
		} );

		return placeholder;
	}

	return placeholders.create = createPlaceholder;

});
define('skylark-domx-placeholders/remove',[
	"skylark-domx-noder",
	"skylark-domx-data",
	"./placeholders"
],function(noder,datax,placeholders){

	function removePlaceholder( elm ) {
		var dataKey = "placeholder",
			placeholder = datax.data(elm, dataKey );

		if ( placeholder ) {
			noder.remove(placeholder);
			datax.removeData(elm,dataKey);
		}
	}

	return placeholders.remove = removePlaceholder;
});
define('skylark-domx-placeholders/cleanup',[
	"skylark-domx-styler",
	"skylark-domx-noder",
	"skylark-domx-geom",
	"./placeholders",
	"./remove"
],function(styler,noder,geom,placeholders,removePlaceholder){
	// Removes a placeholder if it exists and restores
	// properties that were modified during placeholder creation
	function cleanup( elm ) {
		placeholders.restoreStyle(elm);
		removePlaceholder(elm );
	}

	return placeholders.cleanup = cleanup;
});
define('skylark-domx-placeholders/main',[
	"./placeholders",
	"./create",
	"./remove",
	"./cleanup"
],function(placeholders){
	return placeholders;
});
define('skylark-domx-placeholders', ['skylark-domx-placeholders/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-placeholders.js.map
