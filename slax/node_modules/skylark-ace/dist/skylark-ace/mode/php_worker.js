/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("../worker/mirror").Mirror,i=require("./php/php").PHP,n=exports.PhpWorker=function(t){e.call(this,t),this.setTimeout(500)};t.inherits(n,e),function(){this.setOptions=function(t){this.inlinePhp=t&&t.inline},this.onUpdate=function(){var t=this.doc.getValue(),e=[];this.inlinePhp&&(t="<?"+t+"?>");var n=i.Lexer(t,{short_open_tag:1});try{new i.Parser(n)}catch(t){e.push({row:t.line-1,column:null,text:t.message.charAt(0).toUpperCase()+t.message.substring(1),type:"error"})}this.sender.emit("annotate",e)}}.call(n.prototype)});
//# sourceMappingURL=../sourcemaps/mode/php_worker.js.map
