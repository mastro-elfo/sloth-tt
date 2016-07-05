
(function(){
	'use strict';
	
	window.MVC = {};
	
	window.MVC.Timer =  new Class({
		Extends: Epitome.Model,
		options: {
			defaults: {
				year: null,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
				title: ' ',
				timerColor: 'inherit'
			},
			'onChange:title': function(){
				//if(this.get('title') == '') {
				//	this.set('title', ' ');
				//}
			}
		},
		reset: function(){
			this.set(this.options.defaults);
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
