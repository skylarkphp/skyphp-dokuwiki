/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./base"],function(t){var o=null;function o(t,e,i,n){var a,s,r,d,w,c,h;switch(!0){case!i&&!e:return!1;case!!i&&!!e:i.x,i.y;break;case!i&&!!e:(a=e.offset()).left+e.outerHeight(),a.top;break;case!!i&&!e:i.x,i.y}e&&!n&&$(e).data("vakata_contextmenu")&&(n=$(e).data("vakata_contextmenu"));var l=$(t._elm);l.appendTo(document.body),s=this.position_x,r=this.position_y,d=l.width(),w=l.height(),c=$(window).width()+$(window).scrollLeft(),h=$(window).height()+$(window).scrollTop(),right_to_left&&(s-=(void 0).outerWidth()-$(e).outerWidth())<$(window).scrollLeft()+20&&(s=$(window).scrollLeft()+20),s+d+20>c&&(s=c-(d+20)),r+w+20>h&&(r=h-(w+20)),l.css({left:s,top:r}).show(),o=t,t._trigger("show")}return t.popups={popup:o}});
//# sourceMappingURL=sourcemaps/popups.js.map
