/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(r,n,e){"use strict";var t=r("../../lib/keys");e.exports.getEditorKeybordShortcuts=function(r){t.KEY_MODS;var n=[],e={};return r.keyBinding.$handlers.forEach(function(r){var t=r.commandKeyBinding;for(var i in t){var o=i.replace(/(^|-)\w/g,function(r){return r.toUpperCase()}),a=t[i];Array.isArray(a)||(a=[a]),a.forEach(function(r){"string"!=typeof r&&(r=r.name),e[r]?e[r].key+="|"+o:(e[r]={key:o,command:r},n.push(e[r]))})}}),n}});
//# sourceMappingURL=../../sourcemaps/ext/menu_tools/get_editor_keyboard_shortcuts.js.map
