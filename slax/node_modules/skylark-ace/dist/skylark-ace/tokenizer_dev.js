/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){var s=e("./tokenizer").Tokenizer,i=function(e){s.call(this,e),this.getLineTokens=function(e,t){if(t&&"string"!=typeof t){var n=t.slice(0);t=n[0]}else n=[];var s=t||"start",i=this.states[s],r=this.matchMappings[s],a=this.regExps[s];a.lastIndex=0;var o,l=[],p=0,h=[];function u(){h.push(t+"@"+p)}var f={type:null,value:"",state:s};u(),h=[],u();for(var g=2e4;o=a.exec(e);){var v=r.defaultToken,c=null,y=o[0],x=a.lastIndex;if(x-y.length>p){var k=e.substring(p,x-y.length);f.type==v?f.value+=k:(f.type&&l.push(f),f={type:v,value:k})}for(var d=0;d<o.length-2;d++)if(void 0!==o[d+1]){if(!g--)throw"infinite"+i[r[d]]+s;v=(c=i[r[d]]).onMatch?c.onMatch(y,s,n,e):c.token,c.next&&(s="string"==typeof c.next?c.next:c.next(s,n),(i=this.states[s])||(window.console&&console.error&&console.error(s,"doesn't exist"),s="start",i=this.states[s]),r=this.matchMappings[s],p=x,(a=this.regExps[s]).lastIndex=x,u()),c.consumeLineEnd&&(p=x);break}if(y)if("string"==typeof v)c&&!1===c.merge||f.type!==v?(f.type&&l.push(f),f={type:v,value:y}):f.value+=y;else{f.type&&l.push(f),f={type:null,value:""};for(d=0;d<v.length;d++)l.push(v[d])}if(p==e.length)break;if(p=x,l.length>2e3){f.value+=e.substr(p),s="start";break}}return f.type&&l.push(f),{tokens:l,state:n.length?n:s}}};i.prototype=s.prototype,t.Tokenizer=i});
//# sourceMappingURL=sourcemaps/tokenizer_dev.js.map
