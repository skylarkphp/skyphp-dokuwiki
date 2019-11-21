/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
"undefined"!=typeof process&&require("amd-loader"),define(function(e,o,n){"use strict";var t=e("../edit_session").EditSession;n.exports={setUp:function(){this.start=Date.now()},tearDown:function(){console.log("took: ",Date.now()-this.start+"ms")},"test: document to screen position":function(){for(var e=new t(Array(6e3).join("someText\n")),o=0;o<6e3;o++)e.documentToScreenPosition(o,0);for(o=0;o<6e3;o++)e.documentToScreenPosition(o,0);console.log(e.$rowCache.length)},"test: screen to document position":function(){for(var e=new t(Array(6e3).join("someText\n")),o=0;o<6e3;o++)e.screenToDocumentPosition(o,0);for(o=0;o<6e3;o++)e.documentToScreenPosition(o,0);console.log(e.$rowCache.length)}}}),"undefined"!=typeof module&&module===require.main&&require("asyncjs").test.testcase(module.exports).exec();
//# sourceMappingURL=../sourcemaps/test/benchmark.js.map
