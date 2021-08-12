define([
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-query",
    "skylark-domx-plugins-base",
  './embeds'
], function (langx, noder, $, plugins, embeds) {
  'use strict'

  var EmbedVimeo = plugins.Plugin.inherit({
    klassName: "EmbedVimeo",

    pluginName : "lark.embeds.vimeo",

    options : {

    },

    _construct : function(elm,options) {
      //url, videoId, playerId, clickToPlay) 
      plugins.Plugin.prototype._construct.call(this,elm,options);

      this.url = options.url
      this.videoId = options.videoId
      this.playerId = options.playerId
      this.clickToPlay = options.clickToPlay

      ///this.element = document.createElement('div')
    },

    canPlayType: function () {
      return true
    },

    loadAPI: function () {
      var that = this
      var apiUrl = '//f.vimeocdn.com/js/froogaloop2.min.js'
      var scriptTags = document.getElementsByTagName('script')
      var i = scriptTags.length
      var scriptTag
      var called

      function callback() {
        if (!called && that.playOnReady) {
          that.play()
        }
        called = true
      }
      while (i) {
        i -= 1
        if (scriptTags[i].src === apiUrl) {
          scriptTag = scriptTags[i]
          break
        }
      }
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.src = apiUrl
      }
      $(scriptTag).on('load', callback)
      scriptTags[0].parentNode.insertBefore(scriptTag, scriptTags[0])
      // Fix for cached scripts on IE 8:
      if (/loaded|complete/.test(scriptTag.readyState)) {
        callback()
      }
    },

    onReady: function () {
      var that = this
      this.ready = true
      this.player.addEvent('play', function () {
        that.hasPlayed = true
        that.onPlaying()
      })
      this.player.addEvent('pause', function () {
        that.onPause()
      })
      this.player.addEvent('finish', function () {
        that.onPause()
      })
      if (this.playOnReady) {
        this.play()
      }
    },

    onPlaying: function () {
      if (this.playStatus < 2) {
        this.emit("playing");
        this.playStatus = 2
      }
    },

    onPause: function () {
      this.emit("pause");
      delete this.playStatus
    },

    insertIframe: function () {
      var iframe = document.createElement('iframe')
      iframe.src = this.url
        .replace('VIDEO_ID', this.videoId)
        .replace('PLAYER_ID', this.playerId)
      iframe.id = this.playerId
      this._elm.parentNode.replaceChild(iframe, this._elm)
      this._elm = iframe
    },

    play: function () {
      var that = this
      if (!this.playStatus) {
        this.emit("play");
        this.playStatus = 1
      }
      if (this.ready) {
        if (
          !this.hasPlayed &&
          (this.clickToPlay ||
            (window.navigator &&
              /iP(hone|od|ad)/.test(window.navigator.platform)))
        ) {
          // Manually trigger the playing callback if clickToPlay
          // is enabled and to workaround a limitation in iOS,
          // which requires synchronous user interaction to start
          // the video playback:
          this.onPlaying()
        } else {
          this.player.api('play')
        }
      } else {
        this.playOnReady = true
        if (!window.$f) {
          this.loadAPI()
        } else if (!this.player) {
          this.insertIframe()
          this.player = $f(this._elm)
          this.player.addEvent('ready', function () {
            that.onReady()
          })
        }
      }
    },

    pause: function () {
      if (this.ready) {
        this.player.api('pause');
      } else if (this.playStatus) {
        delete this.playOnReady;
        this.emit("pause");
        delete this.playStatus;
      }
    }
  });

  return embeds.EmbedVimeo = EmbedVimeo;

});