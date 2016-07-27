
(function(){
	'use strict';
	
	window.addEvent('domready', function(){
		
		var timer = new window.MVC.Timer();
		
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
				return (+this.model.get('yearDiff') != 0) || (+this.model.get('monthDiff') != 0);
			}
		});
		
		// Days
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-days',
			param: 'dayDiff',
			mu: 'd',
			getRender: function(){
				return (+this.model.get('yearDiff') != 0) || (+this.model.get('monthDiff') != 0) || (+this.model.get('dayDiff') != 0);
			}
		});
		
		// Hours
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-hours',
			param: 'hourDiff',
			mu: 'h',
			getRender: function(){
				return (+this.model.get('yearDiff') != 0) || (+this.model.get('monthDiff') != 0) || (+this.model.get('dayDiff') != 0) || (+this.model.get('hourDiff') != 0);
			}
		});
		
		// Minutes
		new window.MVC.TimerView({
			model: timer,
			element: 'timer-minutes',
			param: 'minuteDiff',
			mu: 'm',
			getRender: function(){
				return (+this.model.get('yearDiff') != 0) || (+this.model.get('monthDiff') != 0) || (+this.model.get('dayDiff') != 0) || (+this.model.get('hourDiff') != 0) || (+this.model.get('minuteDiff') != 0);
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
		
		// Timer color
		new window.MVC.BaseView({
			model: timer,
			element: 'timer-timer',
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:timerColor', function(){
					self.render();
				});
				this.render();
			},
			onRender: function(){
				this.element.setStyle('color', this.model.get('timerColor'));
			}
		});
		
		var matches = location.href.replace(/^.*?timer\//, '').match(/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/?/);
		// TODO: fill fields
		
		if(matches && matches.length == 9) {
			if(!isNaN(+matches[4])) {
				matches[4] = +matches[4] -1;
			}
			timer.set({
				title: decodeURIComponent(matches[1].replace(/\%252F/gi, '%2F')),
				timerColor: matches[2],
				setYear: matches[3],
				setMonth: matches[4],
				setDay: matches[5],
				setHour: matches[6],
				setMinute: matches[7],
				setSecond: matches[8],
				set: true
			});
		}
		
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
		
		// Document title
		new window.MVC.BaseView({
			model: timer,
			element: document.getElement('title'),
			onRender: function(){
				this.element.set('html', 'Sloth-tt: ' +this.template(this.model.toJSON(), this.model.get('title')));
			},
			onReady: function(){
				var self = this;
				this.listenTo(this.model, 'change:trigger', function(){
					self.render();
				});
				this.render();
			}
		});
		
		$('header-title').setStyle('display', 'none');
	});
	
	window.addEvent('domready', function(){
		// Share link
		
		$('share-link').set('value', location.href).addEvent('click', function(){
			this.select();
		});
		
		new window.MVC.DialogView2({
			element: 'share-link',
			toggleElement: $('link-toggle'),
			dialogElement: $('link-dialog')
		});
	});
	
	window.addEvent('domready', function(){
		new QRCode('qrcode', {
			text: location.href,
			width: 256,
			height: 256,
			colorDark : '#000000',
			colorLight : '#ffffff',
			correctLevel : QRCode.CorrectLevel.H,
		});
		
		new window.MVC.DialogView2({
			element: 'qrcode',
			toggleElement: $('qrcode-toggle'),
			dialogElement: $('qrcode-dialog')
		});
	});
	
	window.addEvent('domready', function(){
		// Share via email
		$('share-email').set('href', 'mailto:?subject=Sloth-tt:%20<%=title%>&body=Hi,%0AI%20want%20to%20share%20this%20timer%20with%20you%0A%0A'+encodeURI(location.href)+'%0A%0AHave%20a%20nice%20day!');
	});
	
	window.addEvent('domready', function(){
		// Share via facebook
		$('share-on-facebook').addEvent('click', function(){
			$('meta-og-url').set('content', location.href);
			$('meta-og-title').set('content', document.title);
			$('meta-og-image').set('content', location.origin+'/media/timer.png');
			window.open('http://www.facebook.com/sharer.php?' +
					'u='+encodeURIComponent(location.href) +
					'&t='+encodeURIComponent(document.title),
					' sharer', 'toolbar=0, status=0, width=626, height=436');
			return false;
		});
	});
	
	window.addEvent('domready', function(){
		// Google share
		$('share-on-google').addEvent('click', function(){
			window.open('https://plus.google.com/share?url='+encodeURIComponent(location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		});
	});
	
	window.addEvent('domready', function(){
		// Twitter share
		$('share-on-twitter').addEvent('click', function(){
			window.open('https://twitter.com/intent/tweet?text='+this.model.get('titleURI')+'&url='+encodeURIComponent(location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		});
	});
	
	window.addEvent('domready', function(){
		$('open-edit').set('href', location.href.replace(/(^.*?)\/timer\//, '$1/edit/'));
	});
})();
