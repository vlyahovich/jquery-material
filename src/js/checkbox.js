(function ($, window, document, undefined) {
	'use strict';

	var pluginName = "checkbox",
			defaults = {
			};

	function Plugin(element, options) {
		this.element = element;
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {

		init: function () {
			this._checkbox = this.$el.find('input[type=checkbox]');
			this._checked = false;

			if (this._checkbox.is(':checked')) {
				this.toggle();
			}

			this._checkbox.on('change.checkbox', $.proxy(this.toggle, this));
		},

		toggle: function () {
			var el = this.$el;

			this._checked = !this._checked;
			this._checkbox.prop('checked', this._checked);
			el.toggleClass('checked');
		},

		destroy: function () {
			this.$el.off('.checkbox');
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