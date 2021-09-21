define([
    './urls',
    "./parse-url"
], function (urls,parseUrl) {
    'use strict';

    const isCrossOrigin = function (url, winLoc = window.location) {
        const urlInfo = parseUrl(url);
        const srcProtocol = urlInfo.protocol === ':' ? winLoc.protocol : urlInfo.protocol;
        const crossOrigin = srcProtocol + urlInfo.host !== winLoc.protocol + winLoc.host;
        return crossOrigin;
    };

    return urls.isCrossOrigin = isCrossOrigin;

});