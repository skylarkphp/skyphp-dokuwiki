/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
"use strict";exports.buildMap=Object.create(null),exports.load=function(e,r,t,p){var a=exports.buildMap;a[e]=require("fs").readFileSync(r.toUrl(e),"utf8"),t(a[e])},exports.write=function(e,r,t,p){if(exports.buildMap[r]){var a=exports.jsEscape(exports.buildMap[r]);t.asModule(e+"!"+r,"define(function () { return '"+a+"';});\n")}},exports.jsEscape=function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")};
//# sourceMappingURL=../sourcemaps/requirejs/text_build.js.map
