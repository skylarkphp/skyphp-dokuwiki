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



    var Draggable = plugins.Plugin.inherit({
        klassName: "Draggable",
        
        pluginName : "lark.draggable",

        options : {
            draggingClass : "dragging"
        },

        _construct: function(elm, options) {
            this.overrided(elm,options);

            var self = this,
                options = this.options;

            self.draggingClass = options.draggingClass;

            ["preparing", "started", "ended", "moving"].forEach(function(eventName) {
                if (langx.isFunction(options[eventName])) {
                    self.on(eventName, options[eventName]);
                }
            });


            eventer.on(elm, {
                "mousedown": function(e) {
                    var options = self.options;
                    if (options.handle) {
                        self.dragHandle = finder.closest(e.target, options.handle);
                        if (!self.dragHandle) {
                            return;
                        }
                    }
                    if (options.source) {
                        self.dragSource = finder.closest(e.target, options.source);
                    } else {
                        self.dragSource = self._elm;
                    }
                    manager.prepare(self);
                    if (self.dragSource) {
                        datax.attr(self.dragSource, "draggable", 'true');
                    }
                },

                "mouseup": function(e) {
                    if (self.dragSource) {
                        //datax.attr(self.dragSource, "draggable", 'false');
                        self.dragSource = null;
                        self.dragHandle = null;
                    }
                },

                "dragstart": function(e) {
                    datax.attr(self.dragSource, "draggable", 'false');
                    manager.start(self, e);
                },

                "dragend": function(e) {
                    eventer.stop(e);

                    if (!manager.dragging) {
                        return;
                    }

                    manager.end(false);
                }
            });

        }

    });

    plugins.register(Draggable,"draggable");

    return interact.Draggable = Draggable;
});