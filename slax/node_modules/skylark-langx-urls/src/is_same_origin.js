define([
    './urls'
], function (urls) {
    'use strict';

    function isSameOrigin(baseUrl, otherUrl) {
        let base;
        try {
            base = new URL(baseUrl);
            if (!base.origin || base.origin === 'null') {
                return false;
            }
        } catch (e) {
            return false;
        }
        const other = new URL(otherUrl, base);
        return base.origin === other.origin;
    }

    return urls.isSameOrigin = isSameOrigin;

});
