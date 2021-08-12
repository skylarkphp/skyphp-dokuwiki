/**
 * skylark-widgets-base - The skylark widget base library.
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

define('skylark-widgets-base/base',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("widgets.base",{
		"actions":{},
		"dnd" : {},
		"locales" : {},
		"mixins" : {},
		"panels" : {},
		"skins" : {}
	});
});
define('skylark-widgets-base/skins/SkinManager',[
],function(){	
	"use strict";

	function SkinManager(){}

	var list = [],
		skins = [];

	//Add skin to list
	function register(skin, name) {
		list.push(name);
		skins[name] = skin;
	}

	//Get a skin instance
	function get(name) {
		if (!name) {
			name = list[0];
		}

		return skins[name];
	};

	function getList() {
		return list.slice();
	}

	return {
		register,
		get,
		getList
	};
});
define('skylark-widgets-base/Widget',[
  "skylark-langx-ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-events",
  "skylark-langx-numerics/Vector2",
  "skylark-domx-browser",
  "skylark-domx-data",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-files",
  "skylark-domx-geom",
  "skylark-domx-velm",
  "skylark-domx-query",
  "skylark-domx-fx",
  "skylark-domx-plugins-base",
  "skylark-data-collection/HashMap",
  "./base",
  "./skins/SkinManager"
],function(skylark,types,objects,events,Vector2,browser,datax,eventer,noder,files,geom,elmx,$,fx, plugins,HashMap,base,SkinManager){

     const NativeEvents = {
            "drag": 2, // DragEvent
            "dragend": 2, // DragEvent
            "dragenter": 2, // DragEvent
            "dragexit": 2, // DragEvent
            "dragleave": 2, // DragEvent
            "dragover": 2, // DragEvent
            "dragstart": 2, // DragEvent
            "drop": 2, // DragEvent

            "abort": 3, // Event
            "change": 3, // Event
            ///"error": 3, // Event
            "selectionchange": 3, // Event
            "submit": 3, // Event
            "reset": 3, // Event
            'fullscreenchange':3,
            'fullscreenerror':3,

/*
            'disablepictureinpicturechanged':3,
            'ended':3,
            'enterpictureinpicture':3,
            'durationchange':3,
            'leavepictureinpicture':3,
            'loadstart' : 3,
            'loadedmetadata':3,
            'pause' : 3,
            'play':3,
            'posterchange':3,
            'ratechange':3,
            'seeking' : 3,
            'sourceset':3,
            'suspend':3,
            'textdata':3,
            'texttrackchange':3,
            'timeupdate':3,
            'volumechange':3,
            'waiting' : 3,
*/


            "focus": 4, // FocusEvent
            "blur": 4, // FocusEvent
            "focusin": 4, // FocusEvent
            "focusout": 4, // FocusEvent

            "keydown": 5, // KeyboardEvent
            "keypress": 5, // KeyboardEvent
            "keyup": 5, // KeyboardEvent

            "message": 6, // MessageEvent

            "click": 7, // MouseEvent
            "contextmenu": 7, // MouseEvent
            "dblclick": 7, // MouseEvent
            "mousedown": 7, // MouseEvent
            "mouseup": 7, // MouseEvent
            "mousemove": 7, // MouseEvent
            "mouseover": 7, // MouseEvent
            "mouseout": 7, // MouseEvent
            "mouseenter": 7, // MouseEvent
            "mouseleave": 7, // MouseEvent


            "progress" : 11, //ProgressEvent

            "textInput": 12, // TextEvent

            "tap": 13,
            "touchstart": 13, // TouchEvent
            "touchmove": 13, // TouchEvent
            "touchend": 13, // TouchEvent

            "load": 14, // UIEvent
            "resize": 14, // UIEvent
            "select": 14, // UIEvent
            "scroll": 14, // UIEvent
            "unload": 14, // UIEvent,

            "wheel": 15, // WheelEvent

    };
 
  const Plugin = plugins.Plugin;

  var Widget = Plugin.inherit({
    klassName: "Widget",

    _construct : function(parent,elm,options) {
        if (parent && !(parent instanceof Widget || parent.element)) {
           options = elm;
           elm = parent;
           parent = null;
        }
        if (types.isHtmlNode(elm)) {
          options = this._parse(elm,options);
        } else {
          options = elm;
          elm = null;
        }
        if (types.isString(options)) {
          options = {
            tagName : options
          };
        }
        this.overrided(elm,options);

        if (!elm) {
          this._velm = this._create();
          this._elm = this._velm.elm();
        } else {
          this._velm = this.elmx(this._elm);
        }
        
        Object.defineProperty(this,"state",{
          value :this.options.state || new HashMap()
        });

        /** 
         * True if the element is visible.
         *
         * @attribute visible
         * @type {Boolean}
         */
        this.visible = true;
        

        //this.element.style.position = "absolute";
        //this.element.style.overflow = "hidden";

        /**
         * Size of this component in px.
         *
         * @attribute size
         * @type {Vector2}
         */
        this.size = new Vector2(0, 0);
        
        /**
         * Location of this component relatively to its parent in px.
         *
         * @attribute location
         * @type {Vector2}
         */
        this.location = new Vector2(0, 0);

        /**
         * Locationing mode, indicates how to anchor the component.
         *
         * @attribute mode
         * @type {Number}
         */
        this._mode = Widget.TOP_LEFT;
     
        //this.state = this.options.state || new Map();
        this._init();

        var addonCategoryOptions = this.options.addons;
        if (addonCategoryOptions) {
          var widgetCtor = this.constructor,
              addons = widgetCtor.addons;
          for (var categoryName in addonCategoryOptions) {
              for (var i =0;i < addonCategoryOptions[categoryName].length; i++ ) {
                var addonOption = addonCategoryOptions[categoryName][i];
                if (types.isString(addonOption)) {
                  var addonName = addonOption,
                      addonSetting = addons[categoryName][addonName],
                      addonCtor = addonSetting.ctor ? addonSetting.ctor : addonSetting;

                  this.addon(addonCtor,addonSetting.options);

                }

              }
          }
        }

        //if (this._elm.parentElement) {
        //  // The widget is already in document
        //  this._startup();
        //}

        if (parent) {
          this.setParent(parent);
        } else if (this._velm.isInDocument()) {
          this._startup();
        }

    },

    /**
     * Parses widget options from attached element.
     * This is a callback method called by constructor when attached element is specified.
     * @method _parse
     * @return {Object} options.
     */
    _parse : function(elm,options) {
      var optionsAttr = datax.data(elm,"options");
      if (optionsAttr) {
         //var options1 = JSON.parse("{" + optionsAttr + "}");
         var options1 = eval("({" + optionsAttr + "})");
         options = objects.mixin(options1,options); 
      }
      return options || {};
    },

    /**
     * Create html element for this widget.
     * This is a callback method called by constructor when attached element is not specified.
     * @method _create
     */
    _create : function() {
        var template = this.options.template;
        if (template) {
          return this.elmx(template);
        } else {
          var tagName = this.options.tagName;
          if (tagName) {
            return this.elmx(noder.createElement(tagName,{
              style : {
                position : "absolute",
                overflow : "hidden"
              }
            }))
          } else {
            throw new Error("The template or tagName is not existed in options!");
          }
        }
    },


    /**
     * Init widget.
     * This is a callback method called by constructor.
     * @method _init
     */
    _init : function() {
      var self = this;
      if (this.widgetClass) {
        this._velm.addClass(this.widgetClass);
      }
      this.state.on("changed",function(e,args) {
        self._refresh(args.data);
      });
    },


    /**
     * Startup widget.
     * This is a callback method called when widget element is added into dom.
     * @method _post
     */
    _startup : function() {

    },


    isNativeEvent : function(events) {
        if (types.isString(events)) {
            return !!NativeEvents[events];
        } else if (types.isArray(events)) {
            for (var i=0; i<events.length; i++) {
                if (NativeEvents[events[i]]) {
                    return true;
                }
            }
            return false;
        }            

    },   

    on : function(events, selector, data, callback, ctx, /*used internally*/ one) {
        if (this.el_ && this.isNativeEvent(events)) {
            eventer.on(this.el_,events,selector,data,callback,ctx,one);
        } else {
            Plugin.prototype.on.call(this,events, selector, data, callback, ctx,  one);
        }
    },   

    off : function(events, callback) {
        if (this.el_ && this.isNativeEvent(events)) {
            eventer.off(this.el_,events,callback);
        } else {
            Plugin.prototype.off.call(this,events,callback);
        }
    },

    listenTo : function(obj, event, callback, /*used internally*/ one) {
        if (types.isString(obj) || types.isArray(obj)) {
            one = callback;
            callback = event;
            event = obj;
            if (this.el_ && this.isNativeEvent(event)) {
                eventer.on(this.el_,event,callback,this,one);
            } else {
                this.on(event,callback,this,one);
            }
        } else {
            if (obj.nodeType) {
                eventer.on(obj,event,callback,this,one)
            } else {
                Plugin.prototype.listenTo.call(this,obj,event,callback,one)
            }                
        }
    },

    unlistenTo : function(obj, event, callback) {
        if (types.isString(obj) || types.isArray(obj)) {
            callback = event;
            event = obj;
            if (this.el_ && this.isNativeEvent(event)) {
                eventer.off(this.el_,event,callback);
            } else {
                this.off(event,callback);                   
            }
        } else {
            if (obj.nodeType) {
                eventer.off(obj,event,callback)
            } else {
                Plugin.prototype.unlistenTo.call(this,obj,event,callback)
            }
        }
    },

    /**
     * Update the location of this widget.
     * 
     * @method updateLocation
     */
    updateLocation : function(mode) {
      if(mode !== undefined) {
        this._mode = mode;
      }

      if(this._mode === Widget.TOP_LEFT || this._mode === Widget.TOP_RIGHT) {
        this._elm.style.top = this.location.y + "px";
      } else {
        this._elm.style.bottom = this.location.y + "px";
      }

      if(this._mode === Widget.TOP_LEFT || this._mode === Widget.BOTTOM_LEFT) {
        this._elm.style.left = this.location.x + "px";
      } else {
        this._elm.style.right = this.location.x + "px";
      }
    },

    /**
     * Update the size of this widget.
     * 
     * @method updateSize
     */
    updateSize : function(){
      this._elm.style.width = this.size.x + "px";
      this._elm.style.height = this.size.y + "px";
    },


    /**
     * Update visibility of this element.
     *
     * @method setVisibility
     */
    setVisibility : function(visible)   {
      this.visible = visible;
      this.updateVisibility();
    },


    /**
     * Update the visibility of this widget.
     *
     * @method updateVisibility
     */
    updateVisibility : function() {
      this._elm.style.display = this.visible ? "block" : "none";
    },


    /**
     * Refresh widget.
     * This is a callback method called when widget state is changed.
     * @method _refresh
     */
    _refresh : function(updates) {
      /*
      var _ = this._,
          model = _.model,
          dom = _.dom,
          props = {

          };
      updates = updates || {};
      for (var attrName in updates){
          var v = updates[attrName].value;
          if (v && v.toCss) {
              v.toCss(props);
              updates[attrName].processed = true;
          }

      };

      this.css(props);

      if (updates["disabled"]) {
          var v = updates["disabled"].value;
          dom.aria('disabled', v);
          self.classes.toggle('disabled', v);
      }
      */
    },                

    mapping : {
      "events" : {
  //       'mousedown .title':  'edit',
  //       'click .button':     'save',
  //       'click .open':       function(e) { ... }            
      },

      "attributs" : {

      },

      "properties" : {

      },

      "styles" : {

      }
    },

    addon : function(ctor,setting) {
      var categoryName = ctor.categoryName,
          addonName = ctor.addonName;

      this._addons = this.addons || {};
      var category = this._addons[categoryName] = this._addons[categoryName] || {};
      category[addonName] = new ctor(this,setting);
      return this;
    },

    addons : function(categoryName,settings) {
      this._addons = this.addons || {};
      var category = this._addons[categoryName] = this._addons[categoryName] || {};

      if (settings == undefined) {
        return objects.clone(category || null);
      } else {
        objects.mixin(category,settings);
      }
    },


    /**
     * Returns a html element representing the widget.
     *
     * @method render
     * @return {HtmlElement} HTML element representing the widget.
     */
    render: function() {
      return this._elm;
    },



    /**
     * Returns a parent widget  enclosing this widgets, or null if not exist.
     *
     * @method getEnclosing
     * @return {Widget} The enclosing parent widget, or null if not exist.
     */
    getEnclosing : function(selector) {
      return null;
    },

    /**
     * Returns a widget collection with all enclosed child widgets.
     *
     * @method getEnclosed
     * @return {List} Collection with all enclosed child widgets..
     */
    getEnclosed : function() {
      var self = this;
          children = new ArrayList();
      return children;
    },


    getSkin : function() {
      return SkinManager.get();
    },

    /**
     * Sets the visible state to true.
     *
     * @method show
     * @return {Widget} Current widget instance.
     */

    show : function() {
      this._velm.show();
    },

    /**
     * Sets the visible state to false.
     *
     * @method hide
     * @return {Widget} Current widget instance.
     */
    hide : function() {
      this._velm.hide();
    },

    /**
     * Focuses the current widget.
     *
     * @method focus
     * @return {Widget} Current widget instance.
     */
    focus :function() {
      try {
        this._velm.focus();
      } catch (ex) {
        // Ignore IE error
      }

      return this;
    },

    /**
     * Blurs the current widget.
     *
     * @method blur
     * @return {Widget} Current widget instance.
     */
    blur : function() {
      this._velm.blur();

      return this;
    },

    enable: function () {
      this.state.set('disabled',false);
      return this;
    },

    disable: function () {
      this.state.set('disabled',true);
      return this;
    },


    /** 
     * Add a CSS class to the base DOM element of this widget element.
     * 
     * @method addClass
     * @param {String} name Name of the class to be added.
     */
    addClass : function(name){
      this._velm.addClass(name);
      return this;
    },

    /** 
     * Determine whether this widget element is assigned the given class.
     * 
     * @method hasClass
     * @param {String} name Name of the class t.
     */
    hasClass : function(name){
      return this._velm.hasClass(name);
    },

    offset : function() {
        return this._velm.pagePosition();
    },

    outerWidth : function() {
        return this._velm.marginSize().width;
    },

    outerHeight : function() {
        return this._velm.marginSize().height;
    },

    /** 
     * Remove a CSS class from the base DOM element of this idget element.
     * 
     * @method removeClass
     * @param {String} name Name of the class to be removed.
     */
    removeClass: function(name) {
      this._velm.removeClass(name);
      return this;
    },

    /** 
     * Remove a CSS class from the base DOM element of this idget element.
     * 
     * @method removeClass
     * @param {String} name Name of the class to be removed.
     */
    toggleClass: function(name) {
      this._velm.toggleClass(name);
      return this;
    },

    /**
     * Sets the specified aria property.
     *
     * @method aria
     * @param {String} name Name of the aria property to set.
     * @param {String} value Value of the aria property.
     * @return {Widget} Current widget instance.
     */
    aria : function(name, value) {
      const self = this, elm = self.getEl(self.ariaTarget);

      if (typeof value === 'undefined') {
        return self._aria[name];
      }

      self._aria[name] = value;

      if (self.state.get('rendered')) {
        elm.setAttribute(name === 'role' ? name : 'aria-' + name, value);
      }

      return self;
    },

    attr: function (name,value) {
        var velm = this._velm,
            ret = velm.attr(name,value);
        return ret == velm ? this : ret;
    },

    getAttr : function(name) {
      return this._velm.attr(name);
    },

    setAttr : function(name,value) {
      this._velm.attr(name,value);
      return this;
    },

    removeAttr : function(name) {
      this._velm.removeAttr(name);
      return this;
    },


    /**
     * Calculate the location of the container to make it centered.
     *
     * Calculated relatively to its parent size.
     * 
     * @method center
     */
    center : function() {
      this.location.set((this.parent.size.x - this.size.x) / 2, (this.parent.size.y - this.size.y) / 2);
    },

    css: function (name, value) {
        var velm = this._velm,
            ret = velm.css(name, value);
        return ret == velm ? this : ret;
    },

    getStyle : function(name) {
      return this._velm.css(name);
    },

    setStyle : function(name,value) {
      this._velm.css(name,value);
      return this;
    },

    data: function (name, value) {
        var velm = this._velm,
            ret = velm.data(name,value);
        return ret == velm ? this : ret;
    },


    getData : function(name) {
      return this._velm.data(name);
    },

    setData : function(name,value) {
      this._velm.data(name,value);
      return this;
    },


    parent : {
      get : function() {
        return this.getParent();
      },
      set : function(v) {
        this.setParent(v);
      }
    },

    getParent : function() {
      return this._parent;
    },

    setParent : function(parent) {
      var oldParent = this._parent;
      this._parent = parent;
      if (parent) {
        this.mount(parent._elm || parent.element);
        if (parent._setupChild) {
          parent._setupChild(this);
        }
      } else if (oldParent) {
        this.unmount();
      }
      return this;
    },


    prop: function (name,value) {
        var velm = this._velm,
            ret = velm.prop(name,value);
        return ret == velm ? this : ret;
    },

    getProp : function(name) {
      return this._velm.prop(name);
    },

    setProp : function(name,value) {
      this._velm.prop(name,value);
      return this;
    },

    throb: function(params) {
      if (this.options.throbber) {
        params = objects.defaults(params,this.options.throbber);
      }
      return noder.throb(this._elm,params);
    },

    /*
    emit : function(type,params) {
      var e = events.createEvent(type,{
        data : params
      });
      return events.Emitter.prototype.emit.call(this,e,params);
    },
    */

    /**
     * Update component appearance.
     * 
     * Should be called after changing size or location.
     *
     * Uses the updateVisibility and if the element is visible calls the updateSize and updateLocation (in this order) methods to update the interface.
     * 
     * @method update
     */
    update : function() {
      this.updateVisibility();

      if(this.visible) {
        this.updateSize();
        this.updateLocation();
      }
    },


    /**
     *  mount the current widget element to dom document.
     *
     * @method mount
     * @return {Widget} This Widget.
     */
    mount : function(target,position){
        var toElm = target.element || target,
            elm = this._elm;
        if (!position || position=="child") {
            noder.append(toElm,elm);
        } else  if (position == "before") {
            noder.before(toElm,elm);
        } else if (position == "after") {
            noder.after(toElm,elm);
        } else if (position == "prepend") {
            noder.prepend(toElm,elm);         
        }
        this._startup();
    },

    /**
     *  unmount the current widget element from dom document.
     *
     * @method html
     * @return {HtmlElement} HTML element representing the widget.
     */
    unmount : function() {
      this._velm.remove();
    },

    preventDragEvents : function() {
      this.element.ondrop = Widget.preventDefault;
      this.element.ondragover = Widget.preventDefault;
    },


    element : {
      get : function() {
        return this._elm;
      },

      set : function(v) {
        this._elm = v;
      }
    },

    position : {
      get : function() {
        return this.location;
      },

      set : function(v) {
        this.location = v;
      }
    },

    /**
     * Set alt text, that is displayed when the mouse is over the element. Returns the element created that is attached to the document body.
     *
     * @method setAltText
     * @param {String} altText Alt text.
     */
    setAltText : function(altText)   {
      var element = document.createElement("div");
      element.style.position = "absolute";
      element.style.display = "none";
      element.style.alignItems = "center";
      element.style.zIndex = "10000";
      element.style.border = "3px solid";
      element.style.borderRadius = "5px";
      element.style.color = Editor.theme.textColor;
      element.style.backgroundColor = Editor.theme.barColor;
      element.style.borderColor = Editor.theme.barColor;
      element.style.height = "fit-content";
      document.body.appendChild(element);

      //Text
      var text = document.createTextNode(altText);
      element.appendChild(text);

      //Destroy
      var destroyFunction = this.destroy;
      this.destroy = function()
      { 
        destroyFunction.call(this);

        if(document.body.contains(element))
        {
          document.body.removeChild(element);
        }
      };
      
      this._elm.style.pointerEvents = "auto"; 

      //Mouse mouse move event
      this._elm.onmousemove = function(event) {
        element.style.display = "flex";
        element.style.left = (event.clientX + 8) + "px";
        element.style.top = (event.clientY - 20) + "px";
      };

      //Mouse out event
      this._elm.onmouseout = function()  {
        element.style.display = "none";
      };

      return element;
    },

    /**
     * Set method to be called on component click.
     * 
     * @method setOnClick
     * @param {Function} callback Function called when the component is clicked.
     */
    setOnClick : function(callback)  {
      this._elm.onclick = callback;
    },

    /**
     * Remove all DOM children from the element.
     * 
     * @method removeAllChildren
     */
    removeAllChildren : function()   {
      while(this._elm.firstChild) {
        this._elm.removeChild(this._elm.firstChild);
      }
    },

    /**
     * Set positioning mode.
     * 
     * @method setMode
     * @param {Number} setMode
     */
    setMode : function(mode) {
      this._mode = mode;
      this._elm.style.bottom = null;
      this._elm.style.right = null;
      this._elm.style.left = null;
    },


    /**
     * Called to destroy a component.
     *
     * Destroy the element and removes it from its DOM parent.
     * 
     * @method destroy
     */
    destroy : function()
    {
      if(this._parent)
      {
        if(this._parent.element)
        {
          if(this._parent.element.contains(this.element))
          {
            this._parent.element.removeChild(this.element);
            this._parent = null;
          }
        }
        else
        {
          console.warn("nunuStudio: Parent is not a Element.", this);
          if(this._parent.contains(this.element))
          {
            this._parent.removeChild(this.element);
            this._parent = null;
          }
        }
      }
    }

  });

  Widget.prototype.updateInterface = Widget.prototype.update;
  Widget.prototype.updatePosition = Widget.prototype.updateLocation;
  Widget.prototype.attachTo = Widget.prototype.setParent;
  Widget.prototype._attachTo = Widget.prototype.mount;
  Widget.prototype.detach = Widget.prototype.unmount;

  /**
   * Top-left locationing.
   *
   * @static
   * @attribute TOP_LEFT
   * @type {Number}
   */
  Widget.TOP_LEFT = 0;

  /**
   * Top-right locationing.
   *
   * @static
   * @attribute TOP_RIGHT
   * @type {Number}
   */
  Widget.TOP_RIGHT = 1;

  /**
   * Bottom-left locationing.
   *
   * @static
   * @attribute BOTTOM_LEFT
   * @type {Number}
   */
  Widget.BOTTOM_LEFT = 2;

  /**
   * Bottom-right locationing.
   *
   * @static
   * @attribute BOTTOM_RIGHT
   * @type {Number}
   */
  Widget.BOTTOM_RIGHT = 3;

  Widget.inherit = function(meta) {
    var ctor = plugins.Plugin.inherit.apply(this,arguments);

    function addStatePropMethod(name) {
        ctor.prototype[name] = function(value) {
          if (value !== undefined) {
            this.state.set(name,value);
            return this;
          } else {
            return this.state.get(name);
          }
        };
    }
    if (meta.state) {
      for (var name in meta.state) {
          addStatePropMethod(name);
      }
    }

    if (meta.pluginName) {
      plugins.register(ctor,meta.pluginName);
    }
    return ctor;
  };

  Widget.register = function(ctor,widgetName) {
    var meta = ctor.prototype,
        pluginName = widgetName || meta.pluginName;

    function addStatePropMethod(name) {
        ctor.prototype[name] = function(value) {
          if (value !== undefined) {
            this.state.set(name,value);
            return this;
          } else {
            return this.state.get(name);
          }
        };
    }
    if (meta.state) {
      for (var name in meta.state) {
          addStatePropMethod(name);
      }
    }

    if (pluginName) {
      plugins.register(ctor,pluginName);
    }
    return ctor;
  };

  Widget.preventDefault = function(event)
  {
    event.preventDefault();
  };

  return base.Widget = Widget;
});

define('skylark-widgets-base/CanvasPane',[
  "./base",
  "./Widget"
],function(
	base,
	Widget
){
	"use strict";

	/**
	 * DOM canvas element.
	 * 
	 * @class Canvas
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var CanvasPane = Widget.inherit({
		"klassName" : "CanvasPane",

		"_construct" : function (parent)
		{
			Widget.prototype._construct.call(this, parent, "canvas");

			this.preventDragEvents();
		},


		/**
		 * Get a context from this canvas.
		 * 
		 * @method getContext
		 * @param {string} type Type of context to get "2d", "webgl", etc
		 * @return {Object} Context obtained from the canvas.
		 */
		getContext : function(type)
		{
			return this._elm.getContext(type);
		},

		updateSize : function()
		{
			Widget.prototype.updateSize.call(this);

			var pixelRatio = Editor.getPixelRatio();
			
			this._elm.width = this.size.x * pixelRatio;
			this._elm.height = this.size.y * pixelRatio;
		}

	});

	return base.CanvasPane = CanvasPane;
});
define('skylark-widgets-base/ImagePane',[
  "./base",
  "./Widget"
],function(
	base,
	Widget
){
	"use strict";

	/**
	 * DOM image element.
	 * 
	 * @class ImagePane
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var ImagePane = Widget.inherit({

		_construct : function (parent) {
			Widget.prototype._construct.call(this, parent, "img");

			this._elm.style.borderStyle = "none";
			this._elm.style.objectFit = "contain"; //cover | fill
		},

		/**
		 * Set image from URL.
		 * 
		 * @method setImage
		 * @param {String} source Image URL.
		 */
		setImage : function(source)	{
			this._elm.src = source;
		}
	});

	return base.ImagePane = ImagePane;
});
define('skylark-widgets-base/mixins/TextMixin',[
	"skylark-langx-numerics/Vector2",
	"../Widget"
],function(
	Vector2,
	Widget
){
	"use strict";

	/**
	 * Text element without background.
	 * 
	 * @class Text
	 * @extends {Widget}
	 * @param {Widget} parent Parent widget.
	 */

	var TextMixin = {
		_buildText : function() {
			var skin = this.getSkin();

			//this._elm.style.pointerEvents = "none";
			//this._elm.style.color = Editor.theme.textColor;
			//this._elm.style.color = skin.textColor;
			//this._elm.style.display = "flex";

			/** 
			 * Span DOM element used to represent the text.
			 *
			 * @attribute span
			 * @type {DOM}
		 	 */
			this.span = document.createElement("span");
			this.span.style.overflow = "hidden";
			this._elm.appendChild(this.span);

			//Text
			this.text = document.createTextNode("");
			this.span.appendChild(this.text);

			/**
			 * If set to true the text container will automatically fit the text size.
			 *
			 * @attribute fitContent
			 * @type {Boolean}
			 */
			this.fitContent = false;

			this.allowWordBreak(false);
			this.setVerticalAlignment(TextMixin.CENTER);
			this.setAlignment(TextMixin.CENTER);		
		},

		/**
		 * Set font to use for the text.
		 * 
		 * @method setFont
		 * @param {String} fontFamily Font family.
		 * @param {Number} fontWeight Font weigth, sets how thick or thin characters in text should be displayed.
		 * @param {String} fontStyle Font style, specifies the font style for a text.
		 */
		setFont : function(fontFamily, fontWeight, fontStyle) {
			this.span.style.fontFamily = fontFamily;

			if(fontWeight !== undefined) {
				this.span.style.fontWeight = fontWeight;
			}

			if(fontStyle !== undefined) {
				this.span.style.fontStyle = fontStyle;
			}
		},

		/**
		 * Enable of disable word breaking.
		 *
		 * @method allowWordBreak
		 * @param {Boolean} line If true words can be breaked.
		 */
		allowWordBreak : function(value) {
			if(value === true) {
				this.span.style.whiteSpace = "normal";
				this.span.style.wordBreak = "break-word";
			} else 	{
				this.span.style.whiteSpace = "pre";
				this.span.style.wordBreak = "normal";
			}
		},

		/**
		 * Set text.
		 *
		 * @method setText
		 * @param {String} text Text. 
		 */
		setText : function(text){
			this.text.data = text;
		},

		/**
		 * Set text border.
		 *
		 * @method setTextBorder
		 * @param {Number} size Border size in pixels.
		 * @param {String} color CSS Color. 
		 */
		setTextBorder : function(size, color) {
			this.span.style.textShadow = "-" + size + "px 0 " + color + ", 0 " + size + "px " + color + ", " + size + "px 0 " + color + ", 0 -" + size + "px " + color;
		},

		/**
		 * Set Text size, in pixels.
		 * 
		 * @method setTextSize
		 * @param {Number} size Size in pixel for this text element.
		 */
		setTextSize : function(size) {
			this._elm.style.fontSize = size + "px";
		},

		/**
		 * Set text color.
		 * 
		 * @method setTextColor
		 * @param {String} color Color code.
		 */
		setTextColor : function(color) {
			this.span.style.color = color;
		},

		/**
		 * Set text overflow handling
		 *
		 * @method setOverflow
		 * @param {Number} overflow
		 */
		setOverflow : function(overflow) {
			if(overflow === TextMixin.ELLIPSIS) {
				this.span.style.whiteSpace = "nowrap";
				this.span.style.textOverflow = "ellipsis";
			} else 	{
				this.span.style.whiteSpace = "pre";
				this.span.style.textOverflow = "clip";
			}
		},

		/**
		 * Set text horizontal alignment.
		 *  - TextMixin.CENTER
		 *  - TextMixin.LEFT
		 *  - TextMixin.RIGHT
		 * 
		 * @method setAlignment
		 * @param {Number} align Alingment mode.
		 */
		setAlignment : function(align) 	{
			if(align === TextMixin.CENTER) {
				this._elm.style.justifyContent = "center";
				this._elm.style.textAlign = "center";
			} else if(align === TextMixin.LEFT) {
				this._elm.style.justifyContent = "flex-start";
				this._elm.style.textAlign = "left";
			} else if(align === TextMixin.RIGHT) {
				this._elm.style.justifyContent = "flex-end";
				this._elm.style.textAlign = "right";
			}
		},

		/**
		 * Set text vertical alignment.
		 *  - TextMixin.CENTER
		 *  - TextMixin.TOP
		 *  - TextMixin.BOTTOM
		 * 
		 * @method setVerticalAlignment
		 * @param {Number} align Alingment mode.
		 */
		setVerticalAlignment : function(align) {
			if(align === TextMixin.CENTER) {
				this._elm.style.alignItems = "center";
			} else if(align === TextMixin.TOP) {
		 		this._elm.style.alignItems = "flex-start";
			} else if(align === TextMixin.BOTTOM) {
				this._elm.style.alignItems = "flex-end";
			}
		},

		/**
		 * Get size of the text inside of this component in px.
		 * 
		 * @method measure
		 * @return {Vector2} A vector with the size of the text. 
		 */
		measure : function() 	{
		 	return new Vector2(this.span.offsetWidth, this.span.offsetHeight);
		},

		/**
		 * Set text internal margin in pixels.
		 * 
		 * @method setMargin
		 * @param {Number} margin Margin size in pixels.
		 */
		setMargin : function(margin) {
			this.span.style.margin = margin + "px";
		},

		updateSize : function() {
			if(this.fitContent) { 
				this.size.x = this.span.clientWidth;
				this.size.y = this.span.clientHeight;
			}
			
			Widget.prototype.updateSize.call(this);
		},

		updateVisibility : function() {
			this._elm.style.display = this.visible ? "flex" : "none";
		},

		CENTER : 0,
		LEFT : 1,
	    RIGHT : 2,
	    TOP : 3,
	    BOTTOM : 4,

	    CLIP : 10,
	    ELLIPSIS : 11

	};


	return TextMixin;
});
define('skylark-widgets-base/TextPane',[
  "./base",
  "./Widget",
  "./mixins/TextMixin"
],function(
	base,
	Widget,
	TextMixin
){
	"use strict";

	/**
	 * Text element without background.
	 * 
	 * @class Text
	 * @extends {Element}
	 * @param {Element} parent Parent element.
	 */

	var TextPane = Widget.inherit({

		_construct : function (parent) {
			Widget.prototype._construct.call(this, parent,"div");

			var skin = this.getSkin();

			this._elm.style.pointerEvents = "none";
			this._elm.style.color = skin.textColor;
			this._elm.style.display = "flex";
			
			/*
				 * 
				 * Span DOM element used to represent the text.
				 *
				 * @attribute span
				 * @type {DOM}
			 	 
				this.span = document.createElement("span");
				this.span.style.overflow = "hidden";
				this.element.appendChild(this.span);

				//Text
				this.text = document.createTextNode("");
				this.span.appendChild(this.text);

				**
				 * If set to true the text container will automatically fit the text size.
				 *
				 * @attribute fitContent
				 * @type {Boolean}
				 *
				this.fitContent = false;

				this.allowWordBreak(false);
				this.setVerticalAlignment(Text.CENTER);
				this.setAlignment(Text.CENTER);
			*/

			this._buildText();


		},
		...TextMixin
	});
	
	TextPane.CENTER = 0;
	TextPane.LEFT = 1;
	TextPane.RIGHT = 2;
	TextPane.TOP = 3;
	TextPane.BOTTOM = 4;

	TextPane.CLIP = 10;
	TextPane.ELLIPSIS = 11;

	return base.TextPane = TextPane;
});
define('skylark-widgets-base/SubmitForm',[
	"./base",
	"./Widget"
],function(base,Widget){
	"use strict";

	/**
	 * DOM form element.
	 * 
	 * This element should be used to encapsulate input elements that require autocompletion.
	 * 
	 * @class Form
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var SubmitForm = Widget.inherit({
		"_construct" : function(parent)
		{
			Widget.prototype._construct.call(this, parent, "form");

			this._elm.autocomplete = true;
			this._elm.noValidate = true;
			this._elm.action = "javascript:void(0)";
			this._elm.addEventListener("submit", function(event)
			{
				event.preventDefault()
				return false;
			});
		},


		/**
		 * Simulate the form submission.
		 * 
		 * Should be called when sending data to the server to trigger the browser autocomplete system.
		 * 
		 * Some form implementation might actually implement submission login under this method.
		 *
		 * @method submit
		 */
		submit : function()
		{
			this._elm.submit();
		}

	});

	return base.SubmitForm = SubmitForm;
});

define('skylark-widgets-base/actions/ActionManager',[
	"skylark-langx/Evented",
	"../base"
], function(Evented,base){

	var ActionManager = Evented.inherit({
		"klassName"		:	"ActionManager",


		addAction : function(category,name,fn,options) {

		},

		executeAction : function() {

		},

		removeAction : function(category,name) {

		}

	});

	return base.actions.ActionManager = ActionManager;

});


define('skylark-widgets-base/actions/Action',[
	"skylark-langx/objects",
	"skylark-langx/Evented",
	"skylark-data-collection/HashMap",
	"../base",
	"./ActionManager"
], function(objects,Evented, HashMap, base, ActiionManager){

	var Action = Evented.inherit({
		"klassName" : "Action",

		"name"  : "",

		"category" : "",

		"text" : "",

		"tooltip" : "",

		"icon" : "",

		"shortcut" : "",

		"state"  : {
			get : function() {
				return  this._state || (this._state = new HashMap({
					checked : false,
					disabled : false
				}));
			}
		},

		_construct : function(options) {
			if (options) {
				objects.mixin(this,options);
			}
		},

		_init : function() {

		},

	    /**
	     * Executes the command. Additional arguments are passed to the executing function
	     *
	     * @return {$.Promise} a  promise that will be resolved when the command completes.
	     */
		execute: function(params){
			if (this._execute) {
				this._execute(params);
			}
			this.trigger("executed",{
				params :params
			});
		}

	});
	
	return base.actions.Action = Action;
});



define('skylark-widgets-base/panels/Panel',[
	"../base",
	"../Widget"
],function(base,Widget){
	"use strict";

	/**
	 * DOM division element.
	 * 
	 * @class Division
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var Panel = Widget.inherit({
		"_construct" : function (parent) {
			Widget.prototype._construct.call(this, parent, "div");

			//this._elm.style.overflow = "visible";
		},

		_setupChild : function(child) {
        	child.element.style.position = "absolute";
        	//child.element.style.overflow = "hidden";			
		}

	});


	return base.panels.Panel = Panel;
});
define('skylark-widgets-base/panels/DualContainer',[
	"../base",
	"./Panel",
],function( base, Panel){
	"use strict";

	var DualContainer = Panel.inherit({
		"klassName" : "DualContainer",

		"_construct" : function (parent) {
			Panel.prototype._construct.call(this, parent);

			var skin = this.getSkin();

			this._elm.style.overflow = "hidden";
			//this._elm.style.backgroundColor = Editor.theme.panelColor;
			this._elm.style.backgroundColor = skin.panelColor;

			//Container A
			this._elmA = null

			//Container B
			this._elmB = null

			//Resize tab
			this.resizeTab = document.createElement("div");
			this.resizeTab.style.position = "absolute";
			this.resizeTab.style.cursor = "e-resize";


			//this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
			this.resizeTab.style.backgroundColor = skin.resizeTabColor;
			this._elm.appendChild(this.resizeTab);

			//Resize Tab
			this.tabPosition = 0.5;
			this.tabPositionMax = 0.95;
			this.tabPositionMin = 0.05;
			this.tabSize = 5;
			this.orientation = DualContainer.HORIZONTAL;

			var self = this;

			function resizing(event) {
				if(self.orientation === DualContainer.HORIZONTAL)
				{	
					self.tabPosition += event.movementX / self.size.x;
				}
				else if(self.orientation === DualContainer.VERTICAL)
				{
					self.tabPosition += event.movementY / self.size.y;
				}

				//Limit tab position
				if(self.tabPosition > self.tabPositionMax)
				{
					self.tabPosition = self.tabPositionMax;
				}
				else if(self.tabPosition < self.tabPositionMin)
				{
					self.tabPosition = self.tabPositionMin;
				}

				self.updateInterface();

			}
			//Tab mouse down
			this.resizeTab.onmousedown = function(event)
			{
			//	self.manager.create();
				self.$(window).on("mousemove",resizing);
				self.$(window).one("mouseup",function(){
					self.$(window).off("mousemove",resizing);
				});
			};

			//Tab resize event manager
			//this.manager = new EventManager();

			//this.listenTo(this.$(window), "mousemove", function(event){
			//});

			//this.connect(window, "mouseup", function(event)
			//{
			//	self.manager.destroy();
			//});
		},

		attach : function(element) 	{
			if(this._elmA === null)
			{
				this.attachA(element);
				return;
			}
			
			if(this._elmB === null) {
				this.attachB(element);
				return;
			}
			
			console.warn("nunuStudio: Cannot attach more elements.");
		},

		attachA : function(element) {
			this._elmA = element;
			this._elmA.setParent(this);
		},

		attachB : function(element) {
			this._elmB = element;
			this._elmB.setParent(this);
		},

		updateSize : function() {
			Panel.prototype.updateSize.call(this);

			if(this._elmA === null || this._elmB === null) 	{
				console.log("nunuStudio: Dual container elements are null", this, this._elmA, this._elmB);
				return;
			}

			if(this.orientation === DualContainer.HORIZONTAL) {
				var tabPositionAbs = this.tabPosition * this.size.x;

				this._elmA.position.set(0, 0);
				this._elmA.size.set(tabPositionAbs, this.size.y);
				this._elmA.updateInterface();

				this._elmB.size.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
				this._elmB.position.set(this._elmA.size.x + this.tabSize, 0);
				this._elmB.updateInterface();

				this.resizeTab.style.cursor = "e-resize";
				this.resizeTab.style.top = "0px";
				this.resizeTab.style.left = this._elmA.size.x + "px";
				this.resizeTab.style.width = this.tabSize + "px";
				this.resizeTab.style.height = this.size.y + "px";
			} else if(this.orientation === DualContainer.VERTICAL) 	{
				var tabPositionAbs = this.tabPosition * this.size.y;
				
				this._elmA.position.set(0, 0);
				this._elmA.size.set(this.size.x, tabPositionAbs);
				this._elmA.updateInterface();
				
				this._elmB.size.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);
				this._elmB.position.set(0, this._elmA.size.y + this.tabSize);
				this._elmB.updateInterface();

				this.resizeTab.style.cursor = "n-resize";
				this.resizeTab.style.top = this._elmA.size.y + "px";
				this.resizeTab.style.left = "0px";
				this.resizeTab.style.width = this.size.x + "px";
				this.resizeTab.style.height = this.tabSize + "px";
			}
		},

		elementA : {
			get : function() {
				return this._elmA;
			}
		},

		elementB : {
			get : function() {
				return this._elmB;
			}
		}

	});

	DualContainer.HORIZONTAL = 0;
	DualContainer.VERTICAL = 1;


	return base.panels.DualContainer = DualContainer;
});
define('skylark-widgets-base/panels/DualPanel',[
	"../base",
	"./Panel"
],function( base, Panel){
	"use strict";


	var DualPanel = Panel.inherit({
		"klassName" : "DualPanel",

		"_construct" : function (parent) {
			Panel.prototype._construct.call(this, parent);

			var skin = this.getSkin();

			this._elm.style.overflow = "hidden";
			//this._elm.style.backgroundColor = Editor.theme.panelColor;		
			this._elm.style.backgroundColor = skin.panelColor;

			//Division A
			this.divA = new Panel(this);
			//this.divA.element.style.backgroundColor = Editor.theme.panelColor;
			this.divA.element.style.backgroundColor = skin.panelColor;

			//Division B
			this.divB = new Panel(this);
			//this.divB.element.style.backgroundColor = Editor.theme.panelColor;
			this.divB.element.style.backgroundColor = skin.panelColor;
			
			//Resize tab
			this.resizeTab = document.createWidget("div");
			this.resizeTab.style.position = "absolute";
			this.resizeTab.style.cursor = "e-resize";
			//this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
			this.resizeTab.style.backgroundColor = skin.resizeTabColor;
			this._elm.appendChild(this.resizeTab);

			//Resize Tab
			this.tabPosition = 0.5;
			this.tabPositionMax = 1;
			this.tabPositionMin = 0;
			this.tabSize = 5;
			this.orientation = DualPanel.HORIZONTAL;

			var self = this;

			//Tab mouse down
			//this.resizeTab.onmousedown = function(event){
			//	self.manager.create();
			//};

			//Tab resize event manager
			//this.manager = new EventManager();
			this.connect(window, "mousemove", function(event){
				if(self.orientation === DualPanel.HORIZONTAL){	
					self.tabPosition += event.movementX / self.size.x;
				} else if(self.orientation === DualPanel.VERTICAL) {
					self.tabPosition += event.movementY / self.size.y;
				}

				//Limit tab position
				if(self.tabPosition > self.tabPositionMax) {
					self.tabPosition = self.tabPositionMax;
				} else if(self.tabPosition < self.tabPositionMin) {
					self.tabPosition = self.tabPositionMin;
				}

				self.updateInterface();
				self.onResize();
			});

			this.connect(window, "mouseup", function(event) {
				self.manager.destroy();
			});

			//onResize callback
			this.onResize = function() 	{
				Editor.gui.updateInterface();
			};
		},

		setOnResize : function(callback) {
			this.onResize = callback;
		},

		updateSize : function() {
			Widget.prototype.updateSize.call(this);

			if(this.orientation === DualPanel.HORIZONTAL) {
				var tabPositionAbs = this.tabPosition * this.size.x;
				
				this.divA.position.set(0, 0);
				this.divA.size.set(tabPositionAbs, this.size.y);
				this.divA.updateInterface();

				this.divB.size.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
				this.divB.position.set(this.divA.size.x + this.tabSize, 0);
				this.divB.updateInterface();

				this.resizeTab.style.cursor = "e-resize";
				this.resizeTab.style.top = "0px";
				this.resizeTab.style.left = this.divA.size.x + "px";
				this.resizeTab.style.width = this.tabSize + "px";
				this.resizeTab.style.height = this.size.y + "px";
			} else if(this.orientation === DualPanel.VERTICAL) {
				var tabPositionAbs = this.tabPosition * this.size.y;

				this.divA.position.set(0, 0);
				this.divA.size.set(this.size.x, tabPositionAbs);
				this.divA.updateInterface();

				this.divB.size.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);
				this.divB.position.set(0, this.divA.size.y + this.tabSize);
				this.divB.updateInterface();

				this.resizeTab.style.cursor = "n-resize";
				this.resizeTab.style.top = this.divA.size.y + "px";
				this.resizeTab.style.left = "0px";
				this.resizeTab.style.width = this.size.x + "px";
				this.resizeTab.style.height = this.tabSize + "px";
			}
		},

		elementA : {
			get : function() {
				return this._elmA;
			}
		},

		elementB : {
			get : function() {
				return this._elmB;
			}
		}
	});


	DualPanel.HORIZONTAL = 0;
	DualPanel.VERTICAL = 1;

	return base.panels.DualPanel = DualPanel;
});

define('skylark-widgets-base/panels/RowsPanel',[
	"skylark-langx-numerics/Vector2",
	"../base",
	"../TextPane",
	"./Panel"
],function(
	Vector2,
	base,
	TextPane,
	Panel
){
	"use strict";

	/**
	 * Table form element automatically organizes element into a grid like form.
	 * 
	 * @class TableForm
	 * @extends {Element}
	 * @param {Element} parent Parent element.
	 */
	 var RowsPanel = Panel.inherit({
		"_construct" : function (parent)
		{
			Panel.prototype._construct.call(this, parent);

			
			/**
			 * Set if the form needs to be automatically resized.
			 *
			 * @property autoSize
			 * @type {Boolean}
			 */
			this.autoSize = true;

			/**
			 * Resize the last element of the rows to fit the size of the container.
			 *
			 * @method fitElements
			 * @type {Boolean}
			 */
			this.fitElements = true;

			/**
			 * Spacing between elements and rows.
			 *
			 * @property spacing
			 * @type {Vector2}
			 */
			this.spacing = new Vector2(5, 5);

			/**
			 * Default text width.
			 *
			 * @property defaultTextWidth
			 * @type {Number}
			 */
			this.defaultTextWidth = 80;

			/**
			 * Rows of this form table.
			 *
			 * @property rows
			 * @type {Array}
			 */
			this.rows = [];
			this.rows.push([]);
		},


		/**
		 * Set if the form should be automatically resized, and ajust overflow value.
		 *
		 * @method setAutoSize
		 * @param {Boolean} autoSize
		 */
		setAutoSize : function(autoSize)
		{
			this.autoSize = autoSize;
			this.element.style.overflow = autoSize ? "visible" : "auto";
		},

		/**
		 * Add a element to form (in actual row).
		 *
		 * @method add
		 */
		add : function(element)
		{
			if(this.rows.length > 0)
			{
				this.rows[this.rows.length - 1].push(element);
				element.setParent(this);
			}
		},

		/**
		 * Create text element.
		 *
		 * @method addText
		 */
		addText : function(text, fit)
		{
			var element = new TextPane(this);
			element.setAlignment(TextPane.LEFT);
			element.setText(text);
			element.size.set(this.defaultTextWidth, 20);
			
			if(fit === true)
			{
				element.fitContent = true;
			}
			else
			{
				element.setOverflow(Text.ELLIPSIS);
			}

			this.add(element);

			return element;
		},

		/**
		 * Create division.
		 *
		 * @method addDivision
		 */
		addDivision : function(x, y)
		{
			var division = new Panel(this);
			division.size.set(x, y);
			this.add(division);

			return division;
		},

		/**
		 * Add new row to form.
		 *
		 * @method nextRow
		 */
		nextRow : function()
		{
			this.rows.push([]);
		},

		/**
		 * Remove last row from form.
		 *
		 * @method removeLastRow
		 */
		removeLastRow : function()
		{
			if(this.rows.length > 0)
			{
				var row = this.rows.pop();

				for(var i = 0; i < row.length; i++)
				{
					row[i].destroy();
				}
			}
		},

		/**
		 * Clear all elements from form.
		 *
		 * @method removeAll
		 */
		removeAll : function()
		{
			for(var i = 0; i < this.rows.length; i++)
			{
				for(var j = 0; j < this.rows[i].length; j++)
				{
					this.rows[i][j].destroy();
				}
			}

			this.rows = [];
			this.rows.push([]);
		},

		updateSize : function()
		{
			var x = 0, y = 0;
			var sizeX = 0;

			if(!this.autoSize)
			{
				x = this.spacing.x;
				y = this.spacing.y;
			}

			for(var i = 0; i < this.rows.length; i++)
			{
				var maxSizeY = 0;

				for(var j = 0; j < this.rows[i].length; j++)
				{
					var element = this.rows[i][j];
					
					if(element.visible)
					{
						//Resize last element
						if(this.fitElements && j === this.rows[i].length - 1)
						{
							element.size.x = this.size.x - x - 15;
						}

						element.position.set(x, y);
						element.updateInterface();

						//Size tracker
						if(element.size.y > maxSizeY)
						{
							maxSizeY = element.size.y;
						}

						x += element.size.x + this.spacing.x;
					}
				}

				//Form size x
				if(sizeX < x)
				{
					sizeX = x;
				}

				//Update position tracker
				if(x !== 0)
				{
					x = this.autoSize ? 0 : this.spacing.x;
					y += maxSizeY + this.spacing.y;
				}
			}

			if(this.autoSize)
			{
				this.size.set(sizeX, y);
			}

			Panel.prototype.updateSize.call(this);
		}

	 });


	return base.RowsPanel = RowsPanel;
});
define('skylark-widgets-base/dnd/DragBuffer',[
],function(){	
	"use strict";

	/**
	 * The drag buffer is a global object used to store and get object being dragged.
	 *
	 * Objects are stored in an array and are indetified with a UUID.
	 *
	 * @static
	 * @class DragBuffer
	 */
	var DragBuffer = {};

	/**
	 * Object drag buffer, stores objects being dragged.
	 *
	 * @attribute buffer
	 */
	DragBuffer.buffer = [];

	/** 
	 * Push elemento to drag buffer.
	 *
	 * Checks if element dont exist on drag buffer before inserting.
	 *
	 * @method push
	 */
	DragBuffer.push = function(obj)
	{
		if(DragBuffer.buffer.indexOf(obj) === -1)
		{
			DragBuffer.buffer.push(obj);
		}
	};

	/** 
	 * Get element from drag buffer using its identifier.
	 *
	 * @method pop
	 * @return {Object} Object indentfied by uuid, if not found return null.
	 */
	DragBuffer.pop = function(uuid)
	{
		for(var i = 0; i < DragBuffer.buffer.length; i++)
		{
			if(DragBuffer.buffer[i].uuid === uuid)
			{
				var obj = DragBuffer.buffer[i];
				DragBuffer.buffer.splice(i, 1);
				return obj;
			}
		}

		return null;
	};

	/** 
	 * Get element from drag buffer without removing it.
	 *
	 * @method get
	 * @return {Object} Object indentfied by uuid, if not found return null.
	 */
	DragBuffer.get = function(uuid)
	{
		for(var i = 0; i < DragBuffer.buffer.length; i++)
		{
			if(DragBuffer.buffer[i].uuid === uuid)
			{
				return DragBuffer.buffer[i];
			}
		}
		
		return null;
	};

	return DragBuffer;
});
define('skylark-widgets-base/skins/SkinDark',[
	"./SkinManager"
],function(SkinManager){	
	"use strict";

	function SkinDark() {
		this.font = "Arial";

		//Color
		this.barColor = "#222222";
		this.sepColor = "#292929";
		this.panelColor = "#333333";
		this.resizeTabColor = "#222222";
		this.boxColor = "#444444";
		this.textColor = "#FFFFFF";
		this.iconColor = "#FFFFFF";

		//Button
		this.buttonColor = "#222222";
		this.buttonOverColor = "#555555";
		this.buttonLightColor = "#333333";
		
		//Audio player
		this.audioTrack = "#222222";
		this.audioScrubber = "#FFFFFF";
		this.audioProgress = "#555555";

		//Body
		document.body.style.fontFamily = this.font;
		document.body.style.color = this.textColor;
		document.body.style.fontSize = "12px";
	}


	var skin = new SkinDark();

	SkinManager.register(skin, "dark");

	return skin;

});

define('skylark-widgets-base/main',[
	"./base",
	"./Widget",
	"./CanvasPane",
	"./ImagePane",
	"./TextPane",
	"./SubmitForm",
	"./actions/Action",
	"./actions/ActionManager",
	"./panels/DualContainer",
    "./panels/DualPanel",
    "./panels/RowsPanel",
    "./dnd/DragBuffer",
	"./skins/SkinManager",
	"./skins/SkinDark"
],function(base){
	return base;
});
define('skylark-widgets-base', ['skylark-widgets-base/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-base.js.map
