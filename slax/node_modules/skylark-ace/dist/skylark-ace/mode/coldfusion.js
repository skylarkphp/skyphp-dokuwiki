/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var c=require("../lib/oop"),e=require("../lib/lang"),f=require("./html").Mode,t=require("./coldfusion_highlight_rules").ColdfusionHighlightRules,i="cfabort|cfapplication|cfargument|cfassociate|cfbreak|cfcache|cfcollection|cfcookie|cfdbinfo|cfdirectory|cfdump|cfelse|cfelseif|cferror|cfexchangecalendar|cfexchangeconnection|cfexchangecontact|cfexchangefilter|cfexchangetask|cfexit|cffeed|cffile|cfflush|cfftp|cfheader|cfhtmlhead|cfhttpparam|cfimage|cfimport|cfinclude|cfindex|cfinsert|cfinvokeargument|cflocation|cflog|cfmailparam|cfNTauthenticate|cfobject|cfobjectcache|cfparam|cfpdfformparam|cfprint|cfprocparam|cfprocresult|cfproperty|cfqueryparam|cfregistry|cfreportparam|cfrethrow|cfreturn|cfschedule|cfsearch|cfset|cfsetting|cfthrow|cfzipparam)".split("|"),a=function(){f.call(this),this.HighlightRules=t};c.inherits(a,f),function(){this.voidElements=c.mixin(e.arrayToMap(i),this.voidElements),this.getNextLineIndent=function(c,e,f){return this.$getIndent(e)},this.$id="ace/mode/coldfusion"}.call(a.prototype),exports.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/coldfusion.js.map
