/**
 * skylark-domx-plugins-interact - The interact features enhancement for dom.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-plugins-interact/interact',[
    "skylark-domx-plugins-base/plugins"
], function(plugins) {
    'use strict';

	return plugins.interact = {};
});

define('skylark-domx-plugins-interact/movable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins-base",
    "./interact"
],function(langx,noder,datax,geom,eventer,styler,plugins,interact){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;

    var Movable = plugins.Plugin.inherit({
        klassName: "Movable",

        pluginName : "lark.interact.movable",


        _construct : function (elm, options) {
            this.overrided(elm,options);



            function updateWithTouchData(e) {
                var keys, i;

                if (e.changedTouches) {
                    keys = "screenX screenY pageX pageY clientX clientY".split(' ');
                    for (i = 0; i < keys.length; i++) {
                        e[keys[i]] = e.changedTouches[0][keys[i]];
                    }
                }
            }

            function updateWithMoveData(e) {
                e.movable = self;
                e.moveEl = elm;
                e.handleEl = handleEl;
            }

            options = this.options;
            var self = this,
                handleEl = options.handle || elm,
                auto = options.auto === false ? false : true,
                constraints = options.constraints,
                overlayDiv,
                doc = options.document || document,
                downButton,
                start,
                stop,
                startX,
                startY,
                originalPos,
                drag,
                size,
                startingCallback = options.starting,
                startedCallback = options.started,
                movingCallback = options.moving,
                stoppedCallback = options.stopped,

                start = function(e) {
                    var docSize = geom.getDocumentSize(doc),
                        cursor;

                    updateWithTouchData(e);
                    updateWithMoveData(e);

                    if (startingCallback) {
                        var ret = startingCallback(e)
                        if ( ret === false) {
                            return;
                        } else if (langx.isPlainObject(ret)) {
                            if (ret.constraints) {
                                constraints = ret.constraints;
                            }
                            if (ret.started) {
                                startedCallback = ret.started;
                            }
                            if (ret.moving) {
                                movingCallback = ret.moving;
                            }                            
                            if (ret.stopped) {
                                stoppedCallback = ret.stopped;
                            }     
                        }
                    }

                    e.preventDefault();

                    downButton = e.button;
                    //handleEl = getHandleEl();
                    startX = e.screenX;
                    startY = e.screenY;

                    originalPos = geom.relativePosition(elm);
                    size = geom.size(elm);

                    // Grab cursor from handle so we can place it on overlay
                    cursor = styler.css(handleEl, "cursor");

                    overlayDiv = noder.createElement("div");
                    styler.css(overlayDiv, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: docSize.width,
                        height: docSize.height,
                        zIndex: 0x7FFFFFFF,
                        opacity: 0.0001,
                        cursor: cursor
                    });
                    noder.append(doc.body, overlayDiv);

                    eventer.on(doc, "mousemove touchmove", move).on(doc, "mouseup touchend", stop);

                    if (startedCallback) {
                        startedCallback(e);
                    }
                },

                move = function(e) {
                    updateWithTouchData(e);
                    updateWithMoveData(e);

                    if (e.button !== 0) {
                        return stop(e);
                    }

                    e.deltaX = e.screenX - startX;
                    e.deltaY = e.screenY - startY;

                    if (auto) {
                        var l = originalPos.left + e.deltaX,
                            t = originalPos.top + e.deltaY;
                        if (constraints) {

                            if (l < constraints.minX) {
                                l = constraints.minX;
                            }

                            if (l > constraints.maxX) {
                                l = constraints.maxX;
                            }

                            if (t < constraints.minY) {
                                t = constraints.minY;
                            }

                            if (t > constraints.maxY) {
                                t = constraints.maxY;
                            }
                        }
                    }

                    geom.relativePosition(elm, {
                        left: l,
                        top: t
                    })

                    e.preventDefault();
                    if (movingCallback) {
                        movingCallback(e);
                    }
                },

                stop = function(e) {
                    updateWithTouchData(e);

                    eventer.off(doc, "mousemove touchmove", move).off(doc, "mouseup touchend", stop);

                    noder.remove(overlayDiv);

                    if (stoppedCallback) {
                        stoppedCallback(e);
                    }
                };

            eventer.on(handleEl, "mousedown touchstart", start);

            this._handleEl = handleEl;

        },

        remove : function() {
            eventer.off(this._handleEl);
        }
    });

    plugins.register(Movable,"movable");

    return interact.Movable = Movable;
});

define('skylark-domx-plugins-interact/resizable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-query",
    "skylark-domx-plugins-base",
    "./interact",
    "./movable"
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

        "pluginName" : "lark.interact.resizable",
        
        options : {
            // prevents browser level actions like forward back gestures
            touchActionNone: true,
            // selector for handle that starts dragging
            handle : {
                border : {
                    directions : {
                        top: true, //n
                        left: true, //w
                        right: true, //e
                        bottom: true, //s
                        topLeft : true, // nw
                        topRight : true, // ne
                        bottomLeft : true, // sw
                        bottomRight : true // se                         
                    },
                    classes : {
                        all : "resizable-handle",
                        top : "resizable-handle-n",
                        left: "resizable-handle-w",
                        right: "resizable-handle-e",
                        bottom: "resizable-handle-s", 
                        topLeft : "resizable-handle-nw", 
                        topRight : "resizable-handle-ne",
                        bottomLeft : "resizable-handle-sw",             
                        bottomRight : "resizable-handle-se"                         
                    }
                },
                grabber: {
                    selector : "",
                    direction : "bottomRight"
                },
                selector: true
            },

            constraints : {
                minWidth : null,
                minHeight : null,
                maxWidth : null,
                maxHeight : null
            }
        },

        _construct :function (elm, options) {
            this.overrided(elm,options);


            options = this.options;
            var handle = options.handle || {},
                constraints = options.constraints || {},
                startedCallback = options.started,
                movingCallback = options.moving,
                stoppedCallback = options.stopped;

            if (langx.isString(handle)) {
                handleEl = finder.find(elm,handle);
            } else if (langx.isHtmlNode(handle)) {
                handleEl = handle;
            }

            function handleResize(handleEl,dir) {
                let  startRect;

                Movable(handleEl,{
                    auto : false,
                    started : function(e) {
                        startRect = geom.relativeRect(elm);
                        if (startedCallback) {
                            startedCallback(e);
                        }
                    },
                    moving : function(e) {
                        currentRect = {
                        };
                        if (dir == "right" || dir == "topRight" || dir == "bottomRight" ) {
                            currentRect.width = startRect.width + e.deltaX;
                            if (constraints.minWidth && currentRect.width < constraints.minWidth) {
                                currentRect.width = constraints.minWidth;
                            }
                            if (constraints.maxWidth && currentRect.width > constraints.maxWidth) {
                                currentRect.width = constraints.maxWidth;
                            }
                        } 

                        if (dir == "bottom" || dir == "bottomLeft" || dir == "bottomRight" ) {
                            currentRect.height = startRect.height + e.deltaY;
                            if (constraints.minHeight && currentRect.height < constraints.minHeight) {
                                currentRect.height = constraints.minHeight;
                            }
                            if (constraints.maxHeight && currentRect.height > constraints.maxHeight) {
                                currentRect.height = constraints.maxHeight;
                            }
                        } 

                        if (dir == "left" || dir == "topLeft" || dir == "bottomLeft" ) {
                            currentRect.left = startRect.left + e.deltaX;
                            currentRect.width = startRect.width - e.deltaX;
                            if (constraints.minWidth && currentRect.width < constraints.minWidth) {
                                currentRect.left = currentRect.left + currentRect.width - constraints.minWidth;
                                currentRect.width = constraints.minWidth;
                            }
                            if (constraints.maxWidth && currentRect.width > constraints.maxWidth) {
                                currentRect.left = currentRect.left + currentRect.width - constraints.maxWidth;
                                currentRect.width = constraints.maxWidth;
                            }
                        } 

                        if (dir == "top" || dir == "topLeft" || dir == "topRight" ) {
                            currentRect.top = startRect.top + e.deltaY;
                            currentRect.height = startRect.height - e.deltaY;
                            if (constraints.minHeight && currentRect.height < constraints.minHeight) {
                                currentRect.top = currentRect.top + currentRect.height - constraints.minHeight;
                                currentRect.height = constraints.minHeight;
                            }
                            if (constraints.maxHeight && currentRect.height > constraints.maxHeight) {
                                currentRect.top = currentRect.top + currentRect.height - constraints.maxHeight;
                                currentRect.height = constraints.maxHeight;
                            }
                        } 

                        geom.relativeRect(elm,currentRect);

                        if (movingCallback) {
                            movingCallback(e);
                        }
                        eventer.resized(elm);

                    },
                    stopped: function(e) {
                        if (stoppedCallback) {
                            stoppedCallback(e);
                        }                
                    }
                });
            }

            if (handle && handle.border) {
                let borders = []
                for (var dir in handle.border.directions) {
                    if (handle.border.directions[dir]) {
                        let handleEl = noder.createElement("div",{
                            "className": handle.border.classes.all + " " + handle.border.classes[dir],
                            "direction" : dir
                        },elm);   
                        handleResize(handleEl,dir) ; 

                    }

                }
            }

            if (handle && handle.grabber && handle.grabber.selector) {
                 let handleEl = finder.find(elm,handle.grabber.selector);
                 handleResize(handleEl,handle.grabber.direction) ; 
            }

        },

        // destroys the dragger.
        remove: function() {
            eventer.off(this._handleEl);
        }
    });

    plugins.register(Resizable,"resizable");

    return interact.Resizable = Resizable;
});

define('skylark-domx-plugins-interact/rotatable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins-base",
    "./interact"
],function(langx,noder,datax,geom,eventer,styler,plugins,interact){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;



    function applyTranform(obj,tX,tY) {
        // Constrain the angle of camera (between 0 and 180)
        if (tY > 180) tY = 180;
        if (tY < 0) tY = 0;

        // Apply the angle
        obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
    }


    var Rotatable = plugins.Plugin.inherit({
        klassName: "Rotatable",

        pluginName : "lark.interact.rotatable",


        _construct : function (elm, options) {
            this.overrided(elm,options);


            options = this.options;
            var self = this,
                handleEl = options.handle || elm,
                overlayDiv,
                doc = options.document || document,
                downButton,
                start,
                stop,
                prevX,
                prevY,
                startingCallback = options.starting,
                startedCallback = options.started,
                movingCallback = options.moving,
                stoppedCallback = options.stopped,

                tX = 0,
                tY = 10,
                deltaX = 0,
                deltaY = 0,

                timer,

                start = function(e) {
                    if (e.pointerType=="mouse" &&  e.button !== 0) {
                        return stop(e);
                    }
                    
                    var docSize = geom.getDocumentSize(doc),
                        cursor;

                    if (startingCallback) {
                        var ret = startingCallback(e)
                        if ( ret === false) {
                            return;
                        } else if (langx.isPlainObject(ret)) {
                            if (ret.started) {
                                startedCallback = ret.started;
                            }
                            if (ret.moving) {
                                movingCallback = ret.moving;
                            }                            
                            if (ret.stopped) {
                                stoppedCallback = ret.stopped;
                            }     
                        }
                    }

                    e.preventDefault();

                    downButton = e.button;

                    //handleEl = getHandleEl();
                    prevX = e.clientX;
                    prevY = e.clientY;

                    // Grab cursor from handle so we can place it on overlay
                    cursor = styler.css(handleEl, "cursor");

                    overlayDiv = noder.createElement("div");
                    styler.css(overlayDiv, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: docSize.width,
                        height: docSize.height,
                        zIndex: 0x7FFFFFFF,
                        opacity: 0.0001,
                        cursor: cursor
                    });
                    noder.append(doc.body, overlayDiv);

                    clearInterval(timer);

                    eventer.on(doc, "pointermove", move).on(doc, "pointerup", stop);

                    if (startedCallback) {
                        startedCallback(e);
                    }
                },

                move = function(e) {


                    deltaX = e.deltaX = e.clientX - prevX;
                    deltaY = e.deltaY = e.clientY - prevY;

                    prevX = e.clientX;
                    prevY = e.clientY;


                    tX += deltaX * 0.1;
                    tY += deltaY * 0.1;
                    applyTranform(elm,tX,tY);

                    e.preventDefault();

                    if (movingCallback) {
                        movingCallback(e);
                    }
                },

                stop = function(e) { 
                    eventer.off(doc, "pointermove", move).off(doc, "pointerup", stop);

                    let deta

                    timer = setInterval(function() {
                        deltaX *= 0.95;
                        deltaY *= 0.95;
                        tX += deltaX * 0.1;
                        tY += deltaX * 0.1;
                        applyTranform(elm,tX,tY);

                        ///playSpin(false);
                        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
                          clearInterval(timer);
                          //playSpin(true);
                        }
                    }, 17);

                    noder.remove(overlayDiv);

                    if (stoppedCallback) {
                        stoppedCallback(e);
                    }
                };

            eventer.on(handleEl, "pointerdown", start);

            this._handleEl = handleEl;

        },

        remove : function() {
            eventer.off(this._handleEl);
        }
    });

    plugins.register(Rotatable,"rotatable");

    return interact.Rotatable = Rotatable;
});

define('skylark-domx-plugins-interact/scalable',[
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

define('skylark-domx-plugins-interact/main',[
    "./interact",
    "./movable",
    "./resizable",
    "./rotatable",
    "./rotatable",
    "./scalable"
], function(interact) {
    return interact;
})
;
define('skylark-domx-plugins-interact', ['skylark-domx-plugins-interact/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-interact.js.map
