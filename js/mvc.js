
(function(){
	'use strict';
	
	window.MVC = {};
	
	window.MVC.Timer = new Class({
		Extends: Epitome.Model,
		options: {
			defaults: {
				set: false,				// True first time it's set
				setYear: 0,				// Value set for year
				year: 0,				// Evaluated year
				yearDiff: 0,			// DateTimer year difference
				setMonth: 0,			// Value set for month
				month: 0,				// Evaluated month
				monthDiff: 0,			// DateTimer month difference
				setDay: 0,				// Value set for day
				day: 0,					// Evaluated day
				dayDiff: 0,				// DateTimer day difference
				setHour: 0,				// Value set for hour
				hour: 0,				// Evaluated hour
				hourDiff: 0,			// DateTimer hour difference
				setMinute: 0,			// Value set for Minute
				minute: 0,				// Evaluated minute
				minuteDiff: 0,			// DateTimer minute difference
				setSecond: 0,			// Value set for second
				second: 0,				// Evaluated second
				secondDiff: 0,			// DateTimer second difference
				expired: false,			// If the timer is expired
				title: '',				// Title
				titleURI: '',			// Title encoded
				timerColor: '#333333',	// Timer color
				trigger: false			// Trigger render
			},
			
			'onChange:title': function(){
				// Set title URI
				this.set('titleURI', encodeURIComponent(this.get('title')));
			},
			
			'onReady': function(){
				var self = this;
				setTimeout(function(){
					setInterval(function(){
						var now = new Date();
						
						var setDateTime = {
							'year': self.get('setYear'),
							'month': self.get('setMonth'),
							'day': self.get('setDay'),
							'hour': self.get('setHour'),
							'minute': self.get('setMinute'),
							'second': self.get('setSecond')
						};
						var dateTime = {};
						
						// Copy setDateTime to dateTime
						for(var i in setDateTime) {
							dateTime[i] = +self.getDateTimeValue(i, setDateTime[i], now, false);
						}
						
						console.log(dateTime)
						
						var expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						
						if(self.isKeyword(setDateTime.second) && expired) {
							dateTime.second = +self.getDateTimeValue('second', setDateTime.second, now, true);
							expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						}
						
						if(self.isKeyword(setDateTime.minute) && expired) {
							dateTime.minute = +self.getDateTimeValue('minute', setDateTime.minute, now, true);
							expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						}
						
						if(self.isKeyword(setDateTime.hour) && expired) {
							dateTime.hour = +self.getDateTimeValue('hour', setDateTime.hour, now, true);
							expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						}
						
						if(self.isKeyword(setDateTime.day) && expired) {
							dateTime.day = +self.getDateTimeValue('day', setDateTime.day, now, true);
							expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						}
						
						if(self.isKeyword(setDateTime.month) && expired) {
							dateTime.month = +self.getDateTimeValue('month', setDateTime.month, now, true);
							expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						}
						
						if(self.isKeyword(setDateTime.year) && expired) {
							dateTime.year = +self.getDateTimeValue('year', setDateTime.year, now, true);
							expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
						}
						
						var refDateTime = new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second);
						var dateTimeDiff = new Date(Math.abs((+refDateTime) - (+now)));
						
						//console.log('refDateTime : '+refDateTime);
						//console.log('now         : '+now);
						//console.log('dateTimeDiff: '+dateTimeDiff+' ['+((+refDateTime) - (+now))+']');
						
						self.set({
							'year': self.getDate('year', refDateTime),
							'month': self.getDate('month', refDateTime),
							'day': self.getDate('day', refDateTime),
							'hour': self.getDate('hour', refDateTime),
							'minute': self.zeroFill(self.getDate('minute', refDateTime)),
							'second': self.zeroFill(self.getDate('second', refDateTime)),
							'yearDiff': self.getDate('year', dateTimeDiff, true) -1970,
							'monthDiff': self.getDate('month', dateTimeDiff, true),
							'dayDiff': self.getDate('day', dateTimeDiff, true) -1,
							'hourDiff': self.getDate('hour', dateTimeDiff, true),
							'minuteDiff': self.getDate('minute', dateTimeDiff, true),
							'secondDiff': self.getDate('second', dateTimeDiff, true),
							'expired': expired,
							'trigger': !self.get('trigger')
						});
					}, 1000);
				}, new Date().getMilliseconds());
			}
		},
		getDate: function(property, date, utc) {
			if(utc) {
				switch(property) {
					default: return 0;
					case 'year': return date.getUTCFullYear();
					case 'month': return date.getUTCMonth();
					case 'day': return date.getUTCDate();
					case 'hour': return date.getUTCHours();
					case 'minute': return date.getUTCMinutes();
					case 'second': return date.getUTCSeconds();
				}
			}
			else {
				switch(property) {
					default: return 0;
					case 'year': return date.getFullYear();
					case 'month': return date.getMonth();
					case 'day': return date.getDate();
					case 'hour': return date.getHours();
					case 'minute': return date.getMinutes();
					case 'second': return date.getSeconds();
				}
			}
		},
		isKeyword: function(value){
			if((''+value).search('this') != -1 || (''+value).search('next') != -1) {
				return value;
			}
			else {
				var match = (''+value).match(/\s*(\d+)\s*%\s*(\d+)\s*/);
				if(match && match.length == 3) {
					return match;
				}
				else {
					return false;
				}
			}
		},
		getDateTimeValue: function(property, value, date, expired){
			var keyword = this.isKeyword(value);
			if(keyword == 'this') {
				return this.getDate(property, date);
			}
			else if(keyword == 'next') {
				expired = expired? 1 : 0;
				return this.getDate(property, date) +expired;
			}
			else if(keyword) {
				expired = expired? 1 : 0;
				var v = +keyword[1];
				var ref = +this.getDate(property, date);
				
				while(v < ref +expired) {
					v += +keyword[2];
				}
				return v;
			}
			else {
				return value;
			}
		},
		zeroFill: function(value) {
			if(+value < 10) {
				return '0'+value;
			}
			else {
				return value;
			}
		}
	});
	
	window.MVC.BaseView = new Class({
		Extends: Epitome.View,
		options: {
			property: 'html'
		},
		render: function(){
			this.options.template && this.element.set(this.options.property, this.template(this.model.toJSON()));
			this.parent();
			return this;
		}
	});
	
	window.MVC.TimerView = new Class({
		Extends: Epitome.View,
		options: {
			template: '',
			param: '',
			mu: '',
			'onReady': function(){
				this.options.template = '<%='+this.options.param+'%><span class="small">'+this.options.mu+'</span>';
				var self = this;
				this.listenTo(this.model, 'change:'+this.options.param, function(){
					self.render();
				});
			},
			getRender: function(){
				return true;
			}
		},
		render: function(){
			this.element.empty();
			if(this.model.get('set') && this.options.getRender.call(this)) {
				this.element.set('html', this.template(this.model.toJSON()));
			}
			this.parent();
			return this;
		},
	});
	
	window.MVC.LinkView = new Class({
		Extends: Epitome.View,
		options: {
			property: '',
			onReady: function(){
				this.options.template = location.href.replace(/#.*$/, '')+this.linkTemplate;
				var self = this;
				this.listenTo(this.model, 'change:titleURI', function(){self.render();});
				this.listenTo(this.model, 'change:timerColor', function(){self.render();});
				this.listenTo(this.model, 'change:setYear', function(){self.render();});
				this.listenTo(this.model, 'change:setMonth', function(){self.render();});
				this.listenTo(this.model, 'change:setDay', function(){self.render();});
				this.listenTo(this.model, 'change:setHour', function(){self.render();});
				this.listenTo(this.model, 'change:setMinute', function(){self.render();});
				this.listenTo(this.model, 'change:setSecond', function(){self.render();});
			}
		},
		render: function(){
			var json = this.model.toJSON();
			if(!isNaN(+json.setMonth)) {
				json.setMonth = +json.setMonth +1;
			}
			this.options.template && this.element.set(this.options.property, this.template(json));
			this.parent();
			return this;
		},
		linkTemplate: '#!timer/<%=titleURI%>/<%=timerColor%>/<%=setYear%>/<%=setMonth%>/<%=setDay%>/<%=setHour%>/<%=setMinute%>/<%=setSecond%>'
	});
})();
