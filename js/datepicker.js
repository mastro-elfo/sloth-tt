
(function(){
	'use strict';
	
	window.Datepicker = new Class({
		Implements: [Events, Options],
		options: {
			year: null,
			month: null,
			day: null,
			onChange: function(){
				this.render();
				// this.fireEvent('select');
			}
		},
		initialize: function(element, options) {
			this.element = $(element);
			
			this.setOptions(options);
			
			if(this.options.year === null) {
				var d = new Date();
				this.setOptions({
					year: d.getUTCFullYear(),
					month: d.getUTCMonth(),
					day: d.getUTCDate()
				});
			}
			
			var self = this;
			
			var yearHeader = new Element('div', {
				'class': 'datepicker-header datepicker-yearheader'
			}).inject(this.element);
			
			new Element('div', {
				'class': 'datepicker-leftarrow',
				'html': '&lt;'
			}).addEvent('click', function(){
				self.set('year', +self.options.year -1);
			}).inject(yearHeader);
			
			new Element('div', {
				'class': 'datepicker-title'
			}).addEvent('click', function(){
				self.set('year', (new Date).getFullYear());
			}).inject(yearHeader);
			
			new Element('div', {
				'class': 'datepicker-rightarrow',
				'html': '&gt;'
			}).addEvent('click', function(){
				self.set('year', +self.options.year +1);
			}).inject(yearHeader);
			
			var monthHeader = new Element('div', {
				'class': 'datepicker-header datepicker-monthheader'
			}).inject(this.element);
			
			new Element('div', {
				'class': 'datepicker-leftarrow',
				'html': '&lt;'
			}).addEvent('click', function(){
				self.options.month > 0?
					self.set('month', +self.options.month -1):
					self.set('month', 11);
			}).inject(monthHeader);
			
			new Element('div', {
				'class': 'datepicker-title'
			}).addEvent('click', function(){
				self.set('month', (new Date).getMonth());
			}).inject(monthHeader);
			
			new Element('div', {
				'class': 'datepicker-rightarrow',
				'html': '&gt;'
			}).addEvent('click', function(){
				self.options.month < 11 ?
					self.set('month', +self.options.month +1) :
					self.set('month', 0);
			}).inject(monthHeader);
			
			var body = new Element('div', {
				'class': 'datepicker-body'
			}).inject(this.element);
			
			for(var w=0; w<6; w++) {
				var week = new Element('div', {
					'class': 'datepicker-week'
				}).inject(body);
				for(var d=0; d<7; d++) {
					new Element('div', {
						'class': 'datepicker-day datepicker-day'+(d+7*w)
					}).addEvent('click', function(event){
						var date = event.target.get('data-date');
						var match = date.match(/(\d+)\/(\d+)\/(\d+)/);
						self.set('year', match[1]);
						self.set('month', match[2]);
						self.set('day', match[3]);
						self.fireEvent('select');
					}).inject(week);
				}
			}
			
			this.render();
			//this.fireEvent('select');
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
			var year = this.get('year');
			var month = this.get('month');
			var day = this.get('day');
			
			var now = new Date();
			var date = new Date(year, month, day);
			var wd = (new Date(year, month)).getDay();
			
			this.element.getElement('.datepicker-yearheader .datepicker-title').set('html', year);
			this.element.getElement('.datepicker-monthheader .datepicker-title').set('html', this.translate('month:'+month));
			
			for(var w=0; w<6; w++) {
				for(var d=0; d<7; d++) {
					var dt = new Date(year, month, 1 -wd +(d+7*w) +1);
					var el = this.element.getElement('.datepicker-day'+(d+7*w));
					if(dt.getMonth() == date.getMonth() && dt.getDate() == date.getDate()){
						el.addClass('datepicker-dayselected').removeClass('datepicker-othermonth').set('html', dt.getDate());
					}
					else if(dt.getMonth() != date.getMonth()) {
						el.addClass('datepicker-othermonth').removeClass('datepicker-dayselected').set('html', dt.getDate());
					}
					else {
						el.removeClass('datepicker-dayselected datepicker-othermonth').set('html', dt.getDate());
					}
					this.element.getElement('.datepicker-day'+(d+7*w)).set('data-date', dt.getFullYear()+'/'+dt.getMonth()+'/'+dt.getDate());
				}
			}
		},
		translate: function(what){
			return this._translate[what];
		},
		_translate: {
			'month:0': 'January',
			'month:1': 'February',
			'month:2': 'March',
			'month:3': 'April',
			'month:4': 'May',
			'month:5': 'June',
			'month:6': 'July',
			'month:7': 'August',
			'month:8': 'September',
			'month:9': 'October',
			'month:10': 'Noveber',
			'month:11': 'December',
		}
	});
	
})();
