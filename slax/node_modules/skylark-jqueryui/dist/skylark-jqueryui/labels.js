/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","./version","./escape-selector"],function(s){return s.fn.labels=function(){var t,e,i,a,l;return this.length?this[0].labels&&this[0].labels.length?this.pushStack(this[0].labels):(a=this.eq(0).parents("label"),(i=this.attr("id"))&&(l=(t=this.eq(0).parents().last()).add(t.length?t.siblings():this.siblings()),e="label[for='"+s.ui.escapeSelector(i)+"']",a=a.add(l.find(e).addBack(e))),this.pushStack(a)):this.pushStack([])}});
//# sourceMappingURL=sourcemaps/labels.js.map
