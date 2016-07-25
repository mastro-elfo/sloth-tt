
(function(){
	'use strict';
	
	window.addEvent('domready', function(){
		var matches = location.href.match(/#!timer\/(.*?)$/);
		if(matches && matches.length == 2) {
			location.href = '/timer/'+matches[1];
		}
	});
	
	window.addEvent('domready', function(){
		var EDIT_VIEW = false;
		
		var timer = new window.MVC.Timer();
		
		// Timer title View
		new window.MVC.BaseView({
			model: timer,
			element: 'timer-title',
			template: '',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:trigger', function(){
					self.options.template = self.model.get('title');
					self.render();
				});
				this.render();
			},
			onRender: function(){
				this.element.setStyle('color', this.model.get('timerColor'));
			}
		});
		
		new window.MVC.BaseView({
			model: timer,
			element: 'timer-timer',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:timerColor', function(){
					self.render();
				});
			},
			onRender: function(){
				this.element.setStyle('color', this.model.get('timerColor'));
			}
		});
		
		// Timer Views
		// Years
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-years',
			param: 'yearDiff',
			mu: 'Y',
			getRender: function(){
				return +this.model.get('yearDiff') != 0;
			}
		});
		// Months
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-months',
			param: 'monthDiff',
			mu: 'M',
			getRender: function(){
				return +this.model.get('yearDiff') != 0 || +this.model.get('monthDiff') != 0;
			}
		});
		// Days
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-days',
			param: 'dayDiff',
			mu: 'd',
			getRender: function(){
				return +this.model.get('yearDiff') != 0 || +this.model.get('monthDiff') != 0 || +this.model.get('dayDiff') != 0;
			}
		});
		// Hours
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-hours',
			param: 'hourDiff',
			mu: 'h',
			getRender: function(){
				return +this.model.get('yearDiff') != 0 || +this.model.get('monthDiff') != 0 || +this.model.get('dayDiff') != 0 || +this.model.get('hourDiff') != 0;
			}
		});
		// Minutes
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-minutes',
			param: 'minuteDiff',
			mu: 'm',
			getRender: function(){
				return +this.model.get('yearDiff') != 0 || +this.model.get('monthDiff') != 0 || +this.model.get('dayDiff') != 0 || +this.model.get('hourDiff') != 0 || +this.model.get('minuteDiff') != 0;
			}
		});
		// Seconds
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-seconds',
			param: 'secondDiff',
			mu: 's'
		});
		// Expired
		new window.MVC.BaseView({
			model: timer,
			element: 'timer-expired',
			template: '<span class="small"> <% if(expired) {print(\'Expired\');} else {print(\'\');} %> </span>',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:expired', function(){self.render();});
			}
		});
		
		// Edit title view
		new window.MVC.BaseView({
			model: timer,
			element: 'edit-title-value',
			property: 'value',
			template: '<%=title%>',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:title', function(){
					if(!EDIT_VIEW) {
						self.element.set('value', self.model.get('title'));
					}
				});
			},
			events: {
				'keyup': 'update'
			},
			onUpdate: function(){
				this.model.set('title', this.element.get('value'));
			}
		});
		
		// Date Timer Color Picker
		var datePicker = new window.Datepicker('date-picker', {
			year: null,
			month: null,
			day: null,
			onSelect: function(){
				timer.set('setYear', +this.get('year'));
				timer.set('setMonth', +this.get('month'));
				timer.set('setDay', +this.get('day'));
			}
		});
		
		var timePicker = new window.Timepicker('time-picker', {
			hour: null,
			minute: null,
			onSelect: function(){
				timer.set('setHour', +this.get('hour'));
				timer.set('setMinute', +this.get('minute'));
			}
		});
		
		var colorPicker = new window.Colorpicker('color-picker', {
			color: '#333333',
			colors: ['#333333', '#B2B2B2', '#E54C4C', '#E5994C', '#C5C539', '#52C552', '#39C5C5', '#6666CC', '#C539C5', ],
			onSelect: function(){
				timer.set('timerColor', this.get('color'));
			}
		});
		
		timer.listenTo(timer, 'change:year', function(){
			if(!EDIT_VIEW) {
				datePicker.set('year', timer.get('year'));
			}
		});
		timer.listenTo(timer, 'change:month', function(){
			if(!EDIT_VIEW) {
				datePicker.set('month', timer.get('month'));
			}
		});
		timer.listenTo(timer, 'change:day', function(){
			if(!EDIT_VIEW) {
				datePicker.set('day', timer.get('day'));
			}
		});
		timer.listenTo(timer, 'change:hour', function(){
			if(!EDIT_VIEW) {
				timePicker.set('hour', timer.get('hour'));
			}
		});
		timer.listenTo(timer, 'change:minute', function(){
			if(!EDIT_VIEW) {
				timePicker.set('minute', timer.get('minute'));
			}
		});
		timer.listenTo(timer, 'change:timerColor', function(){
			if(!EDIT_VIEW) {
				colorPicker.set('color', timer.get('timerColor'));
			}
		});
		
		// Document title
		new window.MVC.BaseView({
			model: timer,
			element: document.getElement('title'),
			onRender: function(){
				this.element.set('html', 'Sloth-tt: ' +this.template(this.model.toJSON(), this.model.get('title')));
			},
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:title', function(){
					self.render();
				});
				this.listenTo(this.model, 'change:trigger', function(){
					self.render();
				});
				this.render();
			}
		});
		
		// QRCode
		new window.MVC.BaseView({
			model: timer,
			element: 'qrcode',
			template: location.href.replace(/#.*$/, '')+'#!timer/<%=titleURI%>/<%=timerColor%>/<%=setYear%>/<%=setMonth%>/<%=setDay%>/<%=setHour%>/<%=setMinute%>/<%=setSecond%>',
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
				var self = this;
				
				this.listenTo(this.model, 'change:titleURI', function(){self.render();});
				this.listenTo(this.model, 'change:timerColor', function(){self.render();});
				this.listenTo(this.model, 'change:setYear', function(){self.render();});
				this.listenTo(this.model, 'change:setMonth', function(){self.render();});
				this.listenTo(this.model, 'change:setDay', function(){self.render();});
				this.listenTo(this.model, 'change:setHour', function(){self.render();});
				this.listenTo(this.model, 'change:setMinute', function(){self.render();});
				this.listenTo(this.model, 'change:setSecond', function(){self.render();});
				
				this.render();
			}
		});
		new window.MVC.DialogView({
			model: timer,
			element: 'qrcode',
			toggleElement: $('qrcode-toggle'),
			dialogElement: $('qrcode-dialog')
		});
		
		// Back to timer button
		new window.MVC.LinkView ({
			model: timer,
			element: 'back-to-timer',
			property: 'href'
		});
		
		// Open timer link
		new window.MVC.LinkView ({
			model: timer,
			element: 'open-edit-link',
			property: 'href'
		});
		
		// Share link
		new window.MVC.LinkView ({
			model: timer,
			element: 'share-link',
			property: 'value',
			events: {
				'click': 'click'
			},
			'onClick': function(){
				this.element.select();
			}
		});
		
		new window.MVC.DialogView({
			model: timer,
			element: 'share-link',
			toggleElement: $('link-toggle'),
			dialogElement: $('link-dialog')
		});
		
		// Share via email
		new window.MVC.LinkView ({
			model: timer,
			element: 'share-email',
			property: 'href',
			beforeLink: 'mailto:?subject=Sloth-tt:%20<%=title%>&body=Hi,%0AI%20want%20to%20share%20this%20timer%20with%20you%0A%0A',
			afterLink: '%0A%0AHave%20a%20nice%20day!'
		});
		
		
		// Share via facebook
		// OG-URL
		new window.MVC.LinkView ({
			model: timer,
			element: 'meta-og-url',
			property: 'content'
		});
		
		// OG-TITLE
		new window.MVC.BaseView({
			model: timer,
			element: 'meta-og-title',
			template: '',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:trigger', function(){
					self.options.template = self.model.get('title');
					self.render();
				});
				this.render();
			}
		});
		
		$('share-on-facebook').addEvent('click', function(){
			window.open('http://www.facebook.com/sharer.php?' +
					'u='+encodeURIComponent(location.href) +
					'&t='+encodeURIComponent(document.title),
					' sharer', 'toolbar=0, status=0, width=626, height=436');
			return false;
		});
		
		// Google share
		new window.MVC.BaseView ({
			model: timer,
			element: 'share-on-google',
			events: {
				'click': 'click'
			},
			onClick: function(){
				window.open('https://plus.google.com/share?url='+encodeURI(location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
				return false;
			}
		});
		
		// Twitter share
		new window.MVC.BaseView ({
			model: timer,
			element: 'share-on-twitter',
			events: {
				'click': 'click'
			},
			onClick: function(){
				window.open('https://twitter.com/intent/tweet?text='+this.model.get('titleURI')+'&url='+encodeURI(location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
				return false;
			}
		});
		
		// Router
		new Epitome.Router({
			routes: {
				'#!edit': 'edit',
				'#!timer/:title/:timerColor/:year/:month/:day/:hour/:minute/:second': 'timer'
			},
			onUndefined: function(){
				location.href = '/edit/';
			},
			onEdit: function(){
				EDIT_VIEW = true;
				$('maincontainer').set('data-page', 'edit');
			},
			onTimer: function(title, timerColor, year, month, day, hour, minute, second) {
				EDIT_VIEW = false;
				if(!isNaN(+month)) {
					month = +month -1;
				}
				timer.set({
					title: decodeURIComponent(title),
					timerColor: timerColor,
					setYear: year,
					setMonth: month,
					setDay: day,
					setHour: hour,
					setMinute: minute,
					setSecond: second,
					set: true
				});
				$('maincontainer').set('data-page', 'timer');
			}
		});
	});
})();
