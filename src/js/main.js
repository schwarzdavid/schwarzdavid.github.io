(function (win) {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const _allowedPageNames = {none: '', teaser: 'teaser', resume: 'resume'};
	const _cookieAcceptName = 'cookiesAccepted';
	const _circleBackgroundStroke = '#eaeaea';
	const _circleForegroundStroke = '#2c2c2c';
	const _circleStrokeWith = 15;
	const _inputFilledClass = 'filled';
	const _invertMeClass = 'invertMe';
	const _projectActiveClass = 'active';

	//********************************************
	// SELECTORS
	//********************************************
	const elCookieHint = document.querySelector('#cookies');
	const elSwitch = document.body;
	const elMenuSwitch = document.querySelector('#trigger');
	const elMap = document.querySelector('#map');
	const elsTriggers = document.querySelectorAll('[data-target-active]');
	const elsCircleCanvas = document.querySelectorAll('#languages .lang canvas');
	const elsProjects = document.querySelectorAll('#projects .project');
	const elsInput = document.querySelectorAll('#contact input, #contact textarea');
	const elsSensible = document.querySelectorAll(`a.${_invertMeClass}`);

	//********************************************
	// REGISTER EVENT HANDLER
	//********************************************
	elMenuSwitch.addEventListener('click', onMenuSwitchClick);
	window.addEventListener('resize', onWindowResize);

	//********************************************
	// EXPORTS
	//********************************************
	win.initMap = initMap;

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
			elCookieHint.style.display = 'block';
			elCookieHint.addEventListener('click', (e) => {
				e.preventDefault();
				window.localStorage.setItem(_cookieAcceptName, true);
				elCookieHint.style.display = 'none';
			});
		}

		// Redraw window-size-dependent elements
		onWindowResize();

		// Bind events to all trigger buttons
		for (let i = 0; i < elsTriggers.length; i++) {
			const el = elsTriggers[i];

			el.addEventListener('click', (e) => {
				e.preventDefault();
				setCurrentPage(el.dataset.targetActive);
			});
		}

		// Bind events to projects
		for (let i = 0; i < elsProjects.length; i++) {
			const el = elsProjects[i];
			const wrapper = el.parentElement;
			const siblings = Array.prototype.slice.call(wrapper.children, 0);
			const position = siblings.indexOf(el);

			el.addEventListener('click', () => {
				if (el.classList.contains(_projectActiveClass)) {
					return;
				}

				requestAnimationFrame(() => {
					for (let sibling of siblings) {
						sibling.classList.remove(_projectActiveClass);
					}

					wrapper.style.transform = `translateX(-${position * 100}%)`;
					el.classList.add(_projectActiveClass);
				});
			});
		}

		// Bind events to inputs
		for(let i = 0; i < elsInput.length; i++){
			const el = elsInput[i];

			el.addEventListener('keyup', () => {
				requestAnimationFrame(() => {
					if (el.value) {
						return el.classList.add(_inputFilledClass);
					}
					el.classList.remove(_inputFilledClass);
				});
			});
		}

		// Inverts content
		for(let i = 0; i < elsSensible.length; i++){
			const el = elsSensible[i];
			let invertedText = el.textContent.split('').reverse().join('');

			el.textContent = invertedText;
			el.classList.remove(_invertMeClass);

			if(el.nodeName === 'A'){
				let prefix = el.href.split('#')[1];
				el.href = (prefix ? prefix + ':' : '') + invertedText;
			}
		}
	}

	function setCurrentPage(page) {
		if (page && _allowedPageNames.hasOwnProperty(page) < 0) {
			throw new Error('Page not allowed');
		}

		requestAnimationFrame(() => {
			elSwitch.dataset.active = page;
		});
	}

	function drawCanvasCircles() {
		for (let i = 0; i < elsCircleCanvas.length; i++) {
			let ctx = elsCircleCanvas[i].getContext('2d');
			let size = parseInt(window.getComputedStyle(elsCircleCanvas[i]).width);
			let value = parseInt(elsCircleCanvas[i].dataset.value);

			// TODO: check with firefox
			elsCircleCanvas[i].width = elsCircleCanvas[i].height = size;

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

	function initMap() {
		let markerPosition = {
			lat: 48.202765,
			lng: 16.303881
		};

		let mapPosition = {
			lat: markerPosition.lat - 0.005,
			lng: markerPosition.lng
		};

		let map = new google.maps.Map(elMap, {
			center: mapPosition,
			zoom: 11,
			clickableIcons: false,
			disableDefaultUI: true,
			keyboardShortcuts: false,
			zoomControl: false,
			scrollwheel: false,
			styles: [{
				"stylers": [{
					"hue": "#000000"
				}, {
					saturation: -110
				}, {
					gamma: 1.7
				}]
			}]
		});

		let marker = new google.maps.Marker({
			position: markerPosition,
			map: map
		});
	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onMenuSwitchClick() {
		if (elSwitch.dataset.active === _allowedPageNames.none) {
			setCurrentPage(_allowedPageNames.teaser);
		} else {
			setCurrentPage(_allowedPageNames.none);
		}
	}

	function onWindowResize() {
		drawCanvasCircles();
	}
}(window));