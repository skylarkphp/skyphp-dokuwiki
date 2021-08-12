/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./objects","./_mixin","./_parse_mixin_args"],function(e,n,i){return e.safeMixin=function(){var e=i.apply(this,arguments);return e.sources.forEach(function(i){n(e.target,i,e.deep,!0)}),e.target}});
//# sourceMappingURL=sourcemaps/safe-mixin.js.map
