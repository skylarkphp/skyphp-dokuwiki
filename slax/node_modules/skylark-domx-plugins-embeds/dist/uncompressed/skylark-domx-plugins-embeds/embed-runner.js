define([
    "skylark-domx-iframes/create",
    "skylark-domx/query",
    "skylark-domx-plugins-base",
    "./embeds"
], function(createIframe, $, plugins,embeds) {

    'use strict';
    // move from render/live.js

  /** ============================================================================
   * Skylark Html Viewer
   * Messages to and from the runner.
   * ========================================================================== */

  var 
      $window = $(window),
      $document = $(document);


  var EmbedRunner =  plugins.Plugin.inherit({

    klassName: "EmbedRunner",

    pluginName : "lark.embeds.runner",

    options : {
      runnerUrl : "",
      runnerName : ""
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);

       /**
        * Store what runner origin *should* be
        * TODO this should allow anything if x-origin protection should be disabled
       */
       this.runner = {};
       this.runner.origin = '*';

    },

    /**
     * Render live preview.
     * Create the runner iframe, and if postMe wait until the iframe is loaded to
     * start postMessaging the runner.
     */
    prepare :  function () {

      if (this._inited) {
        return this._inited.promise;
      }

      this._inited = new Deferred();

      // Basic mode
      // This adds the runner iframe to the page. It's only run once.
      //if (!$live.find('iframe').length) {
        /*
        iframe = noder.create("iframe",{
          ///iframe.src = jsbin.runner;
          src : this.options.runnerUrl
        },{
          "class" : "stretch",
          "sandbox", "allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts",
          "frameBorder": '0',
          "name", "<proxy>",
        },this._elm);

        try {
          ///iframe.contentWindow.name = '/' + jsbin.state.code + '/' + jsbin.state.revision;
          iframe.contentWindow.name  = this.options.runnerName;
        } catch (e) {
          // ^- this shouldn't really fail, but if we're honest, it's a fucking mystery as to why it even works.
          // problem is: if this throws (because iframe.contentWindow is undefined), then the execution exits
          // and `var renderLivePreview` is set to undefined. The knock on effect is that the calls to renderLivePreview
          // then fail, and jsbin doesn't boot up. Tears all round, so we catch.
        }
      //}

      iframe.onload = () => {
        if (window.postMessage) {
          // setup postMessage listening to the runner
          $window.on('message', (event) => {
            this.handleMessage(event.originalEvent)
          });
          this.setup(iframe);
          this._inited.resolve();
        }
      };

      iframe.onerror = (err) => {
        this._inited.reject(err);
      };
      */

      createIframe({
        "url" : this.options.runnerUrl,
        "className" : "stretch",
        "sandbox" : "allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts",
        "frameBorder": '0',
        "name": "<proxy>",
        "contentWindowName": this.options.runnerName,
        "onload" : () => {
          if (window.postMessage) {
            // setup postMessage listening to the runner
            $window.on('message', (event) => {
              this.handleMessage(event.originalEvent)
            });
            this.setup(iframe);
            this._inited.resolve();
          }
        },
        "onerror" : (err) => {
          this._inited.reject(err);
        }
      },this._elm);

      /**
       * Events
       */

      $document.on('codeChange.live', (event, arg) => {
        if (arg.origin === 'setValue' || arg.origin === undefined) {
          return;
        }
        ///store.sessionStorage.removeItem('runnerPending');
      });

      // Listen for console input and post it to the iframe
      $document.on("console:run", (event, cmd)  => {
        this.postMessage('console:run', cmd);
      });

      $document.on('console:load:script', (event, url) => {
        this.postMessage('console:load:script', url);
      });

      $document.on('console:load:dom', (event, html) => {
        this.postMessage('console:load:dom', html);
      });

      /* not need ? // lwf
       * When the iframe resizes, update the size text
      this.resize = (function () {
        var $size = this.$().find('.size');

        var hide = func.debounce(function () {
          $size.fadeOut(200);
        }, 2000);

        var embedResizeDone = false;

        return function (data) {
          
          ///if (!jsbin.embed) {
          ///  // Display the iframe size in px in the JS Bin UI
          ///  size.show().html(data.width + 'px');
          ///  hide();
          ///}
          ///if (jsbin.embed && self !== top && embedResizeDone === false) {
          if (embedResizeDone === false) {
            embedResizeDone = true;
            // Inform the outer page of a size change
            var height = ($body.outerHeight(true) - $(this.runner.iframe).height()) + data.offsetHeight;
           window.parent.postMessage({ height: height }, '*');
          }
        };
      }());
      */
      
      return inited.promise;
    },


    /**
     * Setup the renderer
     */
    setup : function (runnerFrame) {
      this.runner.window = runnerFrame.contentWindow;
      this.runner.iframe = runnerFrame;
    },

    /**
     * Log error messages, indicating that it's from the renderer.
     */
    error : function () {
      // it's quite likely that the error that fires on this handler actually comes
      // from another service on the page, like a browser plugin, which we can
      // safely ignore.
      window.console.warn.apply(console, ['Renderer:'].concat([].slice.call(arguments)));
    },

    /**
     * Handle all incoming postMessages to the renderer
     */
    handleMessage : function (event) {
      if (!event.origin) return;
      var data = event.data;

      if (typeof data !== 'string') {
        // this event isn't for us (i.e. comes from a browser ext)
        return;
      }

      // specific change to handle reveal embedding
      /*
       // Unnecessary? //lwf
      try {
        if (event.data.indexOf('slide:') === 0 || event.data === 'jsbin:refresh') {
          // reset the state of the panel visibility
          jsbin.panels.allEditors(function (p) {
            p.visible = false;
          });
          jsbin.panels.restore();
          return;
        }
      } catch (e) {}
      */

      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return this.error('Error parsing event data:', e.message);
      }

      /*
       // Unnecessary? //lwf
      if (data.type.indexOf('code:') === 0 && jsbin.embed) {
        var panel = data.type.substr(5);
        if (panel === 'js') { panel = 'javascript'; }
        if (' css javascript html '.indexOf(' ' + panel + ' ') === -1) {
          return renderer.error('No matching event handler:', data.type);
        }

        if (!jsbin.state.metadata.pro) {
          return renderer.error('Code injection is only supported on pro created bins');
        }

        jsbin.panels.named[panel].setCode(data.data);
        renderLivePreview();

        return;
      }
      */

      if (typeof this[data.type] !== 'function') {
        return false; //renderer.error('No matching handler for event', data);
      }
      try {
        this[data.type](data.data);
      } catch (e) {
        this.error(e.message);
      }
    },

    /**
     * Send message to the runner window
     */
    postMessage : function (type, data) {
      if (!this.runner.window) {
        return this.error('postMessage: No connection to runner window.');
      }
      this.runner.window.postMessage(JSON.stringify({
        type: type,
        data: data
      }), this.runner.origin);
    },

    /**
     * When the renderer is complete, it means we didn't hit an initial
     * infinite loop
     */
    complete : function () {
      try {
        store.sessionStorage.removeItem('runnerPending');
      } catch (e) {}
    },

    /**
     * Pass loop protection hit calls up to the error UI
    renderer.loopProtectHit = function (line) {
      var cm = jsbin.panels.named.javascript.editor;

      // grr - more setTimeouts to the rescue. We need this to go in *after*
      // jshint does it's magic, but jshint set on a setTimeout, so we have to
      // schedule after.
      setTimeout(function () {
        var annotations = cm.state.lint.annotations || [];
        if (typeof cm.updateLinting !== 'undefined') {
          // note: this just updated the *source* reference
          annotations = annotations.filter(function (a) {
            return a.source !== 'loopProtectLine:' + line;
          });
          annotations.push({
            from: CodeMirror.Pos(line-1, 0),
            to: CodeMirror.Pos(line-1, 0),
            message: 'Exiting potential infinite loop.\nTo disable loop protection: add "// noprotect" to your code',
            severity: 'warning',
            source: 'loopProtectLine:' + line
          });

          cm.updateLinting(annotations);
        }
      }, cm.state.lint.options.delay || 0);
    };
     */



    /**
     * When the iframe focuses, simulate that here
     */
    focus : function () {
      ///jsbin.panels.focus(jsbin.panels.named.live);
      // also close any open dropdowns
      ///closedropdown();
    },

    /**
     * Proxy console logging to JS Bin's console
     */
    console : function (data) {
      var method = data.method,
          args = data.args;

      if (!window._console) {return;}
      if (!window._console[method]) {method = 'log';}

      // skip the entire console rendering if the console is hidden
      ///if (!jsbin.panels.named.console.visible) { return; }

      window._console[method].apply(window._console, args);
    },

    /**
     * Load scripts into rendered iframe
     */
    'console:load:script:success' : function (url) {
      $document.trigger('console:load:script:success', url);
    },

    'console:load:script:error' : function (err) {
      $document.trigger('console:load:script:error', err);
    },

    /**
     * Load DOME into rendered iframe
     * TODO abstract these so that they are automatically triggered
     */
    'console:load:dom:success' : function (url) {
      $document.trigger('console:load:dom:success', url);
    },

    'console:load:dom:error' : function (err) {
      $document.trigger('console:load:dom:error', err);
    }

  });

  return embeds.EmbedRunner = EmbedRunner;
});
