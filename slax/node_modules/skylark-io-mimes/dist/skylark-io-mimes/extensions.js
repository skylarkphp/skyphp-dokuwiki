/**
 * skylark-io-mimes - The skylark mime type utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./mimes","./types"],function(r,n,e){var i={};for(var s in e){var t=e[s];r.isString(t)&&(t=[t]);for(var a=0;a<t.length;a++){var v=t[a];i[v]?r.isString(i[v])?i[v]=[i[v],s]:i[v].push(s):i[v]=s}}return n.extenstions=i});
//# sourceMappingURL=sourcemaps/extensions.js.map
