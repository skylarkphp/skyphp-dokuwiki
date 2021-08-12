define([
    "../browser"
],function(browser){

    const FullscreenApi = { 
        prefixed: true 
    };

    const apiMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror',
            'fullscreen'
        ],
        [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
            '-webkit-full-screen'
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror',
            '-moz-full-screen'
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError',
            '-ms-fullscreen'
        ]
    ];
    const specApi = apiMap[0];
    let browserApi;
    for (let i = 0; i < apiMap.length; i++) {
        if (apiMap[i][1] in document) {
            browserApi = apiMap[i];
            break;
        }
    }
    if (browserApi) {
        for (let i = 0; i < browserApi.length; i++) {
            FullscreenApi[specApi[i]] = browserApi[i];
        }
        FullscreenApi.prefixed = browserApi[0] !== specApi[0];

        browser.requestFullscreen = function() {
            return document.body[FullscreenApi["requestFullscreen"]].apply(this,arguments);
        };
        browser.exitFullscreen = function() {
            return document[FullscreenApi["exitFullscreen"]].apply(this,arguments);
        };

        browser.support.fullscreen = FullscreenApi;
    } else {
        browser.support.fullscreen = null;
    }

    return browser.support.fullscreen;
});