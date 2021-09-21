define([
    './urls'
], function (urls) {
    'use strict';

    function _isValidProtocol(url) {
        if (!url) {
            return false;
        }
        switch (url.protocol) {
        case 'http:':
        case 'https:':
        case 'ftp:':
        case 'mailto:':
        case 'tel:':
            return true;
        default:
            return false;
        }
    }
    function createValidAbsoluteUrl(url, baseUrl) {
        if (!url) {
            return null;
        }
        try {
            const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
            if (_isValidProtocol(absoluteUrl)) {
                return absoluteUrl;
            }
        } catch (ex) {
        }
        return null;
    }

    return urls.createValidAbsoluteUrl = createValidAbsoluteUrl;

});

