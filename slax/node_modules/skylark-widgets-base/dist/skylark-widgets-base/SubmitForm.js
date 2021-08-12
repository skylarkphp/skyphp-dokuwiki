/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./base","./Widget"],function(t,i){"use strict";var e=i.inherit({_construct:function(t){i.prototype._construct.call(this,t,"form"),this._elm.autocomplete=!0,this._elm.noValidate=!0,this._elm.action="javascript:void(0)",this._elm.addEventListener("submit",function(t){return t.preventDefault(),!1})},submit:function(){this._elm.submit()}});return t.SubmitForm=e});
//# sourceMappingURL=sourcemaps/SubmitForm.js.map
