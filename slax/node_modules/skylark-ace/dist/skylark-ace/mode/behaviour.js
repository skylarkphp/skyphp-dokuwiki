/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,s,t){"use strict";var e=function(){this.$behaviours={}};(function(){this.add=function(i,s,t){switch(void 0){case this.$behaviours:this.$behaviours={};case this.$behaviours[i]:this.$behaviours[i]={}}this.$behaviours[i][s]=t},this.addBehaviours=function(i){for(var s in i)for(var t in i[s])this.add(s,t,i[s][t])},this.remove=function(i){this.$behaviours&&this.$behaviours[i]&&delete this.$behaviours[i]},this.inherit=function(i,s){if("function"==typeof i)var t=(new i).getBehaviours(s);else t=i.getBehaviours(s);this.addBehaviours(t)},this.getBehaviours=function(i){if(i){for(var s={},t=0;t<i.length;t++)this.$behaviours[i[t]]&&(s[i[t]]=this.$behaviours[i[t]]);return s}return this.$behaviours}}).call(e.prototype),s.Behaviour=e});
//# sourceMappingURL=../sourcemaps/mode/behaviour.js.map
