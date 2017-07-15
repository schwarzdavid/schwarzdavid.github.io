(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var activeTrigger = document.querySelectorAll('[data-target-active]');
		var languages = document.querySelectorAll('#languages .lang canvas');

		if(!window.localStorage.getItem('cookiesAccepted')){
			var cookieEl = document.querySelector('#cookies');

			cookieEl.style.display = 'block';
			cookieEl.addEventListener('click', function (e) {
				e.preventDefault();
				window.localStorage.setItem('cookiesAccepted', 'yes');
				cookieEl.style.display = 'none';
			});
		}

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

		for(var i = 0; i < languages.length; i++){
			var ctx = languages[i].getContext('2d');
			var length = parseInt(window.getComputedStyle(languages[i]).width);
			var strokeWidth = 15;
			var backgroundStroke = '#eaeaea';
			var foregroundStroke = '#2c2c2c';
			var value = parseInt(languages[i].dataset.value);

			languages[i].width = languages[i].height = length;

			ctx.lineWidth = strokeWidth;

			ctx.beginPath();
			ctx.strokeStyle = backgroundStroke;
			ctx.arc(length / 2, length / 2, length / 2 - strokeWidth, 0, 2*Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = foregroundStroke;
			ctx.arc(length / 2, length / 2, length / 2 - strokeWidth, -Math.PI/2, 2*Math.PI/100*value - Math.PI/2);
			ctx.stroke();
		}
	});
}());