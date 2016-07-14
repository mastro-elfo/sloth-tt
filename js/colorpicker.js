
(function(){
	'use strict';
	
	window.Colorpicker = new Class({
		Implements: [Events, Options],
		
		options: {
			color: '',
			colors: [],
			onChange: function(){
				this.render();
				// this.fireEvent('select');
			}
		},
		
		initialize: function(element, options) {
			this.element = $(element);
			this.setOptions(options);
			
			var self = this;
			
			this.options.colors.each(function(color){
				var el = new Element('div', {
					'class': 'colorpicker-color',
					'data-color': color
				})
				.setStyles({
					'background-color': color,
					'border-color': color
				})
				.addEvent('click', function(){
					self.set('color', color);
					self.fireEvent('select');
				})
				.inject(self.element);
			});
			
			this.render();
			// this.fireEvent('select');
		},
		set: function(what, value) {
			if(this.options[what] != value) {
				this.options[what] = value;
				this.fireEvent('change');
			}
		},
		get: function(what){
			return this.options[what];
		},
		render: function(){
			var self = this;
			this.element.getElements('.colorpicker-color').each(function(el){
				if(self.get('color') == el.get('data-color')) {
					el.addClass('selected');
				}
				else {
					el.removeClass('selected');
				}
			});
		}
	});
	
})();
