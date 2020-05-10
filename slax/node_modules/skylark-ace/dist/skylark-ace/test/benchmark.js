/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
"undefined"!=typeof process&&require("amd-loader"),define(function(require,exports,module){"use strict";var e=require("../edit_session").EditSession;module.exports={setUp:function(){this.start=Date.now()},tearDown:function(){console.log("took: ",Date.now()-this.start+"ms")},"test: document to screen position":function(){for(var o=new e(Array(6e3).join("someText\n")),n=0;n<6e3;n++)o.documentToScreenPosition(n,0);for(n=0;n<6e3;n++)o.documentToScreenPosition(n,0);console.log(o.$rowCache.length)},"test: screen to document position":function(){for(var o=new e(Array(6e3).join("someText\n")),n=0;n<6e3;n++)o.screenToDocumentPosition(n,0);for(n=0;n<6e3;n++)o.documentToScreenPosition(n,0);console.log(o.$rowCache.length)}}}),"undefined"!=typeof module&&module===require.main&&require("asyncjs").test.testcase(module.exports).exec();
//# sourceMappingURL=../sourcemaps/test/benchmark.js.map
