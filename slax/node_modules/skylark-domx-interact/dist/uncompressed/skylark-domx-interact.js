/**
 * skylark-domx-interact - The interact features enhancement for dom.
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
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-interact/interact',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark, langx) {

	return skylark.attach("domx.interact",{});
});


define('skylark-domx-interact/ddmanager',[
    "./interact",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler"
], function(interact, langx, noder, datax, finder, geom, eventer, styler) {
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height;


    var DndManager = interact.DndManager = langx.Evented.inherit({
        klassName: "DndManager",

        init: function() {

        },

        prepare: function(draggable) {
            var e = eventer.create("preparing", {
                dragSource: draggable.dragSource,
                dragHandle: draggable.dragHandle
            });
            draggable.trigger(e);
            draggable.dragSource = e.dragSource;
        },

        start: function(draggable, event) {

            var p = geom.pagePosition(draggable.dragSource);
            this.draggingOffsetX = parseInt(event.pageX - p.left);
            this.draggingOffsetY = parseInt(event.pageY - p.top)

            var e = eventer.create("started", {
                elm: draggable.elm,
                dragSource: draggable.dragSource,
                dragHandle: draggable.dragHandle,
                ghost: null,

                transfer: {}
            });

            draggable.trigger(e);


            this.dragging = draggable;

            if (draggable.draggingClass) {
                styler.addClass(draggable.dragSource, draggable.draggingClass);
            }

            this.draggingGhost = e.ghost;
            if (!this.draggingGhost) {
                this.draggingGhost = draggable.elm;
            }

            this.draggingTransfer = e.transfer;
            if (this.draggingTransfer) {

                langx.each(this.draggingTransfer, function(key, value) {
                    event.dataTransfer.setData(key, value);
                });
            }

            event.dataTransfer.setDragImage(this.draggingGhost, this.draggingOffsetX, this.draggingOffsetY);

            event.dataTransfer.effectAllowed = "copyMove";

            var e1 = eventer.create("dndStarted", {
                elm: e.elm,
                dragSource: e.dragSource,
                dragHandle: e.dragHandle,
                ghost: e.ghost,
                transfer: e.transfer
            });

            this.trigger(e1);
        },

        over: function() {

        },

        end: function(dropped) {
            var dragging = this.dragging;
            if (dragging) {
                if (dragging.draggingClass) {
                    styler.removeClass(dragging.dragSource, dragging.draggingClass);
                }
            }

            var e = eventer.create("dndEnded", {});
            this.trigger(e);


            this.dragging = null;
            this.draggingTransfer = null;
            this.draggingGhost = null;
            this.draggingOffsetX = null;
            this.draggingOffsetY = null;
        }
    });

    var manager = new DndManager();


    return manager;
});
define('skylark-domx-interact/Draggable',[
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
define('skylark-domx-interact/Droppable',[
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
define('skylark-domx-interact/Movable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins",
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

        pluginName : "lark.movable",


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

            options = this.options;
            var handleEl = options.handle || elm,
                auto = options.auto === false ? false : true,
                constraints = options.constraints,
                overlayDiv,
                doc = options.document || document,
                downButton,
                start,
                stop,
                drag,
                startX,
                startY,
                originalPos,
                size,
                startedCallback = options.started,
                movingCallback = options.moving,
                stoppedCallback = options.stopped,

                start = function(e) {
                    var docSize = geom.getDocumentSize(doc),
                        cursor;

                    updateWithTouchData(e);

                    e.preventDefault();
                    downButton = e.button;
                    //handleEl = getHandleEl();
                    startX = e.screenX;
                    startY = e.screenY;

                    originalPos = geom.relativePosition(elm);
                    size = geom.size(elm);

                    // Grab cursor from handle so we can place it on overlay
                    cursor = styler.css(handleEl, "curosr");

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

define('skylark-domx-interact/Resizable',[
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

define('skylark-domx-interact/Selectable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-query",
    "./interact",
    "./Movable"
],function(langx,noder,datax,geom,eventer,styler,$,interact,Movable){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;



    var options = {
        // Function which returns custom X and Y coordinates of the mouse
            mousePosFetcher: null,
            // Indicates custom target updating strategy
            updateTarget: null,
            // Function which gets HTMLElement as an arg and returns it relative position
            ratioDefault: 0,
            posFetcher: null,

            started: null,
            moving: null,
            ended: null,

            // Resize unit step
            step: 1,

            // Minimum dimension
            minDim: 32,

            // Maximum dimension
            maxDim: '',

            // Unit used for height resizing
            unitHeight: 'px',

            // Unit used for width resizing
            unitWidth: 'px',

            // The key used for height resizing
            keyHeight: 'height',

            // The key used for width resizing
            keyWidth: 'width',

            // If true, will override unitHeight and unitWidth, on start, with units
            // from the current focused element (currently used only in SelectComponent)
            currentUnit: 1,

            // Handlers
            direction : {
                tl: 1, // Top left
                tc: 1, // Top center
                tr: 1, // Top right
                cl: 1, // Center left
                cr: 1, // Center right
                bl: 1, // Bottom left
                bc: 1, // Bottom center
                br: 1 // Bottom right,
            },
            handler : {
                border : true,
                grabber: "",
                selector: true
            }
        } ,


        currentPos,
        startRect,
        currentRect,
        delta;

    var classPrefix = "",
        container,
        handlers,
        target,
        direction ={
            left : true,
            right : true,
            top : true,
            bottom : true
        },
        startSize,
        currentSize,

        startedCallback,
        resizingCallback,
        stoppedCallback;

    function init (options) {
        options = options || {};
        classPrefix = options.classPrefix || "";

        var appendTo = options.appendTo || document.body;
        container = noder.createElement('div',{
            "class" : classPrefix + 'resizer-c'
        });
        noder.append(appendTo,container);


        // Create handlers
        handlers = {};
        ['tl', 'tc', 'tr', 'cl', 'cr', 'bl', 'bc', 'br'].forEach(function(n) {
            return handlers[n] = noder.createElement("i",{
                    "class" : classPrefix + 'resizer-h ' + classPrefix + 'resizer-h-' + n,
                    "data-resize-handler" : n
                });
        });

        for (var n in handlers) {
            var handler = handlers[n];
            noder.append(container,handler);
            Movable(handler,{
                auto : false,
                started : started,
                moving : resizing,
                stopped : stopped
            })
        }
    }

    function started(e) {
        var handler = e.target;
        startSize = geom.size(target);
        if (startedCallback) {
            startedCallback(e);
        }
    }

    function resizing(e) {
        currentSize = {};

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

        geom.size(target,currentSize);
        geom.pageRect(container,geom.pageRect(target));

        if (resizingCallback) {
            resizingCallback(e);
        }

    }

    function stopped(e) {
        if (stoppedCallback) {
            stoppedCallback(e);
        }

    }

    function select(el,options) {
        // Avoid focusing on already focused element
        if (el && el === target) {
          return;
        } 

        target = el; 
        startDim = rectDim = startPos = null;

        geom.pageRect(container,geom.pageRect(target));
        styler.show(container);

    }


    function unselect(e) {
        if (container) {
            styler.hide(container);
        }
        target = null;
    }

    function isHandler(el) {
        if (handlers) {
            for (var n in handlers) {
              if (handlers[n] === el) return true;
            }                
        }
        return false;
    }


    function docs(el) {
        return [noder.ownerDoc(el), noder.doc()];
    }

    function selector(){
      return selector;
    }

    langx.mixin(selector, {
        init : init,

        select : select,

        unselect : unselect

    });

    return interact.Selectable = selector;
});

define('skylark-domx-interact/Sortable',[
    "./interact",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-query",
    "skylark-domx-plugins",
    "./Draggable",
    "./Droppable",
    "./Movable",
    "./Resizable"
],function(interact, langx,noder,datax,geom,eventer,styler,$,plugins,Draggable,Droppable, Movable,Resizable){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;

    var Sorter = plugins.Plugin.inherit({
        "klassName" : "Sorter",

        enable : function() {

        },
        
        disable : function() {

        },

        destory : function() {

        }
    });


    var dragging, placeholders = $();


    var Sortable = plugins.Plugin.inherit({
        klassName: "Sortable",

        pluginName : "lark.sortable",
        
        options : {
            connectWith: false,
            placeholder: null,
            placeholderClass: 'sortable-placeholder',
            draggingClass: 'sortable-dragging',
            items : null
        },

        /*
         * @param {HTMLElement} container  the element to use as a sortable container
         * @param {Object} options  options object
         * @param {String} [options.items = ""] 
         * @param {Object} [options.connectWith =] the selector to create connected lists
         * @param {Object} [options
         * @param {Object} [options
         */
        _construct : function (container,options) {
            this.overrided(container,options);

            options = this.options;

            var isHandle, index, 
                $container = $(container), 
                $items = $container.children(options.items);
            var placeholder = $(options.placeholder || noder.createElement(/^(ul|ol)$/i.test(container.tagName) ? 'li' : 'div',{
                "class" : options.placeholderClass
            }));

            Draggable(container,{
                source : options.items,
                handle : options.handle,
                draggingClass : options.draggingClass,
                preparing : function(e) {
                    //e.dragSource = e.handleElm;
                },
                started :function(e) {
                    e.ghost = e.dragSource;
                    e.transfer = {
                        "text": "dummy"
                    };
                    index = (dragging = $(e.dragSource)).index();
                },
                ended : function(e) {
                    if (!dragging) {
                        return;
                    }
                    dragging.show();
                    placeholders.detach();
                    if (index != dragging.index()) {
                        dragging.parent().trigger('sortupdate', {item: dragging});
                    }
                    dragging = null;                
                }

            });

            
            Droppable(container,{
                started: function(e) {
                    e.acceptable = true;
                    e.activeClass = "active";
                    e.hoverClass = "over";
                },
                overing : function(e) {
                    if ($items.is(e.overElm)) {
                        if (options.forcePlaceholderSize) {
                            placeholder.height(dragging.outerHeight());
                        }
                        dragging.hide();
                        $(e.overElm)[placeholder.index() < $(e.overElm).index() ? 'after' : 'before'](placeholder);
                        placeholders.not(placeholder).detach();
                    } else if (!placeholders.is(e.overElm) && !$(e.overElm).children(options.items).length) {
                        placeholders.detach();
                        $(e.overElm).append(placeholder);
                    }                
                },
                dropped : function(e) {
                    placeholders.filter(':visible').after(dragging);
                    dragging.show();
                    placeholders.detach();

                    dragging = null;                
                  }
            });

            $container.data('items', options.items)
            placeholders = placeholders.add(placeholder);
            if (options.connectWith) {
                $(options.connectWith).add(this).data('connectWith', options.connectWith);
            }
            
        }
    });

    plugins.register(Sortable,"sortable");

    return interact.Sortable = Sortable;
});

define('skylark-domx-interact/main',[
    "./interact",
    "./Draggable",
    "./Droppable",
    "./Movable",
    "./Resizable",
    "./Selectable",
    "./Sortable"
], function(interact) {
    return interact;
})
;
define('skylark-domx-interact', ['skylark-domx-interact/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-interact.js.map
