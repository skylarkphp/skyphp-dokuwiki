define([
    "./hoster",
    "./detects/browser"
],function(hoster,detectBrowser){
	if (hoster.isBrowser == undefined) {
		hoster.isBrowser = detectBrowser();
	}

    return hoster.isBrowser;
});
