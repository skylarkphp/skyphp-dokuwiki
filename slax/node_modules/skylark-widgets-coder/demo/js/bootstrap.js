require.config({
  baseUrl: "./"
  ,map: {
        '*': {
          'ace': 'skylark-ace'
        }
      }
  , 
  shim: {
  }
  ,packages : [
    {name : "skylark-langx-arrays", location : "../node_modules/skylark-langx-arrays/dist/uncompressed/skylark-langx-arrays"},
    {name : "skylark-langx-aspect",location : "../node_modules/skylark-langx-aspect/dist/uncompressed/skylark-langx-aspect"},
    {name : "skylark-langx-async",location : "../node_modules/skylark-langx-async/dist/uncompressed/skylark-langx-async"},
    {name : "skylark-langx-binary",location : "../node_modules/skylark-langx-binary/dist/uncompressed/skylark-langx-binary"},
    {name : "skylark-langx-constructs",location : "../node_modules/skylark-langx-constructs/dist/uncompressed/skylark-langx-constructs"},
    {name : "skylark-langx-datetimes",location : "../node_modules/skylark-langx-datetimes/dist/uncompressed/skylark-langx-datetimes"},
    {name : "skylark-langx-emitter",location : "../node_modules/skylark-langx-emitter/dist/uncompressed/skylark-langx-emitter"},
    {name : "skylark-langx-events",location : "../node_modules/skylark-langx-events/dist/uncompressed/skylark-langx-events"},
    {name : "skylark-langx-funcs",location : "../node_modules/skylark-langx-funcs/dist/uncompressed/skylark-langx-funcs"},
    {name : "skylark-langx-globals",location : "../node_modules/skylark-langx-globals/dist/uncompressed/skylark-langx-globals"},
    {name : "skylark-langx-hoster",location : "../node_modules/skylark-langx-hoster/dist/uncompressed/skylark-langx-hoster"},
    {name : "skylark-langx-klass",location : "../node_modules/skylark-langx-klass/dist/uncompressed/skylark-langx-klass"},
    {name : "skylark-langx-maths",location : "../node_modules/skylark-langx-maths/dist/uncompressed/skylark-langx-maths"},
    {name : "skylark-langx-ns",location : "../node_modules/skylark-langx-ns/dist/uncompressed/skylark-langx-ns"},
    {name : "skylark-langx-numerics",location : "../node_modules/skylark-langx-numerics/dist/uncompressed/skylark-langx-numerics"},
    {name : "skylark-langx-objects",location : "../node_modules/skylark-langx-objects/dist/uncompressed/skylark-langx-objects"},
    {name : "skylark-langx-strings",location : "../node_modules/skylark-langx-strings/dist/uncompressed/skylark-langx-strings"},
    {name : "skylark-langx-topic",location : "../node_modules/skylark-langx-topic/dist/uncompressed/skylark-langx-topic"},
    {name : "skylark-langx-types",location : "../node_modules/skylark-langx-types/dist/uncompressed/skylark-langx-types"},
    {name : "skylark-langx-urls",location : "../node_modules/skylark-langx-urls/dist/uncompressed/skylark-langx-urls"},
    {name : "skylark-net-http",location : "../node_modules/skylark-net-http/dist/uncompressed/skylark-net-http"},
    {name : "skylark-domx-browser",location : "../node_modules/skylark-domx-browser/dist/uncompressed/skylark-domx-browser"},
    {name : "skylark-domx-css",location : "../node_modules/skylark-domx-css/dist/uncompressed/skylark-domx-css"},
    {name : "skylark-domx-browser",location : "../node_modules/skylark-domx-browser/dist/uncompressed/skylark-domx-browser"},
    {name : "skylark-domx-data",location : "../node_modules/skylark-domx-data/dist/uncompressed/skylark-domx-data"},
    {name : "skylark-domx-eventer",location : "../node_modules/skylark-domx-eventer/dist/uncompressed/skylark-domx-eventer"},
    {name : "skylark-domx-finder",location : "../node_modules/skylark-domx-finder/dist/uncompressed/skylark-domx-finder"},
    {name : "skylark-domx-fx",location : "../node_modules/skylark-domx-fx/dist/uncompressed/skylark-domx-fx"},
    {name : "skylark-domx-geom",location : "../node_modules/skylark-domx-geom/dist/uncompressed/skylark-domx-geom"},
    {name : "skylark-domx-images",location : "../node_modules/skylark-domx-images/dist/uncompressed/skylark-domx-images"},
    {name : "skylark-domx-noder",location : "../node_modules/skylark-domx-noder/dist/uncompressed/skylark-domx-noder"},
    {name : "skylark-domx-plugins-base",location : "../node_modules/skylark-domx-plugins-base/dist/uncompressed/skylark-domx-plugins-base"},
    {name : "skylark-domx-query",location : "../node_modules/skylark-domx-query/dist/uncompressed/skylark-domx-query"},
    {name : "skylark-domx-scripter",location : "../node_modules/skylark-domx-scripter/dist/uncompressed/skylark-domx-scripter"},
    {name : "skylark-domx-files",location : "../node_modules/skylark-domx-files/dist/uncompressed/skylark-domx-files"},
    {name : "skylark-domx-styler",location : "../node_modules/skylark-domx-styler/dist/uncompressed/skylark-domx-styler"},
    {name : "skylark-domx-tables",location : "../node_modules/skylark-domx-tables/dist/uncompressed/skylark-domx-tables"},
    {name : "skylark-domx-transforms",location : "../node_modules/skylark-domx-transforms/dist/uncompressed/skylark-domx-transforms"},
    {name : "skylark-domx-velm",location : "../node_modules/skylark-domx-velm/dist/uncompressed/skylark-domx-velm"},
    {name : "skylark-data-collection" ,location : "../node_modules/skylark-data-collection/dist/uncompressed/skylark-data-collection"},
    {name : "skylark-io-diskfs" ,location : "../node_modules/skylark-io-diskfs/dist/uncompressed/skylark-io-diskfs"},
    { name: "skylark-langx", location: "../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
    { name: "skylark-domx", location: "../node_modules/skylark-domx/dist/uncompressed/skylark-domx"},
    {name : "skylark-widgets-base" ,location : "../node_modules/skylark-widgets-base/dist/uncompressed/skylark-widgets-base"},
    { name: "skylark-ace", location: "../node_modules/skylark-ace/dist/uncompressed/skylark-ace"},
    { name: "skylark-codemirror-base", location: "../node_modules/skylark-codemirror-base/dist/uncompressed/skylark-codemirror-base"},
    { name: "skylark-codemirror", location: "../node_modules/skylark-codemirror/dist/uncompressed/skylark-codemirror"},
    { name: "skylark-widgets-coder", location: "../src" }
  ],

});
 

 require(["skylark-langx","skylark-domx/query"], function (langx,$) {
    require(["skylark-widgets-coder"], function (Coder) {
        if (window.initPage) {
            window.initPage(langx,$,Coder);
        }
    });
});