(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const _cookieAcceptName = 'cookiesAccepted';
	const _allowedPageNames = ['', 'teaser', 'resume'];

	//********************************************
	// SELECTORS
	//********************************************
	const cookieElement = document.querySelector('#cookies');
	const triggerElements = document.querySelectorAll('[data-target-active]');
	const circleCanvasElements = document.querySelectorAll('#languages .lang canvas');
	const switchElement = document.body;
	const menuSwitchElement = document.querySelector('#trigger');

	//********************************************
	// REGISTER EVENT HANDLER
	//********************************************
	menuSwitchElement.addEventListener('click', onMenuSwitchClick);

	//********************************************
	// INITIALIZATION
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init(){
		// Show console welcome message
		console.info('You like to look under the hood? Check out the source code on github 😎\nhttps://github.com/schwarzdavid/schwarzdavid.rocks');

		// Show cookie hint
		if (!window.localStorage.getItem(_cookieAcceptName)) {
			cookieElement.style.display = 'block';
			cookieElement.addEventListener('click', (e) => {
				e.preventDefault();
				window.localStorage.setItem(_cookieAcceptName, true);
				cookieElement.style.display = 'none';
			});
		}
	}

	function setCurrentPage(page) {
		if(page && _allowedPageNames.indexOf(page) < 0){
			throw new Error('Page not allowed');
		}

		requestAnimationFrame(() => {
			switchElement.dataset.active = 'teaser';
		});
	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onMenuSwitchClick(e) {
		if (switchElement.dataset.active === 'teaser') {
			delete switchElement.dataset.active;
			return;
		}
		requestAnimationFrame(() => {
			switchElement.dataset.active = 'teaser';
		});
	}



















	////////////////////////////////////////////////////////////////////////////////////////////// OLD CONTENT

	for (let i = 0; i < triggerElements.length; i++) {
		triggerElements[i].addEventListener('click', (e) => {
			e.preventDefault();

			let target = e.target.dataset.targetActive;

			if(typeof target !== 'string') {
				for (let j = e.target; j = j.parentElement;) {
					if (j.dataset.hasOwnProperty('targetActive')) {
						target = j.dataset.targetActive;
						break;
					}
				}
			}

			if(typeof target !== 'string'){
				throw new Error("cannot find target attribute");
			}

			requestAnimationFrame(() => {
				switchElement.dataset.active = target;
			});
		});
	}

	for (let i = 0; i < circleCanvasElements.length; i++) {
		let ctx = circleCanvasElements[i].getContext('2d');
		let length = parseInt(window.getComputedStyle(circleCanvasElements[i]).width);
		let strokeWidth = 15;
		let backgroundStroke = '#eaeaea';
		let foregroundStroke = '#2c2c2c';
		let value = parseInt(circleCanvasElements[i].dataset.value);

		circleCanvasElements[i].width = circleCanvasElements[i].height = length;

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