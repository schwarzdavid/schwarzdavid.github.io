(function () {
	'use strict';

	let activeTrigger = document.querySelectorAll('[data-target-active]');
	let languages = document.querySelectorAll('#languages .lang canvas');

	if (!window.localStorage.getItem('cookiesAccepted')) {
		let cookieEl = document.querySelector('#cookies');

		cookieEl.style.display = 'block';
		cookieEl.addEventListener('click', (e) => {
			e.preventDefault();
			window.localStorage.setItem('cookiesAccepted', 'yes');
			cookieEl.style.display = 'none';
		});
	}

	document.querySelector('#trigger').addEventListener('click', () => {
		if (document.body.dataset.active === 'teaser') {
			delete document.body.dataset.active;
			return;
		}
		document.body.dataset.active = 'teaser';
	});

	for (let i = 0; i < activeTrigger.length; i++) {
		activeTrigger[i].addEventListener('click', (e) => {
			e.preventDefault();
			let target;
			for(let j of e.path){
				if(j.dataset.hasOwnProperty('targetActive')){
					target = j.dataset.targetActive;
					break;
				}
			}
			document.body.dataset.active = target;
		});
	}

	for (let i = 0; i < languages.length; i++) {
		let ctx = languages[i].getContext('2d');
		let length = parseInt(window.getComputedStyle(languages[i]).width);
		let strokeWidth = 15;
		let backgroundStroke = '#eaeaea';
		let foregroundStroke = '#2c2c2c';
		let value = parseInt(languages[i].dataset.value);

		languages[i].width = languages[i].height = length;

		ctx.lineWidth = strokeWidth;

		ctx.beginPath();
		ctx.strokeStyle = backgroundStroke;
		ctx.arc(length / 2, length / 2, length / 2 - strokeWidth, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = foregroundStroke;
		ctx.arc(length / 2, length / 2, length / 2 - strokeWidth, -Math.PI / 2, 2 * Math.PI / 100 * value - Math.PI / 2);
		ctx.stroke();
	}
}());