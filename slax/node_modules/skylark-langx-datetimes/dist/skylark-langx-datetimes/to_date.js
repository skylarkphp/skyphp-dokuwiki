/**
 * skylark-langx-datetimes - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./datetimes"],function(e,t){let n;return t.toDate=function(t){if(!t||!e.isString(t))return null;n||(n=new RegExp("^D:(\\d{4})(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?([Z|+|-])?(\\d{2})?'?(\\d{2})?'?"));const r=n.exec(t);if(!r)return null;const s=parseInt(r[1],10);let a=parseInt(r[2],10);a=a>=1&&a<=12?a-1:0;let l=parseInt(r[3],10);l=l>=1&&l<=31?l:1;let d=parseInt(r[4],10);d=d>=0&&d<=23?d:0;let p=parseInt(r[5],10);p=p>=0&&p<=59?p:0;let i=parseInt(r[6],10);i=i>=0&&i<=59?i:0;const u=r[7]||"Z";let I=parseInt(r[8],10);I=I>=0&&I<=23?I:0;let c=parseInt(r[9],10)||0;return c=c>=0&&c<=59?c:0,"-"===u?(d+=I,p+=c):"+"===u&&(d-=I,p-=c),new Date(Date.UTC(s,a,l,d,p,i))}});
//# sourceMappingURL=sourcemaps/to_date.js.map
