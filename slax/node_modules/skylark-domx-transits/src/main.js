define([
	"./transits",
	"skylark-domx-velm",
	"skylark-domx-query",
    "./transit",
    "./bounce",
    "./emulateTransitionEnd",
    "./explode",
    "./fadeIn",
    "./fadeOut",
    "./fade",
    "./fadeToggle",
    "./hide",
    "./pulsate",
    "./shake",
    "./show",
    "./slide",
    "./slideDown",
    "./slideToggle",
    "./slideUp",
    "./throb",
    "./toggle"
],function(transits,velm,$){
    // from ./transits
    velm.delegate([
        "transit",
        "emulateTransitionEnd",
        "fadeIn",
        "fadeOut",
        "fade",
        "fadeToggle",
        "hide",
        "scrollToTop",
        "slideDown",
        "slideToggle",
        "slideUp",
        "show",
        "toggle"
    ], transits);

    $.fn.hide =  $.wraps.wrapper_every_act(transits.hide, transits);

    $.fn.transit = $.wraps.wrapper_every_act(transits.transit, transits);
    $.fn.emulateTransitionEnd = $.wraps.wrapper_every_act(transits.emulateTransitionEnd, transits);

    $.fn.show = $.wraps.wrapper_every_act(transits.show, transits);
    $.fn.hide = $.wraps.wrapper_every_act(transits.hide, transits);
    $.fn.toogle = $.wraps.wrapper_every_act(transits.toogle, transits);
    $.fn.fadeTo = $.wraps.wrapper_every_act(transits.fadeTo, transits);
    $.fn.fadeIn = $.wraps.wrapper_every_act(transits.fadeIn, transits);
    $.fn.fadeOut = $.wraps.wrapper_every_act(transits.fadeOut, transits);
    $.fn.fadeToggle = $.wraps.wrapper_every_act(transits.fadeToggle, transits);

    $.fn.slideDown = $.wraps.wrapper_every_act(transits.slideDown, transits);
    $.fn.slideToggle = $.wraps.wrapper_every_act(transits.slideToggle, transits);
    $.fn.slideUp = $.wraps.wrapper_every_act(transits.slideUp, transits);

	return transits;
});