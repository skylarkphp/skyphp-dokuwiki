/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var n=require("assert");n.position=function(t,e,r){n.equal(t.row,e),n.equal(t.column,r)},n.range=function(t,e,r,o,a){n.position(t.start,e,r),n.position(t.end,o,a)},n.notOk=function(t){n.equal(t,!1)},n.jsonEquals=function(t,e){n.equal(JSON.stringify(t),JSON.stringify(e))},n.domNode=function(t,e){Array.isArray(t)||(t=function n(t){var e={};var r=t.attributes;if(!r)return t.data;if("number"==typeof r.length)for(var o=0;o<r.length;o++)e[r[o].name]=r[o].value;var a=[t.localName,e];for(var o=0;o<t.childNodes.length;o++){var i=n(t.childNodes[o]);i&&a.push(i)}return a}(t)),n.deepEqual(t,e)},module.exports=n});
//# sourceMappingURL=../sourcemaps/test/assertions.js.map
