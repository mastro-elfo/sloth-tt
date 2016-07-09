
(function(){
	'use strict';
	
	window.MVC = {};
	
	window.MVC.Timer =  new Class({
		Extends: Epitome.Model,
		options: {
			defaults: {
				set: false,
				setYear: 0,
				year: 0,
				setMonth: 0,
				month: 0,
				setDay: 0,
				day: 0,
				setHour: 0,
				hour: 0,
				setMinute: 0,
				minute: 0,
				setSecond: 0,
				second: 0,
				title: '',
				titleURI: '',
				timerColor: 'inherit',
				trigger: false
			},
			'onChange:title': function(){
				this.set('titleURI', encodeURIComponent(this.get('title')));
			},
			onReady: function(){
				var self = this;
				setTimeout (function(){
					setInterval(function(){
						var now = new Date();
						var expired = false;
						
						self.set('year', self.getDateTimeValue('year', self.get('setYear'), now));
						self.set('month', self.getDateTimeValue('month', self.get('setMonth'), now));
						self.set('day', self.getDateTimeValue('day', self.get('setDay'), now));
						self.set('hour', self.getDateTimeValue('hour', self.get('setHour'), now));
						self.set('minute', self.getDateTimeValue('minute', self.get('setMinute'), now));
						self.set('second', self.getDateTimeValue('second', self.get('setSecond'), now));
						
						expired = (+new Date(self.get('year'), self.get('month') -1, self.get('day'), self.get('hour'), self.get('minute'), self.get('second')) < now);
						expired && self.set('second', self.getDateTimeValue('second', self.get('setSecond'), now, true));
						
						expired = (+new Date(self.get('year'), self.get('month') -1, self.get('day'), self.get('hour'), self.get('minute'), self.get('second')) < now);
						expired && self.set('minute', self.getDateTimeValue('minute', self.get('setMinute'), now, true));
						
						expired = (+new Date(self.get('year'), self.get('month') -1, self.get('day'), self.get('hour'), self.get('minute'), self.get('second')) < now);
						expired && self.set('hour', self.getDateTimeValue('hour', self.get('setHour'), now, true));
						
						expired = (+new Date(self.get('year'), self.get('month') -1, self.get('day'), self.get('hour'), self.get('minute'), self.get('second')) < now);
						expired && self.set('day', self.getDateTimeValue('day', self.get('setDay'), now, true));
						
						expired = (+new Date(self.get('year'), self.get('month') -1, self.get('day'), self.get('hour'), self.get('minute'), self.get('second')) < now);
						expired && self.set('month', self.getDateTimeValue('month', self.get('setMonth'), now, true));
						
						expired = (+new Date(self.get('year'), self.get('month') -1, self.get('day'), self.get('hour'), self.get('minute'), self.get('second')) < now);
						expired && self.set('year', self.getDateTimeValue('year', self.get('setYear'), now, true));
						
						self.set('trigger', !self.get('trigger'));
					}, 1000);
				}, new Date().getMilliseconds());
			}
		},
		reset: function(){
			this.set(this.options.defaults);
		},
		zeroFill: function(value){
			return +value < 10? '0'+value : value;
		},
		getDateTimeValue: function(prop, value, date, expired) {
			if(value == 'this' || value == 'next') {
				expired = (value == 'next' && expired)? 1 : 0;
				switch(prop){
					default: return 0;
					case 'year': return this.zeroFill(+date.getFullYear() +expired);
					case 'month': return this.zeroFill(+date.getMonth() +1 +expired);
					case 'day': return this.zeroFill(+date.getDate() +expired);
					case 'hour': return this.zeroFill(+date.getHours() +expired);
					case 'minute': return this.zeroFill(+date.getMinutes() +expired);
					case 'second': return this.zeroFill(+date.getSeconds() +expired);
				}
			}
			else {
				var match = (''+value).match(/\s*(\d+)\s*%\s*(\d+)\s*/);
				if(match && match.length == 3) {
					expired = expired? 1 : 0;
					var v = +match[1];
					var ref = +this.getDateTimeValue(prop, 'this', date, false);
					
					while(v < ref +expired) {
						v += +match[2];
					}
					return this.zeroFill(v);
				}
				else {
					return this.zeroFill(value);
				}
			}
		}
	});
	
	window.MVC.View = new Class({
		Extends: Epitome.View,
		options: {
			onReady: function(){
				this.render();
			},
			'onChange:model': function(){
				this.render();
			}
		},
		render: function(){
			this.options.template && this.element.set('html', this.template(this.model.toJSON()));
			this.parent();
			return this;
		}
	});
	
	window.MVC.Create = new Class({
		Extends: Epitome.View,
		options: {
			'onChange:model': function(){
				this.render();
			}
		},
		render: function(){
			this.parent();
			return this;
		}
	});
})();
