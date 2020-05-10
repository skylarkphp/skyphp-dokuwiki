/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("ace/editor").Editor;module.exports.init=function(e){t.prototype.showKeyboardShortcuts=function(){!function(t){if(!document.getElementById("kbshortcutmenu")){var e=require("./menu_tools/overlay_page").overlayPage,o=(0,require("./menu_tools/get_editor_keyboard_shortcuts").getEditorKeybordShortcuts)(t),n=document.createElement("div"),s=o.reduce(function(t,e){return t+'<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">'+e.command+'</span> : <span class="ace_optionsMenuKey">'+e.key+"</span></div>"},"");n.id="kbshortcutmenu",n.innerHTML="<h1>Keyboard Shortcuts</h1>"+s+"</div>",e(t,n,"0","0","0",null)}}(this)},e.commands.addCommands([{name:"showKeyboardShortcuts",bindKey:{win:"Ctrl-Alt-h",mac:"Command-Alt-h"},exec:function(t,e){t.showKeyboardShortcuts()}}])}});
//# sourceMappingURL=../sourcemaps/ext/keybinding_menu.js.map
