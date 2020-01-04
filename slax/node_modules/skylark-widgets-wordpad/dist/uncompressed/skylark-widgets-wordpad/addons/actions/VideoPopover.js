define([
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  var VideoPopover = Popover.inherit({
    offset : {
      top: 6,
      left: -4
    },

    _loadVideo : function(videoData, callback) {
      if (videoData && this.target.attr('src') === videoData.src) {
        return;
      }
      return $('.insertVideoBtn').data('videowrap') && this.action.loadVideo($('.insertVideoBtn').data('videowrap'), videoData, (function(_this) {
        return function(img) {
          if (!img) {

          }
        };
      })(this));
    },

    render : function() {
      var tpl;
      tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field video-embed-code\">\n    <label>" + (this._t('video')) + "</label>\n    <textarea placeholder=\"" + (this._t('videoPlaceholder')) + "\" type=\"text\" class=\"video-link\" ></textarea>\n  </div><br>\n  <div class=\"settings-field\">\n    <label>" + (this._t('videoSize')) + "</label>\n    <input class=\"image-size video-size\" id=\"video-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size video-size\" id=\"video-height\" type=\"text\" tabindex=\"3\" />\n  </div>\n  <div class=\"video-upload\">\n    <button class=\"btn insertVideoBtn\">" + (this._t('uploadVideoBtn')) + "</div>\n  </div>\n</div>";
      this.el.addClass('video-popover').append(tpl);
      this.srcEl = this.el.find('.video-link');
      this.widthEl = this.el.find('#video-width');
      this.heightEl = this.el.find('#video-height');
      this.el.find('.video-size').on('keydown', (function(_this) {
        return function(e) {
          if (e.which === 13 || e.which === 27) {
            e.preventDefault();
            return $('.insertVideoBtn').click();
          }
        };
      })(this));

      this.srcEl.on('keydown', (function(_this) {
        return function(e) {
          if (e.which === 13 || e.which === 27) {
            e.preventDefault();
            return $('.insertVideoBtn').click();
          }
        };
      })(this));

      return this.editor.on('valuechanged', (function(_this) {
        return function(e) {
          if (_this.active) {
            return _this.refresh();
          }
        };
      })(this));
    },

    show : function() {
      var $video, $videoWrap, args, videoData;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      $video = arguments[0] || this.target;
      this.width = $video.attr('data-width') || $video.width();
      this.height = $video.attr('data-height') || $video.height();
      if ($video.attr('data-link')) {
        videoData = {
          link: $video.attr('data-link'),
          tag: $video.attr('data-tag'),
          width: this.width,
          height: this.height
        };
        this.src = videoData.link;
      }
      this.widthEl.val(this.width);
      this.heightEl.val(this.height);
      this.srcEl.val(this.src);
      $('.insertVideoBtn').data('videowrap', $video);
      return $videoWrap = this.target;
    }
  });

  return VideoPopover;
});