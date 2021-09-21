/**
 * skylark-langx-numerics - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./numerics","./transform","./matrix-transform"],function(t,n,e){var r=n.inherit({klassName:"ScaleTransform",value:{get:function(){return e.scaleAt(this.scaleX,this.scaleY,this.centerX,this.centerY)}},scaleX:{get:function(){return this._.scaleX}},scaleY:{get:function(){return this._.scaleY}},centerX:{get:function(){return this._.centerX}},centerY:{get:function(){return this._.centerY}},clone:function(){},transform:function(t){},transformBounds:function(t){},_construct:function(t,n,e,r){var c=this._={};c.scaleX=t||1,c.scaleY=n||1,c.centerX=e||0,c.centerY=r||0}});return t.ScaleTransform=r});
//# sourceMappingURL=sourcemaps/scale-transform.js.map
