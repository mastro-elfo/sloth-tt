
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
				yearDiff: -1,			// DateTimer year difference
				setMonth: 0,			// Value set for month
				month: 0,				// Evaluated month
				monthDiff: -1,			// DateTimer month difference
				setDay: 0,				// Value set for day
				day: 0,					// Evaluated day
				dayDiff: -1,			// DateTimer day difference
				setHour: 0,				// Value set for hour
				hour: 0,				// Evaluated hour
				hourDiff: -1,			// DateTimer hour difference
				setMinute: 0,			// Value set for Minute
				minute: 0,				// Evaluated minute
				minuteDiff: -1,			// DateTimer minute difference
				setSecond: 0,			// Value set for second
				second: 0,				// Evaluated second
				secondDiff: -1,			// DateTimer second difference
				expired: false,			// If the timer is expired
				title: '',				// Title
				titleURI: '',			// Title encoded
				timerColor: '#333333',	// Timer color
				trigger: false			// Trigger render
			},
			
			'onChange:title': function(){
				// Set title URI
				this.set('titleURI', encodeURIComponent(this.get('title')).replace(/%2F/gi, '%252F'));
			},
			
			'onReady': function(){
				var self = this;
				setTimeout(function(){
					setInterval(function(){
						self.idle.call(self);
					}, 1000);
					self.idle.call(self);
				}, new Date().getMilliseconds());
				self.idle.call(self);
			}
		},
		idle: function(self){
			if(!this.get('set')) return;
			
			var now = new Date();
			
			var setDateTime = {
				'year': this.get('setYear'),
				'month': this.get('setMonth'),
				'day': this.get('setDay'),
				'hour': this.get('setHour'),
				'minute': this.get('setMinute'),
				'second': this.get('setSecond')
			};
			var dateTime = {};
			
			// Copy setDateTime to dateTime
			for(var i in setDateTime) {
				dateTime[i] = +this.getDateTimeValue(i, setDateTime[i], now, false);
			}
			
			var expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			
			if(this.isKeyword(setDateTime.second) && expired) {
				dateTime.second = +this.getDateTimeValue('second', setDateTime.second, now, true);
				expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			}
			
			if(this.isKeyword(setDateTime.minute) && expired) {
				dateTime.minute = +this.getDateTimeValue('minute', setDateTime.minute, now, true);
				expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			}
			
			if(this.isKeyword(setDateTime.hour) && expired) {
				dateTime.hour = +this.getDateTimeValue('hour', setDateTime.hour, now, true);
				expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			}
			
			if(this.isKeyword(setDateTime.day) && expired) {
				dateTime.day = +this.getDateTimeValue('day', setDateTime.day, now, true);
				expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			}
			
			if(this.isKeyword(setDateTime.month) && expired) {
				dateTime.month = +this.getDateTimeValue('month', setDateTime.month, now, true);
				expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			}
			
			if(this.isKeyword(setDateTime.year) && expired) {
				dateTime.year = +this.getDateTimeValue('year', setDateTime.year, now, true);
				expired = (+new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second) < now);
			}
			
			var refDateTime = new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second);
			var dateTimeDiff = new Date(Math.abs((+refDateTime) - (+now)));
			
			this.set({
				'year': this.getDate('year', refDateTime),
				'month': this.getDate('month', refDateTime),
				'day': this.getDate('day', refDateTime),
				'hour': this.getDate('hour', refDateTime),
				'minute': this.zeroFill(this.getDate('minute', refDateTime)),
				'second': this.zeroFill(this.getDate('second', refDateTime)),
				'yearDiff': this.getDate('year', dateTimeDiff, true) -1970,
				'monthDiff': this.getDate('month', dateTimeDiff, true),
				'dayDiff': this.getDate('day', dateTimeDiff, true) -1,
				'hourDiff': this.getDate('hour', dateTimeDiff, true),
				'minuteDiff': this.getDate('minute', dateTimeDiff, true),
				'secondDiff': this.getDate('second', dateTimeDiff, true),
				'expired': expired,
				'trigger': !this.get('trigger')
			});
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
			//this.element.empty();
			this.empty();
			if(this.options.getRender.call(this)) {
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
			beforeLink: '',
			afterLink: '',
			onReady: function(){
				this.options.template = this.options.beforeLink +location.href.replace(/#.*$/, '') +this.linkTemplate +this.options.afterLink;
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
	
	window.MVC.DialogView = new Class({
		Extends: Epitome.View,
		options: {
			toggleElement: null,
			dialogElement: null,
			dialogOpen: false,
			onReady: function(){
				var self = this;
				
				this.options.toggleElement.addEvent('click', function(){
					self.options.dialogOpen = !self.options.dialogOpen;
					self.render();
				});
				
				var closeBtn = this.options.dialogElement.getElement('.close');
				closeBtn && closeBtn.addEvent('click', function(){
					self.options.dialogOpen = !self.options.dialogOpen;
					self.render();
				});
				
				this.render();
			}
		},
		render: function(){
			if(this.options.dialogOpen) {
				this.options.dialogElement.addClass('open');
			}
			else {
				this.options.dialogElement.removeClass('open');
			}
			this.parent();
			return this;
		}
	});
	
	window.MVC.DialogView2 = new Class({
		Implements: Options,
		initialize: function(options){
			this.setOptions(options);
			
			var self = this;
			
			this.options.toggleElement.addEvent('click', function(){
				self.options.dialogOpen = !self.options.dialogOpen;
				self.render();
			});
			
			var closeBtn = this.options.dialogElement.getElement('.close');
			closeBtn && closeBtn.addEvent('click', function(){
				self.options.dialogOpen = !self.options.dialogOpen;
				self.render();
			});
			
			this.render();
		},
		options: {
			toggleElement: null,
			dialogElement: null,
			dialogOpen: false
		},
		render: function(){
			if(this.options.dialogOpen) {
				this.options.dialogElement.addClass('open');
			}
			else {
				this.options.dialogElement.removeClass('open');
			}
			
			return this;
		}
	});
})();
