/**
 * skylark-io-diskfs - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./diskfs"],function(e){var t,i=1/0;return e.select=function(e){var l=(e=e||{}).directory||!1,n=e.multiple||!1,c=e.accept||"",r=e.title||"",a=e.picked;if(!t){var o=t=document.createElement("input");function p(e){for(var t=e.length;t--;)e[t].size>i&&e.splice(t,1);a(e)}o.type="file",o.style.position="fixed",o.style.left=0,o.style.top=0,o.style.opacity=.001,document.body.appendChild(o),o.onchange=function(e){var t=e.target.webkitEntries||e.target.entries;t&&t.length?webentry.all(t).then(function(e){p(e)}):p(Array.prototype.slice.call(e.target.files)),o.value=""}}t.multiple=n,t.accept=c,t.title=r,t.webkitdirectory=l,t.click()}});
//# sourceMappingURL=sourcemaps/select.js.map
