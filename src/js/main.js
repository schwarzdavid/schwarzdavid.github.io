(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const _cookieAcceptName = 'cookiesAccepted';
	const _allowedPageNames = {none: '', teaser: 'teaser', resume: 'resume'};
	const _abandonedTitle = '❤ Come back ❤';
	const _defaultTitle = document.title;
	const _circleStrokeWith = 15;
	const _circleBackgroundStroke = '#eaeaea';
	const _circleForegroundStroke = '#2c2c2c';

	//********************************************
	// SELECTORS
	//********************************************
	const cookieElement = document.querySelector('#cookies');
	const triggerElements = document.querySelectorAll('[data-target-active]');
	const circleCanvasElements = document.querySelectorAll('#languages .lang canvas');
	const switchElement = document.body;
	const menuSwitchElement = document.querySelector('#trigger');
	const projectsElement = document.querySelectorAll('#projects .project');

	//********************************************
	// REGISTER EVENT HANDLER
	//********************************************
	menuSwitchElement.addEventListener('click', onMenuSwitchClick);
	document.addEventListener('visibilitychange', onWindowVisibilityChange);
	window.addEventListener('resize', onWindowResize);

	//********************************************
	// INITIALIZATION
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init() {
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

		// Redraw window-size-dependent elements
		onWindowResize();

		// Bind events to all trigger buttons
		for (let i = 0; i < triggerElements.length; i++) {
			const el = triggerElements[i];

			el.addEventListener('click', (e) => {
				e.preventDefault();
				setCurrentPage(el.dataset.targetActive);
			});
		}

		// Bind events to projects
		for (let i = 0; i < projectsElement.length; i++) {
			const el = projectsElement[i];
			const wrapper = el.parentElement;
			const siblings = Array.prototype.slice.call(wrapper.children, 0);
			const position = siblings.indexOf(el);

			el.addEventListener('click', () => {
				if(el.classList.contains('active')){
					return;
				}

				requestAnimationFrame(() => {
					for(let sibling of siblings){
						sibling.classList.remove('active');
					}

					wrapper.style.transform = `translateX(-${position * 100}%)`;
					el.classList.add('active');
				});
			});
		}

	}

	function setCurrentPage(page) {
		if (page && _allowedPageNames.hasOwnProperty(page) < 0) {
			throw new Error('Page not allowed');
		}

		requestAnimationFrame(() => {
			switchElement.dataset.active = page;
		});
	}

	function drawCanvasCircles() {
		for (let i = 0; i < circleCanvasElements.length; i++) {
			let ctx = circleCanvasElements[i].getContext('2d');
			let size = parseInt(window.getComputedStyle(circleCanvasElements[i]).width);
			let value = parseInt(circleCanvasElements[i].dataset.value);

			// TODO: check with firefox
			circleCanvasElements[i].width = circleCanvasElements[i].height = size;

			ctx.lineWidth = _circleStrokeWith;

			ctx.beginPath();
			ctx.strokeStyle = _circleBackgroundStroke;
			ctx.arc(size / 2, size / 2, size / 2 - _circleStrokeWith, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = _circleForegroundStroke;
			ctx.arc(size / 2, size / 2, size / 2 - _circleStrokeWith, -Math.PI / 2, 2 * Math.PI / 100 * value - Math.PI / 2);
			ctx.stroke();
		}
	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onMenuSwitchClick() {
		if (switchElement.dataset.active === _allowedPageNames.none) {
			setCurrentPage(_allowedPageNames.teaser);
		} else {
			setCurrentPage(_allowedPageNames.none);
		}
	}

	function onWindowVisibilityChange() {
		if (!document.hidden) {
			document.title = _defaultTitle;
		} else {
			document.title = _abandonedTitle;
		}
	}

	function onWindowResize() {
		drawCanvasCircles();
	}
}());