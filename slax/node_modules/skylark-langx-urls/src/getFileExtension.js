define([
    './urls'
], function (urls) {
    'use strict';

    const getFileExtension = function (path) {
        if (typeof path === 'string') {
            const splitPathRe = /^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/;
            const pathParts = splitPathRe.exec(path);
            if (pathParts) {
                return pathParts.pop().toLowerCase();
            }
        }
        return '';
    };

    return urls.getFileExtension = getFileExtension;

});