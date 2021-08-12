/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./objects","./_mixin","./_parse_mixin_args"],function(n,e,r,t){return e.mixin=function(){var n=t.apply(this,arguments);return n.sources.forEach(function(e){r(n.target,e,n.deep,!1)}),n.target}});
//# sourceMappingURL=sourcemaps/mixin.js.map
