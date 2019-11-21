/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var l=e("../lib/oop"),s=e("./sh_highlight_rules").ShHighlightRules,n=function(){s.call(this);for(var e=this.$rules.start,i=0;i<e.length;i++)if("variable.language"==e[i].token){e.splice(i,0,{token:"constant.language",regex:"(?:^(?:FROM|MAINTAINER|RUN|CMD|EXPOSE|ENV|ADD|ENTRYPOINT|VOLUME|USER|WORKDIR|ONBUILD|COPY|LABEL)\\b)",caseInsensitive:!0});break}};l.inherits(n,s),i.DockerfileHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/dockerfile_highlight_rules.js.map
