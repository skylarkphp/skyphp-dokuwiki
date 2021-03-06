/**
 * slax-skydoku - The skydoku slax application.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link skydoku.hudaokeji.com
 * @license 
 */
define(["skylark-langx-ns","skylark-langx-objects","skylark-langx-hoster","skylark-langx-async","skylark-net-http/Xhr","skylark-domx-eventer"],function(skylark,objects,hoster,async,Xhr,eventer){var _config={},_rootUrl="",_baseUrl="",slax={prepare:function(config){var p,slaxRoot,slaxApp;if(config||(config=hoster.global.slaxConfig),!config)for(var scripts=document.getElementsByTagName("script"),i=0,script,slaxDir,src,match;i<scripts.length;)if(script=scripts[i++],(src=script.getAttribute("src"))&&(match=src.match(/(((.*)\/)|^)skylark-slax-runtime([0-9A-Za-z\-]*)\.js(\W|$)/i))){slaxDir=match[3]||"",(src=script.getAttribute("data-slax-config"))?config=eval("({ "+src+" })"):(slaxRoot=script.getAttribute("data-slax-root"),void 0==slaxRoot&&(slaxRoot=slaxDir),slaxApp=script.getAttribute("data-slax-app"));break}if(config)objects.mixin(_config,config),p=async.Deferred.resolve();else{var d=new async.Deferred,p=d.promise;Xhr.get(slaxRoot+"/slax-config.json").then(function(t){if(slaxApp){for(var s,r=0;r<t.apps.length;r++)t.apps[r].name==slaxApp&&(s=slaxRoot+t.apps[r].dir);Xhr.get(s+"/spa.json").then(function(t){objects.mixin(_config,t),d.resolve()})}else objects.mixin(_config,t),d.resolve()})}return p},start:function(){var t=_config;require.config(t.runtime);var s=function(s,r){var a=s(r=r||t);hoster.global.go=function(t,s){a.go(t,s)},a.prepare().then(function(){a.run()})};t.spaModule?require([t.spaModule],function(t){t._start?t._start().then(function(r){s(t,r)}):s(t)}):s(skylark.spa)}};return define("slax",[],function(){return slax}),skylark.attach("slax",slax)});
//# sourceMappingURL=sourcemaps/slax.js.map
