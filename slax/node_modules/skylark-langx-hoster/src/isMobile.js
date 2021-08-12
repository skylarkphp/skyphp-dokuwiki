define([
    "./hoster",
    "./detects/mobile"
],function(hoster,detectMobile){
    if (hoster.isMobile == undefined) {
        hoster.isMobile = detectMobile();
    }

    return hoster.isMobile;
});
