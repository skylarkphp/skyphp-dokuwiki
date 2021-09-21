/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-objects","skylark-langx-events/emitter","skylark-data-collection/hash-map","../base","./action-manager"],function(t,e,n,i,a){var c=e.inherit({klassName:"Action",name:"",category:"",text:"",tooltip:"",icon:"",shortcut:"",state:{get:function(){return this._state||(this._state=new n({checked:!1,disabled:!1}))}},_construct:function(e){e&&t.mixin(this,e)},_init:function(){},execute:function(t){this._execute&&this._execute(t),this.trigger("executed",{params:t})}});return i.actions.Action=c});
//# sourceMappingURL=../sourcemaps/actions/action.js.map
