/**
 * skylark-langx-logging - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-objects","skylark-langx-constructs/klass","./logging","./levels"],function(e,n,t,o){"use strict";let l=[];var i=n({_level:"info",_construct:function(e){this.name=e,this._logByType=(e=>(n,t,i)=>{const r=o[t],s=new RegExp(`^(${r})$`);if("debug"!==n&&i.unshift(n.toUpperCase()+":"),i.unshift(e+":"),l){l.push([].concat(i));const e=l.length-1e3;l.splice(0,e>0?e:0)}if(!window.console)return;let c=window.console[n];c||"debug"!==n||(c=window.console.info||window.console.log),c&&r&&s.test(n)&&c[Array.isArray(i)?"apply":"call"](window.console,i)})(e)},level:function(e){if("string"==typeof e){if(!o.hasOwnProperty(e))throw new Error(`"${e}" in not a valid log level`);this._level=e}return this._level},error:function(...e){this._logByType("error",this._level,e)},warn:function(...e){this._logByType("warn",this._level,e)},debug:function(...e){this._logByType("debug",this._level,e)},info:function(...e){this._logByType("info",this._level,e)},history:function(){return l?[].concat(l):[]},createLogger:function(e){return new i(this.name?this.name+": "+e:e)}});return e.mixin(i.prototype.history,{enable:function(){null===l&&(l=[])},filter:function(e){return(l||[]).filter(n=>new RegExp(`.*${e}.*`).test(n[0]))},clear:function(){l&&(l.length=0)},disable:function(){null!==l&&(l.length=0,l=null)}}),i.root=new i(""),t.Logger=i});
//# sourceMappingURL=sourcemaps/Logger.js.map
