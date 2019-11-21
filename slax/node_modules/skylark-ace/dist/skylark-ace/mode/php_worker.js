/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../lib/oop"),r=t("../worker/mirror").Mirror,s=t("./php/php").PHP,o=e.PhpWorker=function(t){r.call(this,t),this.setTimeout(500)};n.inherits(o,r),function(){this.setOptions=function(t){this.inlinePhp=t&&t.inline},this.onUpdate=function(){var t=this.doc.getValue(),e=[];this.inlinePhp&&(t="<?"+t+"?>");var i=s.Lexer(t,{short_open_tag:1});try{new s.Parser(i)}catch(t){e.push({row:t.line-1,column:null,text:t.message.charAt(0).toUpperCase()+t.message.substring(1),type:"error"})}this.sender.emit("annotate",e)}}.call(o.prototype)});
//# sourceMappingURL=../sourcemaps/mode/php_worker.js.map
