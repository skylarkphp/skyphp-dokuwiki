/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){require("../config");var n=require("../occur").Occur,e={name:"occur",exec:function(e,a){var o=!!e.session.$occur;(new n).enter(e,a)&&!o&&r.installIn(e)},readOnly:!0},a=[{name:"occurexit",bindKey:"esc|Ctrl-G",exec:function(n){var e=n.session.$occur;e&&(e.exit(n,{}),n.session.$occur||r.uninstallFrom(n))},readOnly:!0},{name:"occuraccept",bindKey:"enter",exec:function(n){var e=n.session.$occur;e&&(e.exit(n,{translatePosition:!0}),n.session.$occur||r.uninstallFrom(n))},readOnly:!0}],o=require("../keyboard/hash_handler").HashHandler;function r(){}require("../lib/oop").inherits(r,o),function(){this.isOccurHandler=!0,this.attach=function(n){o.call(this,a,n.commands.platform),this.$editor=n};var n=this.handleKeyboard;this.handleKeyboard=function(e,a,o,r){var c=n.call(this,e,a,o,r);return c&&c.command?c:void 0}}.call(r.prototype),r.installIn=function(n){var e=new this;n.keyBinding.addKeyboardHandler(e),n.commands.addCommands(a)},r.uninstallFrom=function(n){n.commands.removeCommands(a);var e=n.getKeyboardHandler();e.isOccurHandler&&n.keyBinding.removeKeyboardHandler(e)},exports.occurStartCommand=e});
//# sourceMappingURL=../sourcemaps/commands/occur_commands.js.map
