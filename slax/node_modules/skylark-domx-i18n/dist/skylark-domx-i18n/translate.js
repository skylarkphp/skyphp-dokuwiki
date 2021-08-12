/**
 * skylark-domx-i18n - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./i18n","./Translator"],function(n,t){return n.translate=function(n,e,r){var a=r,i=e;return"function"==typeof e&&(a=e,i=null),("string"==typeof n||n instanceof String)&&""!==n?t.create(i).translate(n).then(function(n){return a&&setTimeout(a,0,n),n},function(n){console.warn("Translation failed: "+n.stack)}):a("")}});
//# sourceMappingURL=sourcemaps/translate.js.map
