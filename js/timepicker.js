
(function(){
	'use strict';
	
	window.Timepicker = new Class({
		Implements: [Events, Options],
		
		options: {
			hour: null,
			minute: null,
			onChange: function(){
				this.render();
				this.fireEvent('select');
			}
		},
		
		initialize: function(element, options) {
			this.element = $(element);
			this.setOptions(options);
			
			if(this.options.hour === null) {
				var d = new Date();
				this.options.hour = d.getHours();
				this.options.minute = d.getMinutes();
			}
			
			var self = this;
			
			var hour = new Element('div', {
				'class': 'timepicker-block timepicker-hour'
			}).inject(this.element);
			
			new Element('div', {
				'class': 'timepicker-plus timepicker-hourplus',
				'html': '+'
			}).addEvent('click', function(){
				self.options.hour < 23 ?
					self.set('hour', +self.options.hour +1) :
					self.set('hour', 0);
			}).inject(hour);
			
			new Element('input', {
				'class': 'timepicker-value timepicker-hourvalue'
			}).addEvent('click', function(){
				self.set('hour', (new Date()).getHours());
			}).inject(hour);
			
			new Element('div', {
				'class': 'timepicker-minus timepicker-hourminus',
				'html': '-'
			}).addEvent('click', function(){
				self.options.hour > 0 ?
					self.set('hour', +self.options.hour -1) :
					self.set('hour', 23);
			}).inject(hour);
			
			var minute = new Element('div', {
				'class': 'timepicker-block timepicker-minute'
			}).inject(this.element);
			
			new Element('div', {
				'class': 'timepicker-plus timepicker-minuteplus',
				'html': '+'
			}).addEvent('click', function(){
				self.options.minute < 59 ?
					self.set('minute', +self.options.minute +1) :
					self.set('minute', 0);
			}).inject(minute);
			
			new Element('input', {
				'class': 'timepicker-value timepicker-minutevalue'
			}).addEvent('click', function(){
				self.set('minute', (new Date()).getMinutes());
			}).inject(minute);
			
			new Element('div', {
				'class': 'timepicker-minus timepicker-minuteminus',
				'html': '-'
			}).addEvent('click', function(){
				self.options.minute > 0 ?
					self.set('minute', +self.options.minute -1) :
					self.set('minute', 59);
			}).inject(minute);
			
			this.render();
			this.fireEvent('select');
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
			this.element.getElement('.timepicker-hourvalue').set('value', this.options.hour);
			this.element.getElement('.timepicker-minutevalue').set('value', (this.options.minute<10?'0':'')+this.options.minute);
		}
	});
	
})();
