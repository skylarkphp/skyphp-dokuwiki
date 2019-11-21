/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(c,e,f){"use strict";var t=c("../lib/oop"),i=c("../lib/lang"),a=c("./html").Mode,r=c("./coldfusion_highlight_rules").ColdfusionHighlightRules,n="cfabort|cfapplication|cfargument|cfassociate|cfbreak|cfcache|cfcollection|cfcookie|cfdbinfo|cfdirectory|cfdump|cfelse|cfelseif|cferror|cfexchangecalendar|cfexchangeconnection|cfexchangecontact|cfexchangefilter|cfexchangetask|cfexit|cffeed|cffile|cfflush|cfftp|cfheader|cfhtmlhead|cfhttpparam|cfimage|cfimport|cfinclude|cfindex|cfinsert|cfinvokeargument|cflocation|cflog|cfmailparam|cfNTauthenticate|cfobject|cfobjectcache|cfparam|cfpdfformparam|cfprint|cfprocparam|cfprocresult|cfproperty|cfqueryparam|cfregistry|cfreportparam|cfrethrow|cfreturn|cfschedule|cfsearch|cfset|cfsetting|cfthrow|cfzipparam)".split("|"),o=function(){a.call(this),this.HighlightRules=r};t.inherits(o,a),function(){this.voidElements=t.mixin(i.arrayToMap(n),this.voidElements),this.getNextLineIndent=function(c,e,f){return this.$getIndent(e)},this.$id="ace/mode/coldfusion"}.call(o.prototype),e.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/coldfusion.js.map
