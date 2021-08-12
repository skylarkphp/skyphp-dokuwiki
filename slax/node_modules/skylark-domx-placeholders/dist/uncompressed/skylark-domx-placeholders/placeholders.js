define([
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