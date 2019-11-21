/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(n,t,e){"use strict";var r=n("assert");r.position=function(n,t,e){r.equal(n.row,t),r.equal(n.column,e)},r.range=function(n,t,e,o,a){r.position(n.start,t,e),r.position(n.end,o,a)},r.notOk=function(n){r.equal(n,!1)},r.jsonEquals=function(n,t){r.equal(JSON.stringify(n),JSON.stringify(t))},r.domNode=function(n,t){Array.isArray(n)||(n=function n(t){var e={};var r=t.attributes;if(!r)return t.data;if("number"==typeof r.length)for(var o=0;o<r.length;o++)e[r[o].name]=r[o].value;var a=[t.localName,e];for(var o=0;o<t.childNodes.length;o++){var i=n(t.childNodes[o]);i&&a.push(i)}return a}(n)),r.deepEqual(n,t)},e.exports=r});
//# sourceMappingURL=../sourcemaps/test/assertions.js.map
