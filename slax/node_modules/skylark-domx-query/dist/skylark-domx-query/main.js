/**
 * skylark-domx-query - The skylark query library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./query","skylark-domx-styler"],function(s,a){return s.fn.style=s.wraps.wrapper_name_value(a.css,a),s.fn.css=s.wraps.wrapper_name_value(a.css,a),s.fn.hasClass=s.wraps.wrapper_some_chk(a.hasClass,a),s.fn.addClass=s.wraps.wrapper_every_act_firstArgFunc(a.addClass,a,a.className),s.fn.removeClass=s.wraps.wrapper_every_act_firstArgFunc(a.removeClass,a,a.className),s.fn.toggleClass=s.wraps.wrapper_every_act_firstArgFunc(a.toggleClass,a,a.className),s.fn.replaceClass=function(s,a){return this.removeClass(a),this.addClass(s),this},s.fn.replaceClass=function(s,a){return this.removeClass(a),this.addClass(s),this},s});
//# sourceMappingURL=sourcemaps/main.js.map
