 define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu",
  "skylark-domx-plugins-toggles"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'

  var TreeMenu = Menu.inherit({
    klassName : "Tree",

    pluginName : "lark.menus.tree",

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        lists.multitier(elm,langx.mixin({
          hide : function($el) {
            $el.plugin("lark.toggles.collapse").hide();
          },
          toggle : function($el) {
            $el.plugin("lark.toggles.collapse").toggle();
          }
        },this.options));
    }

  });


  plugins.register(TreeMenu);

  return menus.TreeMenu = TreeMenu;	
});