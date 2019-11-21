define([
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-query",
    "skylark-domx-plugins",
    "./interact",
    "./Movable"
],function(langx,noder,datax,finder,geom,eventer,styler,$,plugins,interact,Movable){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;


    var Resizable = plugins.Plugin.inherit({
        klassName: "Resizable",

        "pluginName" : "lark.resizable",
        
        options : {
            // prevents browser level actions like forward back gestures
            touchActionNone: true,

            direction : {
                top: false, 
                left: false, 
                right: true, 
                bottom: true
            },
            // selector for handle that starts dragging
            handle : {
                border : true,
                grabber: "",
                selector: true
            }
        },

        _construct :function (elm, options) {
            this.overrided(elm,options);


            options = this.options;
            var handle = options.handle || {},
                handleEl,
                direction = options.direction,
                startSize,
                currentSize,
                startedCallback = options.started,
                movingCallback = options.moving,
                stoppedCallback = options.stopped;

            if (langx.isString(handle)) {
                handleEl = finder.find(elm,handle);
            } else if (langx.isHtmlNode(handle)) {
                handleEl = handle;
            }
            Movable(handleEl,{
                auto : false,
                started : function(e) {
                    startSize = geom.size(elm);
                    if (startedCallback) {
                        startedCallback(e);
                    }
                },
                moving : function(e) {
                    currentSize = {
                    };
                    if (direction.left || direction.right) {
                        currentSize.width = startSize.width + e.deltaX;
                    } else {
                        currentSize.width = startSize.width;
                    }

                    if (direction.top || direction.bottom) {
                        currentSize.height = startSize.height + e.deltaY;
                    } else {
                        currentSize.height = startSize.height;
                    }

                    geom.size(elm,currentSize);

                    if (movingCallback) {
                        movingCallback(e);
                    }
                },
                stopped: function(e) {
                    if (stoppedCallback) {
                        stoppedCallback(e);
                    }                
                }
            });
            
            this._handleEl = handleEl;
        },

        // destroys the dragger.
        remove: function() {
            eventer.off(this._handleEl);
        }
    });

    plugins.register(Resizable,"resizable");

    return interact.Resizable = Resizable;
});
