define([
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins",
    "./interact",
    "./ddmanager"
], function(langx, noder, datax, finder, geom, eventer, styler, plugins, interact,manager) {
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height;


    var Droppable = plugins.Plugin.inherit({
        klassName: "Droppable",

        pluginName : "lark.droppable",

        options : {
            draggingClass : "dragging"
        },

        _construct: function(elm, options) {
            this.overrided(elm,options);

            var self = this,
                options = self.options,
                draggingClass = options.draggingClass,
                hoverClass,
                activeClass,
                acceptable = true;

            ["started", "entered", "leaved", "dropped", "overing"].forEach(function(eventName) {
                if (langx.isFunction(options[eventName])) {
                    self.on(eventName, options[eventName]);
                }
            });

            eventer.on(elm, {
                "dragover": function(e) {
                    e.stopPropagation()

                    if (!acceptable) {
                        return
                    }

                    var e2 = eventer.create("overing", {
                        overElm: e.target,
                        transfer: manager.draggingTransfer,
                        acceptable: true
                    });
                    self.trigger(e2);

                    if (e2.acceptable) {
                        e.preventDefault() // allow drop

                        e.dataTransfer.dropEffect = "copyMove";
                    }

                },

                "dragenter": function(e) {
                    var options = self.options,
                        elm = self._elm;

                    var e2 = eventer.create("entered", {
                        transfer: manager.draggingTransfer
                    });

                    self.trigger(e2);

                    e.stopPropagation()

                    if (hoverClass && acceptable) {
                        styler.addClass(elm, hoverClass)
                    }
                },

                "dragleave": function(e) {
                    var options = self.options,
                        elm = self._elm;
                    if (!acceptable) return false

                    var e2 = eventer.create("leaved", {
                        transfer: manager.draggingTransfer
                    });

                    self.trigger(e2);

                    e.stopPropagation()

                    if (hoverClass && acceptable) {
                        styler.removeClass(elm, hoverClass);
                    }
                },

                "drop": function(e) {
                    var options = self.options,
                        elm = self._elm;

                    eventer.stop(e); // stops the browser from redirecting.

                    if (!manager.dragging) return

                    // manager.dragging.elm.removeClass('dragging');

                    if (hoverClass && acceptable) {
                        styler.addClass(elm, hoverClass)
                    }

                    var e2 = eventer.create("dropped", {
                        transfer: manager.draggingTransfer
                    });

                    self.trigger(e2);

                    manager.end(true)
                }
            });

            manager.on("dndStarted", function(e) {
                var e2 = eventer.create("started", {
                    transfer: manager.draggingTransfer,
                    acceptable: false
                });

                self.trigger(e2);

                acceptable = e2.acceptable;
                hoverClass = e2.hoverClass;
                activeClass = e2.activeClass;

                if (activeClass && acceptable) {
                    styler.addClass(elm, activeClass);
                }

            }).on("dndEnded", function(e) {
                var e2 = eventer.create("ended", {
                    transfer: manager.draggingTransfer,
                    acceptable: false
                });

                self.trigger(e2);

                if (hoverClass && acceptable) {
                    styler.removeClass(elm, hoverClass);
                }
                if (activeClass && acceptable) {
                    styler.removeClass(elm, activeClass);
                }

                acceptable = false;
                activeClass = null;
                hoverClass = null;
            });

        }
    });

    plugins.register(Droppable,"droppable");

    return interact.Droppable = Droppable;
});