/**
 * skylark-langx-funcs - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-objects","./funcs","./proxy"],function(t,e,n){Array.prototype.slice;var r={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g},a=/(.)^/,u={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"},i=/\\|'|\r|\n|\t|\u2028|\u2029/g;function o(e,o,c){var l;c=t.defaults({},c,r);var _=RegExp([(c.escape||a).source,(c.interpolate||a).source,(c.evaluate||a).source].join("|")+"|$","g"),s=0,p="__p+='";e.replace(_,function(t,n,r,a,o){return p+=e.slice(s,o).replace(i,function(t){return"\\"+u[t]}),n&&(p+="'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'"),r&&(p+="'+\n((__t=("+r+"))==null?'':__t)+\n'"),a&&(p+="';\n"+a+"\n__p+='"),s=o+t.length,t}),p+="';\n",c.variable||(p="with(obj||{}){\n"+p+"}\n"),p="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+p+"return __p;\n";try{l=new Function(c.variable||"obj","_",p)}catch(t){throw t.source=p,t}if(o)return l(o,this);var f=n(function(t){return l.call(this,t,this)},this),g=c.variable||"obj";return f.source="function("+g+"){\n"+p+"}",f}return o.templateSettings=e.templateSettings=r,e.template=o});
//# sourceMappingURL=sourcemaps/template.js.map
