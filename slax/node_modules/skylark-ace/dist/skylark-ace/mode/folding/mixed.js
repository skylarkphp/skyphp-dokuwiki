/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,o){"use strict";var d=t("../../lib/oop"),i=t("./fold_mode").FoldMode,n=e.FoldMode=function(t,e){this.defaultMode=t,this.subModes=e};d.inherits(n,i),function(){this.$getMode=function(t){for(var e in"string"!=typeof t&&(t=t[0]),this.subModes)if(0===t.indexOf(e))return this.subModes[e];return null},this.$tryMode=function(t,e,o,d){var i=this.$getMode(t);return i?i.getFoldWidget(e,o,d):""},this.getFoldWidget=function(t,e,o){return this.$tryMode(t.getState(o-1),t,e,o)||this.$tryMode(t.getState(o),t,e,o)||this.defaultMode.getFoldWidget(t,e,o)},this.getFoldWidgetRange=function(t,e,o){var d=this.$getMode(t.getState(o-1));return d&&d.getFoldWidget(t,e,o)||(d=this.$getMode(t.getState(o))),d&&d.getFoldWidget(t,e,o)||(d=this.defaultMode),d.getFoldWidgetRange(t,e,o)}}.call(n.prototype)});
//# sourceMappingURL=../../sourcemaps/mode/folding/mixed.js.map
