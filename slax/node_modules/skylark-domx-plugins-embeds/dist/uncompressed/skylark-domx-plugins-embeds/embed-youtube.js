define([
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-query",
    "skylark-domx-plugins-base",
  './embeds'
], function (langx, noder, $, plugins, embeds) {
  'use strict'

  var EmbedYoutube = plugins.Plugin.inherit({
    klassName: "EmbedYoutube",

    pluginName : "lark.embeds.youtube",

    options : {

    },

    _construct : function(elm,options) {
      // videoId, playerVars, clickToPlay
      plugins.Plugin.prototype._construct.call(this,elm,options);

      this.videoId = options.videoId;
      this.playerVars = options.playerVars;
      this.clickToPlay = options.clickToPlay;
      ///this.element = document.createElement('div');
    },

    canPlayType: function () {
      return true;
    },

    loadAPI: function () {
      var that = this,
        onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady,
        apiUrl = 'https://www.youtube.com/iframe_api',
        scriptTags = document.getElementsByTagName('script'),
        i = scriptTags.length,
        scriptTag;

      window.onYouTubeIframeAPIReady = function () {
        if (onYouTubeIframeAPIReady) {
          onYouTubeIframeAPIReady.apply(this);
        }
        if (that.playOnReady) {
          that.play();
        }
      }
      while (i) {
        i -= 1
        if (scriptTags[i].src === apiUrl) {
          return
        }
      }
      scriptTag = document.createElement('script')
      scriptTag.src = apiUrl
      scriptTags[0].parentNode.insertBefore(scriptTag, scriptTags[0])
    },

    onReady: function () {
      this.ready = true;
      if (this.playOnReady) {
        this.play()
      }
    },

    onPlaying: function () {
      if (this.playStatus < 2) {
        this.emit("playing");
        this.playStatus = 2;
      }
    },

    onPause: function () {
      langx.defer(()=>{
        this.checkSeek();
      },2000)
    },

    checkSeek: function () {
      if (
        this.stateChange === YT.PlayerState.PAUSED ||
        this.stateChange === YT.PlayerState.ENDED
      ) {
        // check if current state change is actually paused
        this.emit("pause");
        delete this.playStatus
      }
    },

    onStateChange: function (event) {
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          this.hasPlayed = true
          this.onPlaying()
          break
        case YT.PlayerState.PAUSED:
        case YT.PlayerState.ENDED:
          this.onPause()
          break
      }
      // Save most recent state change to this.stateChange
      this.stateChange = event.data
    },

    onError: function (event) {
      this.trigger("error", event);
    },

    play: function () {
      var that = this
      if (!this.playStatus) {
        this.emit("play");
        this.playStatus = 1;
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
          this.onPlaying();
        } else {
          this.player.playVideo();
        }
      } else {
        this.playOnReady = true;
        if (!(window.YT && YT.Player)) {
          this.loadAPI();
        } else if (!this.player) {
          this.player = new YT.Player(this._elm, {
            videoId: this.videoId,
            playerVars: this.playerVars,
            events: {
              onReady: function () {
                that.onReady()
              },
              onStateChange: function (event) {
                that.onStateChange(event)
              },
              onError: function (event) {
                that.onError(event)
              }
            }
          })
        }
      }
    },

    pause: function () {
      if (this.ready) {
        this.player.pauseVideo()
      } else if (this.playStatus) {
        delete this.playOnReady
        this.emit("pause");
        delete this.playStatus
      }
    }
  });

  return embeds.EmbedYoutube = EmbedYoutube;
});