   define([
    './urls'
], function (urls) {
    'use strict';

    function getFileName (url) {
        ///var fileName = url.split('/').pop() || "";
        ///return fileName;
        const anchor = url.indexOf('#');
        const query = url.indexOf('?');
        const end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);         
    }




    return urls.getFileName = getFileName;

});