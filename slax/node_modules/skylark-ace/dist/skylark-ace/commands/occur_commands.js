/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(n,e,a){n("../config");var o=n("../occur").Occur,r={name:"occur",exec:function(n,e){var a=!!n.session.$occur;(new o).enter(n,e)&&!a&&t.installIn(n)},readOnly:!0},c=[{name:"occurexit",bindKey:"esc|Ctrl-G",exec:function(n){var e=n.session.$occur;e&&(e.exit(n,{}),n.session.$occur||t.uninstallFrom(n))},readOnly:!0},{name:"occuraccept",bindKey:"enter",exec:function(n){var e=n.session.$occur;e&&(e.exit(n,{translatePosition:!0}),n.session.$occur||t.uninstallFrom(n))},readOnly:!0}],i=n("../keyboard/hash_handler").HashHandler;function t(){}n("../lib/oop").inherits(t,i),function(){this.isOccurHandler=!0,this.attach=function(n){i.call(this,c,n.commands.platform),this.$editor=n};var n=this.handleKeyboard;this.handleKeyboard=function(e,a,o,r){var c=n.call(this,e,a,o,r);return c&&c.command?c:void 0}}.call(t.prototype),t.installIn=function(n){var e=new this;n.keyBinding.addKeyboardHandler(e),n.commands.addCommands(c)},t.uninstallFrom=function(n){n.commands.removeCommands(c);var e=n.getKeyboardHandler();e.isOccurHandler&&n.keyBinding.removeKeyboardHandler(e)},e.occurStartCommand=r});
//# sourceMappingURL=../sourcemaps/commands/occur_commands.js.map
