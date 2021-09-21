define([
    './urls'
], function (urls) {
    'use strict';

    const digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function createObjectURL(data, contentType, forceDataSchema = false) {
        if (!forceDataSchema && URL.createObjectURL) {
            const blob = new Blob([data], { type: contentType });
            return URL.createObjectURL(blob);
        }
        let buffer = `data:${ contentType };base64,`;
        for (let i = 0, ii = data.length; i < ii; i += 3) {
            const b1 = data[i] & 255;
            const b2 = data[i + 1] & 255;
            const b3 = data[i + 2] & 255;
            const d1 = b1 >> 2, d2 = (b1 & 3) << 4 | b2 >> 4;
            const d3 = i + 1 < ii ? (b2 & 15) << 2 | b3 >> 6 : 64;
            const d4 = i + 2 < ii ? b3 & 63 : 64;
            buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
        }
        return buffer;
    };


    return urls.createObjectURL = createObjectURL;

});

