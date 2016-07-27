
(function(){
	'use strict';
	
	window.addEvent('domready', function(){
		
		var timer = new window.MVC.Timer();
		
		// Edit title view
		new window.MVC.BaseView({
			model: timer,
			element: 'edit-title-value',
			property: 'value',
			template: '<%=title%>',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:title', function(){self.render();});
				
				this.render();
			},
			events: {
				'keyup': 'update'
			},
			onUpdate: function(){
				this.model.set('title', this.element.get('value'));
			}
		});
		
		// Back to timer button
		new window.MVC.BaseView ({
			model: timer,
			element: 'back-to-timer',
			property: 'href',
			template: '',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:titleURI', function(){self.render();});
				this.listenTo(this.model, 'change:timerColor', function(){self.render();});
				this.listenTo(this.model, 'change:setYear', function(){self.render();});
				this.listenTo(this.model, 'change:setMonth', function(){self.render();});
				this.listenTo(this.model, 'change:setDay', function(){self.render();});
				this.listenTo(this.model, 'change:setHour', function(){self.render();});
				this.listenTo(this.model, 'change:setMinute', function(){self.render();});
				this.listenTo(this.model, 'change:setSecond', function(){self.render();});
			},
			onRender: function(){
				var json = this.model.toJSON();
				if(!isNaN(+json.setMonth)) {
					json.setMonth = +json.setMonth +1;
				}
				this.element.set(this.options.property, this.template(json, '/timer/<%=titleURI%>/<%=timerColor%>/<%=setYear%>/<%=setMonth%>/<%=setDay%>/<%=setHour%>/<%=setMinute%>/<%=setSecond%>'));
			}
		});
		
		// Open timer link
		new window.MVC.BaseView ({
			model: timer,
			element: 'open-edit-link',
			property: 'href',
			template: '',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:titleURI', function(){self.render();});
				this.listenTo(this.model, 'change:timerColor', function(){self.render();});
				this.listenTo(this.model, 'change:setYear', function(){self.render();});
				this.listenTo(this.model, 'change:setMonth', function(){self.render();});
				this.listenTo(this.model, 'change:setDay', function(){self.render();});
				this.listenTo(this.model, 'change:setHour', function(){self.render();});
				this.listenTo(this.model, 'change:setMinute', function(){self.render();});
				this.listenTo(this.model, 'change:setSecond', function(){self.render();});
			},
			onRender: function(){
				var json = this.model.toJSON();
				if(!isNaN(+json.setMonth)) {
					json.setMonth = +json.setMonth +1;
				}
				this.element.set(this.options.property, this.template(json, '/timer/<%=titleURI%>/<%=timerColor%>/<%=setYear%>/<%=setMonth%>/<%=setDay%>/<%=setHour%>/<%=setMinute%>/<%=setSecond%>'));
			}
		});
		
		var matches = location.href.replace(/^.*?edit\//, '').match(/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/?/);
		if(matches && matches.length == 9) {
			if(!isNaN(+matches[4])) {
				matches[4] = +matches[4] -1;
			}
			timer.set({
				title: decodeURIComponent(matches[1].replace(/\%252F/gi, '%2F')),
				timerColor: decodeURIComponent(matches[2]),
				setYear: decodeURIComponent(matches[3]),
				setMonth: decodeURIComponent(matches[4]),
				setDay: decodeURIComponent(matches[5]),
				setHour: decodeURIComponent(matches[6]),
				setMinute: decodeURIComponent(matches[7]),
				setSecond: decodeURIComponent(matches[8]),
				set: true
			});
		}
		else {
			var now = new Date();
			timer.set({
				title: '',
				timerColor: '#333333',
				setYear: now.getFullYear(),
				setMonth: now.getMonth(),
				setDay: now.getDate(),
				setHour: now.getHours(),
				setMinute: now.getMinutes(),
				setSecond: now.getSeconds(),
				set: true
			});
		}
		
		// Date Timer Color Picker
		var datePicker = new window.Datepicker('date-picker', {
			year: timer.get('setYear'),
			month: timer.get('setMonth'),
			day: timer.get('setDay'),
			onSelect: function(){
				timer.set('setYear', +this.get('year'));
				timer.set('setMonth', +this.get('month'));
				timer.set('setDay', +this.get('day'));
			}
		});
		
		var timePicker = new window.Timepicker('time-picker', {
			hour: timer.get('setHour'),
			minute: timer.get('setMinute'),
			onSelect: function(){
				timer.set('setHour', +this.get('hour'));
				timer.set('setMinute', +this.get('minute'));
			}
		});
		
		var colorPicker = new window.Colorpicker('color-picker', {
			color: timer.get('timerColor'),
			colors: ['#333333', '#B2B2B2', '#E54C4C', '#E5994C', '#C5C539', '#52C552', '#39C5C5', '#6666CC', '#C539C5', ],
			onSelect: function(){
				timer.set('timerColor', encodeURIComponent(this.get('color')));
			}
		});
	});
})();
