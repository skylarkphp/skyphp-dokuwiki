define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-lists",
  "skylark-domx-plugins-base",
  "./menus",
  "./menu"
],function(langx,$,lists,plugins,menus,Menu){
  'use strict'

  var NavMenu = Menu.inherit({
    klassName : "NavMenu",

    pluginName : "lark.menus.nav",

    options : {
      item : {
        templates : {
        } 
      }
    },

    _construct : function(elm,options) {
        Menu.prototype._construct.call(this,elm,options);

        if (this.options.data.items) {
          this.resetItems(this.options.data.items);
        }

        lists.multitier(elm, {
          togglable : false,

          classes : {
            active :  this.options.item.classes.active  // active
           /// collapse : "collapse",
           /// in : "in",
          },

          selectors : {
            item : this.options.item.selectors.general,          //li
            sublist : this.options.submenu.selectors.descendant, //"ul",
            hasSublist : this.options.item.selectors.hasChildren//":has(ul)",
            ///handler : " > a"
          },

          multiExpand : false

        });
    },

    resetItems : function(itemsData) {
      let self = this;

      function renderItem(itemData,$container) {
        let $item;
        if (itemData.children) {
          $item = self.renderHasChildrenMenuItem(itemData);
        } else {
          $item = self.renderGeneralMenuItem(itemData);
        }

        $item.data("item",itemData);
        $container.append($item)

        if (itemData.children) {
          let $childrenContainer = $item.find(self.options.submenu.selectors.children);
          itemData.children.forEach((childItemData) => {
            renderItem(childItemData,$childrenContainer);            
          });
        }
      }
        
      let $itemsContainer = this.$(this.options.selectors.container)

      itemsData.forEach((itemData)=>{
        renderItem(itemData,$itemsContainer);
      });
    }

  });


  plugins.register(NavMenu);

  return menus.NavMenu = NavMenu;	
});