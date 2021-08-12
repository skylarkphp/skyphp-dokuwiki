/**
 * skylark-codemirror-base - A version of codemirror 5.45 core library that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror-base/
 * @license MIT
 */
define(["skylark-langx/skylark","./edit/CodeMirror","./util/event","./util/misc","./edit/options","./edit/methods","./model/Doc","./input/ContentEditableInput","./input/TextareaInput","./modes","./edit/fromTextArea","./edit/legacy"],function(e,t,n,o,i,r,d,p,l,a,s,f){"use strict";i.defineOptions(t),r(t);let u="iter insert remove copy getEditor constructor".split(" ");for(let e in d.prototype)d.prototype.hasOwnProperty(e)&&o.indexOf(u,e)<0&&(t.prototype[e]=function(e){return function(){return e.apply(this.doc,arguments)}}(d.prototype[e]));return n.eventMixin(d),t.inputStyles={textarea:l,contenteditable:p},t.defineMode=function(e){t.defaults.mode||"null"==e||(t.defaults.mode=e),a.defineMode.apply(this,arguments)},t.defineMIME=a.defineMIME,t.defineMode("null",()=>({token:e=>e.skipToEnd()})),t.defineMIME("text/plain","null"),t.defineExtension=((e,n)=>{t.prototype[e]=n}),t.defineDocExtension=((e,t)=>{d.prototype[e]=t}),t.fromTextArea=s.fromTextArea,f.addLegacyProps(t),t.version="5.45.0",e.attach("intg.CodeMirror",t)});
//# sourceMappingURL=sourcemaps/codemirror.js.map
