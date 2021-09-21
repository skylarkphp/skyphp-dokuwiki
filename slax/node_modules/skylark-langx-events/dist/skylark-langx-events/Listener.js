/**
 * skylark-langx-events - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","skylark-langx-objects","skylark-langx-arrays","skylark-langx-klass","./events","./event"],function(n,i,t,s,e,l){Array.prototype.slice;var r=t.compact,o=(n.isDefined,n.isUndefined),a=(n.isPlainObject,n.isFunction,n.isBoolean),h=n.isString,f=n.isEmptyObject,u=(i.mixin,i.safeMixin,s({listenTo:function(i,t,s,e,l){if(!i)return this;if(n.isPlainObject(t)){n.isBoolean(s)?(l=s,s=null):n.isBoolean(e)&&(l=e);var r=t;for(var f in r){var u=f.match(/^([\w:-]*)\s*(.*)$/),v=u[1],c=u[2]||s;c?this.listenTo(i,v,c,r[f],l):this.listenTo(i,v,r[f],l)}return this}a(e)?(l=e,e=s,s=null):a(s)?(l=s,e=s=null):o(e)&&(l=!1,e=s,s=null),e||(e="handleEvent"),h(e)&&(e=this[e]),l?s?i.one(t,s,e,this):i.one(t,e,this):s?i.on(t,s,e,this):i.on(t,e,this);for(var g,T=this._listeningTo||(this._listeningTo=[]),k=0;k<T.length;k++)if(T[k].obj==i){g=T[k];break}g||T.push(g={obj:i,events:{}});var b=g.events,y=b[t]=b[t]||[];return-1==y.indexOf(e)&&y.push(e),this},listenToOnce:function(n,i,t,s){return this.listenTo(n,i,t,s,1)},unlistenTo:function(n,i,t){var s=this._listeningTo;if(!s)return this;h(t)&&(t=this[t]);for(var e=0;e<s.length;e++){var l=s[e];if(!n||n==l.obj){var o=l.events;for(var a in o)if(!i||i==a){var u=o[a];if(u){for(var v=0;v<u.length;v++)t&&t!=u[e]||(l.obj.off(a,u[e],this),u[e]=null);u=o[a]=r(u),f(u)&&(o[a]=null)}}f(o)&&(s[e]=null)}}return s=this._listeningTo=r(s),f(s)&&(this._listeningTo=null),this}}));return e.Listener=u});
//# sourceMappingURL=sourcemaps/listener.js.map
