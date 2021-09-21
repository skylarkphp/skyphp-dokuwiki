define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../action",
  "./video-popover"
],function(langx,$,addons,Action,VideoPopover){ 
   var reUrlYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,
      reUrlVimeo = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;

   var VideoAction = Action.inherit({
      name : 'video',

      icon : 'video',

      htmlTag : 'embed, iframe',

      disableTag : 'pre, table, div',

      videoPlaceholder : 'video',

      videoContainerClass : 'video-container',

      placeholderPoster : '',

      needFocus : true,

      _init : function() {
        this.title = this._t(this.name);
        langx.merge(this.editor.editable.formatter._allowedTags, ['embed', 'iframe', 'video']);
        langx.extend(this.editor.editable.formatter._allowedAttributes, {
          embed: ['class', 'width', 'height', 'style','type', 'pluginspage', 'src', 'wmode', 'play', 'loop', 'menu', 'allowscriptaccess', 'allowfullscreen'],
          iframe: ['class', 'width', 'height','style', 'src', 'frameborder','data-link','data-width','data-height'],
          video: ['class', 'width', 'height', 'style','poster', 'controls', 'allowfullscreen', 'src', 'data-link', 'data-tag']
        });

        this.placeholderPoster =  this.editor.options.addons.actions.video.placeholderPoster;


        $(document).on('click', '.insertVideoBtn', (function(_this) {
          return function(e) {
            var videoData;
            videoData = {
              link: $('.video-link').val(),
              width: $('#video-width').val() || 100,
              height: $('#video-height').val() || 100
            };
            $('.video-link').val('');
            $('#video-width').val('');
            $('#video-height').val('');
            return _this._insert($('.insertVideoBtn').data('videowrap'), videoData, function() {
              return _this.editor.trigger('valuechanged');
            });
          };
        })(this));

        this.editor.body.on('click', '.wordpad-video-wrapper', (function(_this) {
          return function(e) {
            var $video = $(e.currentTarget).find('.wordpad-video');//siblings('video').show();
            return _this.popover.show($video);
          };
        })(this));
        this.editor.body.on('mousedown', (function(_this) {
          return function() {
            var $videoWrap;
            $videoWrap = $('.insertVideoBtn').data('videowrap');
            if ($videoWrap && $videoWrap.html() === _this.videoPlaceholder) {
              $videoWrap.remove();
              $('.insertVideoBtn').data('videowrap', null);
            }
            return _this.popover.hide();
          };
        })(this));
        this.editor.on('decorate', (function(_this) {
          return function(e, $el) {
            return $el.find('.wordpad-video').each(function(i, video) {
              return _this.decorate($(video));
            });
          };
        })(this));
        this.editor.on('undecorate', (function(_this) {
          return function(e, $el) {
            return $el.find('.wordpad-video').each(function(i, video) {
              return _this.undecorate($(video));
            });
          };
        })(this));

        this.popover = new VideoPopover({
          action: this
        });
        return Action.prototype._init.call(this);
      },


      decorate : function($video) {
        if ($video.parent('.wordpad-video-wrapper').length > 0) {
          return;
        }
        $video.wrap('<figure class="wordpad-video-wrapper"></figure>');
        return $video.parent();
      },

      undecorate : function($video) {
        if (!($video.parent('.wordpad-video-wrapper').length > 0)) {
          return;
        }
        return $video.parent().replaceWith($video);
      },

      _execute : function() {
        var $video = this._create();
        return this.popover.show($video);
      },

      _status : function() {
        return this._disableStatus();
      },

      _create : function() {
        var $video, range;
        if (!this.editor.editable.inputManager.focused) {
          this.editor.focus();
        }
        range = this.editor.editable.selection.range();
        if (range) {
          range.deleteContents();
          this.editor.editable.selection.range(range);
        }
        $video = $('<video/>').attr({
          'poster': this.placeholderPoster,
          'width': 225,
          'height': 225,
          'class' : 'wordpad-video'
        });
        range.insertNode($video[0]);
        this.editor.editable.selection.setRangeAfter($video, range);
        this.editor.trigger('valuechanged');
        this.decorate($video);
        return $video;
      },

      _insert : function($video, videoData, callback) {
        var e, originNode, realVideo, videoLink, videoTag;
        if (!videoData.link) {
          this._remove($video);
        } else {
          var data = videoData.link;
          if (!data.match(/<iframe|<video|<embed/gi)) {
            // parse if it is link on youtube & vimeo
            var iframeStart = '<iframe style="width: 500px; height: 281px;" src="',
              iframeEnd = '" frameborder="0" allowfullscreen></iframe>';

            if (data.match(reUrlYoutube))    {
              data = data.replace(reUrlYoutube, iframeStart + 'https://www.youtube.com/embed/$1' + iframeEnd);
            } else if (data.match(reUrlVimeo)) {
              data = data.replace(reUrlVimeo, iframeStart + 'https://player.vimeo.com/video/$2' + iframeEnd);
            }
          }
          var $video1 = $(data).style({
            width : videoData.width + "px",
            height : videoData.height + "px"
          }).attr({
            "width" : videoData.width + "px",
            "height" : videoData.height + "px",
            'class' : 'wordpad-video',
            "data-link" : videoData.link,
            "data-width" : videoData.width,
            "data-height" : videoData.height
          });
          
          $video.replaceWith($video1);
          $video = $video1;
        }
        this.editor.trigger('valuechanged');
        this.popover.hide();
        return callback($video);
      },

      _remove : function($video) {
        $video.parent().remove();
      }

   });


   addons.actions.video = VideoAction; 

   return VideoAction;

});