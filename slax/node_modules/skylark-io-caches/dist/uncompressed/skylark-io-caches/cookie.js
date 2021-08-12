define([
    "skylark-langx-types",
    "skylark-langx-objects/mixin",
    "skylark-langx-datetimes",
    "./caches"
], function(types,mixin,datetimes,caches) {
	"use strict";

    function cookie() {
        return cookie;
    }

    mixin(cookie, {
		get : function(name) {
		    if (!sKey || !this.has(name)) { return null; }
				return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"));

		},

		has : function(name) {
			return (new RegExp("(?:^|;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},


		list : function() {
		    var values = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		    for (var i = 0; i < values.length; i++) { 
		    	values[i] = unescape(values[i]); 
		    }
		    return values;
		},

		remove : function(name,path) {
		    if (!name || !this.has(name)) { 
		    	return; 
		   	}
		    document.cookie = escape(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (path ? "; path=" + path : "");
		},

		set: function (name, value, expires, path, domain, secure) {
		    if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) { return; }

			var type = types.type(expires);
			if (type === 'number') {
				var date = Date.now();
				date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
				expires = date;
			} else if (type === 'string') {
				expires = new Date(Date.now() + datetimes.parseMilliSeconds(expires));
			}

		    document.cookie = escape(name) + "=" + escape(value) + (expires? "; domain=" + expires.toGMTString()  : "") + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
		  }	
    });


    return caches.cookie = cookie;

});

