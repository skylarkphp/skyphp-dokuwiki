/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var o=e("ace/ext/options").OptionPanel,i=e("./menu_tools/overlay_page").overlayPage;n.exports.init=function(t){e("ace/editor").Editor.prototype.showSettingsMenu=function(){!function(e){if(!document.getElementById("ace_settingsmenu")){var t=new o(e);t.render(),t.container.id="ace_settingsmenu",i(e,t.container,"0","0","0"),t.container.querySelector("select,input,button,checkbox").focus()}}(this)}}});
//# sourceMappingURL=../sourcemaps/ext/settings_menu.js.map
