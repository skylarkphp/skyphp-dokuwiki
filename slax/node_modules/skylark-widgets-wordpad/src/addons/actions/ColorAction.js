define([
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  

   var ColorAction = Action.inherit({
    name : 'color',

    icon : 'fontColor',

    disableTag : 'pre',

    menu : true

   });

   addons.actions.color = ColorAction; 


   return ColorAction;
	
});