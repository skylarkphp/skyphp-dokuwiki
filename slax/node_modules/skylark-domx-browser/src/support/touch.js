define([
	"../browser"
],function(browser){

    function supportTouch() {
        return !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
    }

    return browser.support.tocuh = supportTouch();
});