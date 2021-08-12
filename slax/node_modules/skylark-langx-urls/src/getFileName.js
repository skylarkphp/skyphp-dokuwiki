   define([
    './urls'
], function (urls) {
    'use strict';

    function getFileName (url) {
        var fileName = url.split('/').pop() || "";
        return fileName;
    }

    return urls.getFileName = getFileName;

});