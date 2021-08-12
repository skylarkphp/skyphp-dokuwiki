/**
 * skylark-domx-i18n - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-query","./i18n","./Translator"],function(n,a,t){return a.addTranslation=function(n,a,r){t.create(n).getTranslation(a).then(function(n){assign(n,r)})}});
//# sourceMappingURL=sourcemaps/addTranslation.js.map
