(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var activeTrigger = document.querySelectorAll('[data-target-active]');

		document.querySelector('#trigger').addEventListener('click', function () {
			if(document.body.dataset.active === 'teaser') {
				delete document.body.dataset.active;
				return;
			}
			document.body.dataset.active = 'teaser';
		});

		for(var i = 0; i < activeTrigger.length; i++){
			activeTrigger[i].addEventListener('click', function(e) {
				e.preventDefault();
				document.body.dataset.active = this.dataset.targetActive;
			});
		}
	});
}());