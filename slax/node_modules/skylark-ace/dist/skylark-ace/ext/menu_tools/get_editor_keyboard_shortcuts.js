/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var r=require("../../lib/keys");module.exports.getEditorKeybordShortcuts=function(n){r.KEY_MODS;var e=[],t={};return n.keyBinding.$handlers.forEach(function(r){var n=r.commandKeyBinding;for(var i in n){var o=i.replace(/(^|-)\w/g,function(r){return r.toUpperCase()}),a=n[i];Array.isArray(a)||(a=[a]),a.forEach(function(r){"string"!=typeof r&&(r=r.name),t[r]?t[r].key+="|"+o:(t[r]={key:o,command:r},e.push(t[r]))})}}),e}});
//# sourceMappingURL=../../sourcemaps/ext/menu_tools/get_editor_keyboard_shortcuts.js.map
