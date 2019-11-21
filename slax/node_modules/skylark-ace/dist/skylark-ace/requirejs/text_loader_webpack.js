/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
"use strict";module.exports=function(t){return this.fs&&this.resourcePath&&(t=this.fs.readFileSync(this.resourcePath).toString("utf8")),t=t.replace(/\/\*(?:[^*]|[*](?=[^\/]))+\*\//g,"").replace(/^[ \t]+/gm,""),"module.exports = "+JSON.stringify(t).replace(/[\u2028\u2029]/g,function(t){t.charCodeAt(0).toString(16)})};
//# sourceMappingURL=../sourcemaps/requirejs/text_loader_webpack.js.map
