define([
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-query",
    "skylark-domx-plugins-base",
    "./interact"
],function(langx,noder,datax,geom,eventer,styler,$,plugins,interact){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;



    function applyTranform(elms,radius) {
        // Apply the angle
        $(elms).forEach(function(elm){
            let $elm = $(elm);
            var originalTransform = $elm.data("originalTransform");
            if (!originalTransform) {
                originalTransform = $elm.css("transform");
                $elm.data("originalTransform",originalTransform);
            }
            $elm.css("transform",originalTransform +" translateZ(" +  radius +"px");
        });
    }


    var Scalable = plugins.Plugin.inherit({
        klassName: "Scalable",

        pluginName : "lark.interact.scalable",


        _construct : function (elm, options) {
            this.overrided(elm,options);

            let radius = this.options.radius || 0,
                targets = this.options.targets || elm;

            eventer.on(elm,"mousewheel", function(e) {
                var d = e.wheelDelta / 20 || -e.detail;
                radius += d;
                applyTranform(targets,radius);
            });

            applyTranform(targets,radius);
        }
    });

    plugins.register(Scalable,"scalable");

    return interact.Scalable = Scalable;
});
