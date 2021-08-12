define([
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
