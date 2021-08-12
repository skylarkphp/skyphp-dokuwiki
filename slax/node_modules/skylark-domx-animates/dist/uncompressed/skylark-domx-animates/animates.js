define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-browser"
], function(skylark,langx,browser) {

    function animates() {
        return animates;
    }

    langx.mixin(animates, {
        off: false,
        speeds: {
            normal: 400,
            fast: 200,
            slow: 600
        },
        animationName : browser.normalizeCssProperty("animation-name"),
        animationDuration : browser.normalizeCssProperty("animation-duration"),
        animationDelay : browser.normalizeCssProperty("animation-delay"),
        animationTiming : browser.normalizeCssProperty("animation-timing-function"),
        animationEnd : browser.normalizeCssEvent('AnimationEnd'),

        animateBaseClass : "animated"
    });

    return skylark.attach("domx.animates", animates);
});