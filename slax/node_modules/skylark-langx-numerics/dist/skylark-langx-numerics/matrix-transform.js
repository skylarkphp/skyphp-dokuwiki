/**
 * skylark-langx-numerics - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./numerics","./transform"],function(n,t){var r=t.inherit({klassName:"MatrixTransform",value:{get:function(){return this.matrix.clone()}},matrix:{get:function(){return this._.matrix}},clone:function(){},transform:function(n){},transformBounds:function(n){},_construct:function(n){(this._={}).matrix=n}});return n.MatrixTransform=r});
//# sourceMappingURL=sourcemaps/matrix-transform.js.map
