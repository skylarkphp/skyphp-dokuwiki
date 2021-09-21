define([
    './urls'
], function (urls) {
    'use strict';

    const getAbsoluteUrl = function (url) {
        if (!url.match(/^https?:\/\//)) {
            const div = document.createElement('div');
            div.innerHTML = `<a href="${ url }">x</a>`;
            url = div.firstChild.href;
        }
        return url;
    };

    return urls.getAbsoluteUrl = getAbsoluteUrl;

});