define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus"
],function(langx,$,lists,plugins,menus){
  'use strict'


  var Menu = plugins.Plugin.inherit({
    klassName : "Menu",

    pluginName : "lark.menus.menu",

    options : {
      template : "",

      classes : {
        base : "lark-menu"
      },

      selectors : {
        container : null
      },

      item : {
        templates : {
          general : '<li class="menu-item"><a href="#" class="link"><%= title %></a></li>',
          separator : "",
          hasChildren : '<li class="menu-item hasChildren"><a href="#" class="link"><%= title %></a><ul class="submenu"></ul>',
        },

        classes : {
          base : "menu-item",
          active : "active",
          hasChildren : "hasChildren"
        },

        selectors : {
          general : "li",
          hasChildren : ":has(ul)"
        }
      },

      submenu : {
        template : "<ul></ul>",
        classes : {
          base : "submenu"
        },
        selectors : {
          children : "> ul",
          descendant : "ul"
        }
      },

      data : {
        ///items : []
      },

      onAction : null
    },

    _construct : function(elm,options) {
        plugins.Plugin.prototype._construct.call(this,elm,options);

        this._$container = this.$(this.options.selectors.container);

        if (this.options.onAction) {
          this.listenTo(this._$container,"click",`.${this.options.item.classes.base}`,(e)=>{
              var itemData = $(e.currentTarget).data("item");
              this.options.onAction(itemData);

          });
        }

    },

    renderMenuItemHtml : function(itemData) {
      if (!this._renderItemHtml) {
        let itemTpl = this.options.item.template;
        if (langx.isString(itemTpl)) {
          this._renderItemHtml = langx.template(itemTpl);
        } else if (langx.isFunction(itemTpl)) {
          this._renderItemHtml = itemTpl;
        }
      }

      return this._renderItemHtml(itemData);
    },

    renderGeneralMenuItem : function(itemData) {
      if (!this._renderGeneralItemHtml) {
        let itemTpl = this.options.item.templates.general;
        if (langx.isString(itemTpl)) {
          this._renderGeneralItemHtml = langx.template(itemTpl);
        } else if (langx.isFunction(itemTpl)) {
          this._renderGeneralItemHtml = itemTpl;
        }
      }
      return $(this._renderGeneralItemHtml(itemData));
    },

    renderHasChildrenMenuItem : function(itemData) {
      if (!this._renderHasChildrenItemHtml) {
        let itemTpl = this.options.item.templates.hasChildren;
        if (langx.isString(itemTpl)) {
          this._renderHasChildrenItemHtml = langx.template(itemTpl);
        } else if (langx.isFunction(itemTpl)) {
          this._renderHasChildrenItemHtml = itemTpl;
        }
      }

      return $(this._renderHasChildrenItemHtml(itemData));
    }   


  });


  plugins.register(Menu);

  return menus.Menu = Menu; 
});