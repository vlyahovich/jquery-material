(function ($, window, document, undefined) {
	'use strict';

	var pluginName = "ripple",
			defaults = {
				radiusFn: function (r) {
					return r + 8;
				}
			},
			requestAnimationFrame = (function () {
				var vendors = ['ms', 'moz', 'webkit', 'o'],
						raf = null,
						lastTime = 0;

				for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					raf = window[vendors[x] + 'RequestAnimationFrame'];
				}

				if (!raf) {
					raf = function (callback, element) {
						var currTime = new Date().getTime(),
								timeToCall = Math.max(0, 16 - (currTime - lastTime)),
								id = window.setTimeout(function () {
											callback(currTime + timeToCall);
										},
										timeToCall);

						lastTime = currTime + timeToCall;

						return id;
					};
				}

				return raf;
			}()),
			cancelAnimationFrame = (function () {
				var vendors = ['ms', 'moz', 'webkit', 'o'],
						caf = null;

				for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					caf = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
				}

				if (!caf) {
					caf = function (id) {
						clearTimeout(id);
					};
				}

				return caf;
			}());

	function Plugin(element, options) {
		this.element = element;
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this._width = this.$el.width()
				+ parseInt(this.$el.css('padding-left'), 10)
				+ parseInt(this.$el.css('padding-right'), 10);
		this._height = this.$el.height()
				+ parseInt(this.$el.css('padding-top'), 10)
				+ parseInt(this.$el.css('padding-bottom'), 10);
		this._offset = this.$el.offset();
		this._touchX = 0;
		this._touchY = 0;

		this.init();
	}

	Plugin.prototype = {

		init: function () {
			this._canvas = $('<canvas></canvas>');
			this._reflowCanvas();

			this.$el.css('position', 'relative').append(this._canvas);
			this._ctx = this._canvas[0].getContext('2d');
			this._canvas.css('border-radius', this.$el.css('border-radius'));

			this.$el.on('mousedown.ripple', $.proxy(this.onTouch, this));
			this.$el.on('mouseup.ripple', $.proxy(this.onTouchEnd, this));
		},

		onTouch: function (e) {
			this._touchX = e.pageX - this._offset.left;
			this._touchY = e.pageY - this._offset.top;
			this._ctx.globalAlpha = 0.1;
			this._ctxClear = false;

			if (this._frameId) {
				this.clear();
			}

			this.draw(Math.min(this._width / 8, this._height / 8));
		},

		onTouchEnd: function () {
			this._ctxClear = true;
		},

		draw: function (r) {
			this._ctx.clearRect(0, 0, this._width, this._height);
			this._ctx.fillStyle = 'black';
			this._ctx.beginPath();
			this._ctx.arc(this._touchX, this._touchY, r, 0, 2 * Math.PI, false);
			this._ctx.fill();
			this._frameId = requestAnimationFrame($.proxy(this.draw, this, this.options.radiusFn(r)));

			if (this._ctxClear) {
				this._ctx.globalAlpha -= 0.01;
			}
			if (this._ctx.globalAlpha <= 0) {
				this.clear();
			}
		},

		clear: function () {
			cancelAnimationFrame(this._frameId);
			this._frameId = null;

			this._ctx.clearRect(0, 0, this._width, this._height);
		},

		_reflowCanvas: function () {
			this._canvas[0].width = this._width;
			this._canvas[0].height = this._height;

			this._canvas.css({
				width: this._width,
				height: this._height,
				position: 'absolute',
				left: 0,
				top: 0
			});
		},

		destroy: function () {
			this.$el.off('.ripple');
		}
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName,
						new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);