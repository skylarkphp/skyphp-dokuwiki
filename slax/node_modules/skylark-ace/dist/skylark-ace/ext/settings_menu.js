/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("ace/ext/options").OptionPanel,t=require("./menu_tools/overlay_page").overlayPage;module.exports.init=function(n){require("ace/editor").Editor.prototype.showSettingsMenu=function(){!function(n){if(!document.getElementById("ace_settingsmenu")){var o=new e(n);o.render(),o.container.id="ace_settingsmenu",t(n,o.container,"0","0","0"),o.container.querySelector("select,input,button,checkbox").focus()}}(this)}}});
//# sourceMappingURL=../sourcemaps/ext/settings_menu.js.map
