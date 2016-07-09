
(function(){
	'use strict';
	
	window.addEvent('domready', function(){
		// Timer model
		var timer = new window.MVC.Timer();
		
		// Timer view
		var timerView = new window.MVC.View({
			model: timer,
			element: 'timer-timer',
			template: '',
			onRender: function(){
				var year = +this.model.get('year');
				var month = (+this.model.get('month') -1) || 0;
				var day = +this.model.get('day') || 0;
				var hour = +this.model.get('hour') || 0;
				var minute = +this.model.get('minute') || 0;
				var second = +this.model.get('second') || 0;
				
				if(year !== null) {
					var delta = (+new Date(year, month, day, hour, minute, second) -new Date()) /1000;
					var expired = false;
					
					if(delta < 0) {
						delta = -delta;
						expired = true;
					}
					
					var days = Math.floor(delta /86400);
					delta -= days *86400;
					
					var hours = Math.floor(delta /3600);
					delta -= hours *3600;
					
					var minutes = Math.floor(delta /60);
					delta -= minutes *60;
					
					var seconds = Math.floor(delta);
					
					this.element.set('html',
									 (days ? days+'<span class="small">d</span> ' : '')+
									 (days||hours ? (hours<10?'0':'')+hours+'<span class="small">h</span> ' : '')+
									 (days||hours||minutes ? (minutes<10?'0':'')+minutes+'<span class="small">m</span> ' : '')+
									 ((seconds<10?'0':'')+seconds+'<span class="small">s</span>')+
									 (expired ? '<br/><span class="small">Expired</span>' : '')
									);
					
					this.element.setStyle('color', this.model.get('timerColor'));
				}
			}
		});
		
		// Re-render each second
		setInterval(function(){
			timerView.render();
		}, 1000);
		
		// Title view
		new window.MVC.View({
			model: timer,
			element: 'timer-title',
			template: '<%=title%>',
			onRender: function(){
				this.element.setStyle('color', this.model.get('timerColor'));
			}
		});
		
		// Document title view
		new window.MVC.View({
			model: timer,
			element: document.getElement('title'),
			template: 'Sloth-tt: <%=title%>'
		});
		
		// Create title view
		new window.MVC.Create({
			model: timer,
			element: 'create-title-value',
			onRender: function(){
				this.element.set('value', this.model.get('title')/*.trim()*/);
			},
			events: {
				'keyup': 'update'
			},
			onUpdate: function(){
				this.model.set('title', this.element.get('value'));
			}
		});
		
		// Create output link
		new window.MVC.Create({
			model: timer,
			element: 'create-output',
			template: location.href.replace(/#.*$/, '')+'#!timer/<%=titleURI%>/<%=timerColor%>/<%=year%>/<%=month%>/<%=day%>/<%=hour%>/<%=minute%>/<%=second%>',
			onRender: function(){
				this.element.set('value', this.template(this.model.toJSON()));
			}
		});
		
		// Link
		new window.MVC.Create({
			model: timer,
			element: 'open-created-link',
			template: '#!timer/<%=titleURI%>/<%=timerColor%>/<%=year%>/<%=month%>/<%=day%>/<%=hour%>/<%=minute%>/<%=second%>',
			onRender: function(){
				this.element.set('href', this.template(this.model.toJSON()));
			},
			onReady: function(){
				this.render();
			}
		});
		
		// Share link
		new window.MVC.Create({
			model: timer,
			element: 'share-link',
			template: location.href.replace(/#.*$/, '')+'#!timer/<%=titleURI%>/<%=timerColor%>/<%=year%>/<%=month%>/<%=day%>/<%=hour%>/<%=minute%>/<%=second%>',
			onRender: function(){
				this.element.set('value', this.template(this.model.toJSON()));
			},
			onReady: function(){
				this.render();
			}
		});
		
		// Back to timer
		new window.MVC.Create({
			model: timer,
			element: 'back-to-timer',
			template: '#!timer/<%=titleURI%>/<%=timerColor%>/<%=year%>/<%=month%>/<%=day%>/<%=hour%>/<%=minute%>/<%=second%>',
			onRender: function(){
				this.element.set('href', this.template(this.model.toJSON()));
			},
			onReady: function(){
				this.render();
			}
		});
		
		// QRCode
		new window.MVC.Create({
			model: timer,
			element: 'qrcode',
			template: location.href.replace(/#.*$/, '')+'#!timer/<%=titleURI%>/<%=timerColor%>/<%=year%>/<%=month%>/<%=day%>/<%=hour%>/<%=minute%>/<%=second%>',
			onRender: function(){
				this.timeout && clearTimeout(this.timeout);
				var self = this;
				// Delay rendering to improve performances
				this.timeout = setTimeout(function(){
					self.empty();
					self.qrcode = new QRCode(self.element, {
						text: self.template(self.model.toJSON()),
						width: 256,
						height: 256,
						colorDark : '#000000',
						colorLight : '#ffffff',
						correctLevel : QRCode.CorrectLevel.H,
					});
				}, 500);
			},
			onReady: function(){
				this.render();
				var self = this;
				$('qrcode-toggle').addEvent('click', function(){
					self.element.addClass('open');
				});
			},
			events: {
				'click': 'close'
			},
			onClose: function(){
				this.element.removeClass('open');
			}
		});
		
		var datePicker = new window.Datepicker('date-picker', {
			year: null,
			month: null,
			day: null,
			onSelect: function(){
				timer.set('year', +this.get('year'));
				timer.set('month', +this.get('month') +1);
				timer.set('day', +this.get('day'));
			}
		});
		
		var timePicker = new window.Timepicker('time-picker', {
			hour: null,
			minute: null,
			onSelect: function(){
				timer.set('hour', +this.get('hour'));
				timer.set('minute', +this.get('minute'));
			}
		});
		
		var colorPicker = new window.Colorpicker('color-picker', {
			color: '#333333',
			colors: ['#333333', '#B2B2B2', '#E54C4C', '#E5994C', '#C5C539', '#52C552', '#39C5C5', '#6666CC', '#C539C5', ],
			onSelect: function(){
				timer.set('timerColor', this.get('color'));
			}
		});
		
		// Router
		new Epitome.Router({
			routes: {
				'#!create': 'create',
				'#!timer/:title/:timerColor/:year/:month/:day/:hour/:minute/:second': 'timerDateTime',
				'#!timer/:title/:timerColor/:year/:month/:day/': 'timerDate'
			},
			onUndefined: function(){
				location.href = '#!create'
			},
			onCreate: function(){
				$('maincontainer').set('data-page', 'create');
			},
			onTimerDate: function(title, timerColor, year, month, day) {
				// Update timer
				timer.set({
					title: decodeURIComponent(title),
					year: year,
					month: month,
					day: day,
					hour: 0,
					minute: 0,
					second: 0,
					timerColor: timerColor
				});
				// Update color picker
				colorPicker.setOptions({
					'color': timerColor
				});
				colorPicker.render();
				// Update date picker
				datePicker.setOptions({
					'year': year,
					'month': month -1,
					'day': day
				});
				datePicker.render();
				// Set visible page
				$('maincontainer').set('data-page', 'timer');
			},
			onTimerDateTime: function(title, timerColor, year, month, day, hour, minute, second) {
				// Update timer
				timer.set({
					title: decodeURIComponent(title),
					year: year,
					month: month,
					day: day,
					hour: hour,
					minute: minute,
					second: second,
					timerColor: timerColor
				});
				// Update color picker
				colorPicker.setOptions({
					'color': timerColor
				});
				colorPicker.render();
				// Update date picker
				datePicker.setOptions({
					'year': year,
					'month': month -1,
					'day': day
				});
				datePicker.render();
				// Update time picker
				timePicker.setOptions({
					'hour': hour,
					'minute': minute
				});
				timePicker.render();
				// Set visible page
				$('maincontainer').set('data-page', 'timer');
			}
		});
	});
})();

(function(){
	window.addEvent('domready', function(){
		var now = new Date();
		var year = +now.getFullYear()+(now.getMonth()>9?1:0);
		$('next-halloween').set('href', '#!timer/Halloween '+year+'&#128123;&#128123;/#333333/'+(year)+'/10/31/0/0/0');
	});
})();
