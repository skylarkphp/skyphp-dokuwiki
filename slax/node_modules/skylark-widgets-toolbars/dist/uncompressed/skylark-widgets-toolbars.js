/**
 * skylark-widgets-toolbars - The skylark toolbar widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-toolbars/
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

define('skylark-widgets-toolbars/toolbars',[
	"skylark-langx-ns"
],function(skylark){
	return skylark.attach("widgets.toolbars",{});
});
define('skylark-widgets-toolbars/toolbar-item',[
  "skylark-langx-types",
  "skylark-domx-query",
  "skylark-widgets-base/widget",
  "./toolbars"  
],function(types, $, Widget,toolbars){ 
  var slice = [].slice;

  var ToolbarItem = Widget.inherit( {

    options : {
      template: '<li><a tabindex="-1" unselectable="on" class="toolbar-item" href="javascript:;"><span></span></a></li>',

      menu : {
        menuWrapper: '<div class="toolbar-menu"></div>',
        menuItem: '<li><a tabindex="-1" unselectable="on" class="menu-item" href="javascript:;"><span></span></a></li>',
        separator: '<li><span class="separator"></span></li>'      
      }

    },

    _construct : function(opts) {
      this.action = opts.action;
      this.toolbar = opts.toolbar;
      //this.editor = opts.toolbar.editor;
      Widget.prototype._construct.call(this,opts);
    },

    _init : function() {
      var k, len, ref, tag;
      //this.render();

      //this.wrapper = $(this._tpl.item).appendTo(this.toolbar.list);
      this.toolbar.addToolItem(this);
      this.wrapper = $(this._elm);

      this.el = this.wrapper.find('a.toolbar-item');
      this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
      this.setIcon(this.icon);
      if (this.menu) {
          this.menuWrapper = $(this.options.menu.menuWrapper).appendTo(this.wrapper);
          this.menuWrapper.addClass("toolbar-menu-" + this.name);
      
          this.renderMenu();
      }

      var _this = this;
      this.el.on('mousedown', function(e) {
          var exceed, noFocus, param;
          e.preventDefault();
          //noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
          if (_this.el.hasClass('disabled')) {
            return false;
          }
          //if (noFocus) {
          //  _this.editor.focus();
          //}
          if (_this.menu) {
            _this.wrapper.toggleClass('menu-on').siblings('li').removeClass('menu-on');
            if (_this.wrapper.is('.menu-on')) {
              //exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.editor.wrapper.offset().left - _this.editor.wrapper.outerWidth();
              exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.toolbar.offset().left - _this.toolbar.outerWidth();
              if (exceed > 0) {
                _this.menuWrapper.css({
                  'left': 'auto',
                  'right': 0
                });
              }
              _this.trigger('menuexpand');
            }
            return false;
          }
          param = _this.el.data('param');
          _this.command(param);
          return false;
      });
      this.wrapper.on('click', 'a.menu-item', function(e) {
          var btn, noFocus, param;
          e.preventDefault();
          btn = $(e.currentTarget);
          _this.wrapper.removeClass('menu-on');
          ///noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
          if (btn.hasClass('disabled') || noFocus) {
            return false;
          }
          _this.toolbar.removeClass('menu-on');
          param = btn.data('param');
          _this.command(param);
          return false;
      });
      this.wrapper.on('mousedown', 'a.menu-item', function(e) {
        return false;
      });

      this.action.state.on("changed", function(e,args) {
        var updates = args.data;
        if (updates["active"] !== undefined) {
          _this._doActive(updates["active"].value);
        }

        if (updates["disabled"] !== undefined) {
          _this._doDisabled(updates["disabled"].value);
        }

      });
    },

    _doActive : function(value) {
      return this.el.toggleClass('active', value);
    },

    _doDisabled : function(value) {
      return this.el.toggleClass('disabled', value);
    },

    iconClassOf : function(icon) {
      if (icon) {
        //if (this.editor.options.classes.icons[icon]) {
        //  return this.editor.options.classes.icons[icon];
        if (this.toolbar.options.classes && this.toolbar.options.classes.icons && this.toolbar.options.classes.icons[icon]) {
          return  this.toolbar.options.classes.icons[icon];
        } else {
          return "wordpad-icon wordpad-icon-" + icon;
        }
      } else {
        return '';
      }
    },

    setIcon : function(icon) {
      return this.el.find('span').removeClass().addClass(this.iconClassOf(icon)).text(this.text);
    },

    render : function() {

      //this.wrapper = $(this._tpl.item).appendTo(this.toolbar.list);
      this.toolbar.addToolItem(this);
      this.wrapper = $(this._elm);

      this.el = this.wrapper.find('a.toolbar-item');
      this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
      this.setIcon(this.icon);
      if (!this.menu) {
        return;
      }
      this.menuWrapper = $(this.options.menu.menuWrapper).appendTo(this.wrapper);
      this.menuWrapper.addClass("toolbar-menu-" + this.name);
      return this.renderMenu();
    },

    renderMenu : function() {
      var $menuBtnEl, $menuItemEl, k, len, menuItem, ref, ref1, results;
      if (!types.isArray(this.menu)) {
        return;
      }
      this.menuEl = $('<ul/>').appendTo(this.menuWrapper);
      ref = this.menu;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        menuItem = ref[k];
        if (menuItem === '|') {
          $(this.options.menu.separator).appendTo(this.menuEl);
          continue;
        }
        $menuItemEl = $(this.options.menu.menuItem).appendTo(this.menuEl);
        $menuBtnEl = $menuItemEl.find('a.menu-item').attr({
          'title': (ref1 = menuItem.title) != null ? ref1 : menuItem.text,
          'data-param': menuItem.param
        }).addClass('menu-item-' + menuItem.name);
        if (menuItem.icon) {
          results.push($menuBtnEl.find('span').addClass(this.iconClassOf(menuItem.icon)));
        } else {
          results.push($menuBtnEl.find('span').text(menuItem.text));
        }
      }
      return results;
    },

    command : function(params) {
      this.action.execute(params);
    },

    "name" : {
      get : function() {
        return this.action.name;
      }
    },

    "icon" : {
      get : function() {
        return this.action.icon;
      }
    },

    "title" : {
      get : function() {
        //return this.action.tooltip || i18n.translate(this.action.name);
        return this.action.tooltip ;
      }
    },

    "text" : {
      get : function() {
        return this.action.text;
      }
    },

    "htmlTag" : {
      get : function() {
        return this.action.htmlTag;
      }
    },

    "disableTag" : {
      get : function() {
        return this.action.disableTag;
      }
    },

    "menu" : {
      get : function() {
        return this.action.menu;
      }
    },

    "editable" : {
      get : function() {
        return this._options.editable;
      }
    },

    "active" : {
      get : function() {
        return this.action.active;
      }
    },

    "disabled" : {
      get : function() {
        return this.action.disabled;
      }
    },

    "needFocus" : {
      get : function() {
        return this.action.needFocus;
      }
    },


    "shortcut" : {
      get : function() {
        return this.action.shortcut;
      }
    }


  }); 


  return toolbars.ToolbarItem = ToolbarItem;
});

define('skylark-widgets-toolbars/toolbar',[
  "skylark-domx-query",
  "skylark-domx-plugins-panels/toolbar",
  "skylark-widgets-base/widget",
  "./toolbars",
  "./toolbar-item"
],function($,_Toolbar, Widget,toolbars,ToolbarItem){ 
  var Toolbar = Widget.inherit({
    klassName : "Toolbar",
    pluginName : "lark.wordpad.toolbar",

    options : {
      template : "<div class=\"domx-toolbar\"><ul></ul></div>"
    },

    _construct : function(parent,opts) {
      //this.editor =editor;
      Widget.prototype._construct.call(this,parent,opts);

    },

    _init : function() {
      this._xtoolbar = _Toolbar.instantiate(this._elm,this.options);
      this.buttons = [];
      //this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
      //this.wrapper = $(this._elm).prependTo(this.editor.wrapper);
      
      var actions = this.options.actions;
      for (var i = 0; i < actions.length; i++) {
        var action = actions[i];

        if (action.name === '|') {
          this._xtoolbar.addSeparator();
          continue;
        }

        var toolItemCtor = action.toolItemCtor;

        if (!toolItemCtor) {
          toolItemCtor = ToolbarItem;
        }

        this.buttons.push(new toolItemCtor({
          "action" : action,
          "toolbar" : this
        }));
      }
      //if (this.options.toolbarHidden) {
       // return this.wrapper.hide();
      //}
    },

    addToolItem : function(item) {
      this._xtoolbar.addToolItem(item);
    },

    findButton : function(name) {
      var button;
      button = this._xtoolbar.list.find('.toolbar-item-' + name).data('button');
      return button != null ? button : null;
    }
  });


  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return toolbars.Toolbar = Toolbar;

});
define('skylark-widgets-toolbars/main',[
	"./toolbars",
	"./toolbar",
	"./toolbar-item"
],function(toolbars){
	return toolbars;
});
define('skylark-widgets-toolbars', ['skylark-widgets-toolbars/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-toolbars.js.map
