/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(s,n,t){"use strict";n.applyDelta=function(s,n,t){var e=n.start.row,i=n.start.column,r=s[e]||"";switch(n.action){case"insert":if(1===n.lines.length)s[e]=r.substring(0,i)+n.lines[0]+r.substring(i);else{var l=[e,1].concat(n.lines);s.splice.apply(s,l),s[e]=r.substring(0,i)+s[e],s[e+n.lines.length-1]+=r.substring(i)}break;case"remove":var a=n.end.column,c=n.end.row;e===c?s[e]=r.substring(0,i)+r.substring(a):s.splice(e,c-e+1,r.substring(0,i)+s[c].substring(a))}}});
//# sourceMappingURL=sourcemaps/apply_delta.js.map
