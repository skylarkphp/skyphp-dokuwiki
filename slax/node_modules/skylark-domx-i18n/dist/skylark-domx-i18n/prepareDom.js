/**
 * skylark-domx-i18n - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-query","./i18n","./translate"],function(t,r,a){return r.prepareDOM=function(){a("[[language:dir]]",function(r){r&&!t("html").attr("data-dir")&&t("html").css("direction",r).attr("data-dir",r)})}});
//# sourceMappingURL=sourcemaps/prepareDom.js.map
