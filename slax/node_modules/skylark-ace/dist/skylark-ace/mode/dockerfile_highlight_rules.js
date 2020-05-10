/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./sh_highlight_rules").ShHighlightRules,t=function(){i.call(this);for(var e=this.$rules.start,t=0;t<e.length;t++)if("variable.language"==e[t].token){e.splice(t,0,{token:"constant.language",regex:"(?:^(?:FROM|MAINTAINER|RUN|CMD|EXPOSE|ENV|ADD|ENTRYPOINT|VOLUME|USER|WORKDIR|ONBUILD|COPY|LABEL)\\b)",caseInsensitive:!0});break}};e.inherits(t,i),exports.DockerfileHighlightRules=t});
//# sourceMappingURL=../sourcemaps/mode/dockerfile_highlight_rules.js.map
