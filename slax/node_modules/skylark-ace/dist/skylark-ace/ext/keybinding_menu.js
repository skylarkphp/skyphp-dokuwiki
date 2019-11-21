/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,o){"use strict";var n=t("ace/editor").Editor;o.exports.init=function(e){n.prototype.showKeyboardShortcuts=function(){!function(e){if(!document.getElementById("kbshortcutmenu")){var o=t("./menu_tools/overlay_page").overlayPage,n=(0,t("./menu_tools/get_editor_keyboard_shortcuts").getEditorKeybordShortcuts)(e),s=document.createElement("div"),r=n.reduce(function(t,e){return t+'<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">'+e.command+'</span> : <span class="ace_optionsMenuKey">'+e.key+"</span></div>"},"");s.id="kbshortcutmenu",s.innerHTML="<h1>Keyboard Shortcuts</h1>"+r+"</div>",o(e,s,"0","0","0",null)}}(this)},e.commands.addCommands([{name:"showKeyboardShortcuts",bindKey:{win:"Ctrl-Alt-h",mac:"Command-Alt-h"},exec:function(t,e){t.showKeyboardShortcuts()}}])}});
//# sourceMappingURL=../sourcemaps/ext/keybinding_menu.js.map
